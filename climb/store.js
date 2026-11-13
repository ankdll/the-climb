/*
  THE CLIMB — data layer
  ======================

  Everything about your progress lives here: saving and loading it, and working
  out where you are in each subject. The screens (app.js) only ask this file
  questions and tell it what happened; they never touch storage directly.

  The Climb is a small school: Data is the major, Spanish the minor and German
  an elective that unlocks later. Each subject has its own plan file
  (curriculum.js, spanish.js, german.js) and its own progress, so the same
  questions ("what's next?", "hours this week?") are asked of one subject:
  Store.subject("spanish").current().

  Progress is saved separately from the plan files, so editing a plan never
  wipes your history. Opened from the web (GitHub Pages), it's saved in your
  own Supabase database, behind your sign-in, and syncs across your devices;
  opened as a local file, it's saved in this browser's localStorage. If saving fails, the app keeps
  working for that session and says so quietly.
*/

const Store = (function () {
  const KEY = "climb.progress";
  const VERSION = 2; // 1 = Data only (before subjects); 2 = per subject

  let state = null;
  let storageOk = true;
  const listeners = [];


  // ─── Dates ─────────────────────────────────────────────────────────────
  // All dates are local calendar dates as "YYYY-MM-DD" strings, so a session at
  // 11pm counts for that day wherever you are.

  function isoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function today() {
    return isoDate(new Date());
  }

  function parseDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  // Weeks start on Monday. Returns the Monday's date for any given date.
  function weekOf(iso) {
    const d = parseDate(iso);
    const offset = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
    d.setDate(d.getDate() - offset);
    return isoDate(d);
  }

  function addDays(iso, n) {
    const d = parseDate(iso);
    d.setDate(d.getDate() + n);
    return isoDate(d);
  }

  const isISODate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

  // ─── The subjects ──────────────────────────────────────────────────────
  // The plan files are loaded before this one. German stays locked until the
  // Spanish Term 2 exam is ticked; that's worked out from your progress each
  // time, not stored, so it can never get out of step.

  const SUBJECT_DEFS = [
    {
      id: "data",
      name: "Data",
      role: "Major",
      plan: () => CURRICULUM,
      // Short extras beside the plan (sidemodule-*.js). They never change the
      // day count; see "Side modules" below.
      sideModules: () => [
        typeof SIDE_FINANCE !== "undefined" ? SIDE_FINANCE : null,
        typeof SIDE_SITE !== "undefined" ? SIDE_SITE : null,
        typeof SIDE_ETL !== "undefined" ? SIDE_ETL : null
      ],
      hours: { normal: "5–7 hrs", light: "9–10 hrs" },
      defaultTarget: 5,
      lightWeek: {
        minutes: 60,
        maxPerWeek: 3,
        weekdaysOnly: true,
        label: "Extra hour: get ahead, or work on your deliverable",
        detail: "Light week bonus. Push on with the next tasks above, or spend it on this phase's portfolio project or your portfolio site. Two or three of these this week.",
        url: ""
      }
    },
    {
      id: "spanish",
      name: "Spanish",
      role: "Minor",
      plan: () => (typeof SPANISH !== "undefined" ? SPANISH : null),
      hours: { normal: "about 2 hrs", light: "3–4 hrs" },
      defaultTarget: 2,
      lightWeek: {
        minutes: 15,
        maxPerWeek: 7,
        weekdaysOnly: false,
        label: "Extra 15 minutes of listening",
        detail: "Light week bonus. Any Dreaming Spanish video at your level: easy, no pausing, just listen.",
        url: "https://www.youtube.com/@DreamingSpanish/videos"
      }
    },
    {
      id: "german",
      name: "German",
      role: "Elective",
      plan: () => (typeof GERMAN !== "undefined" ? GERMAN : null),
      hours: { normal: "1–2 hrs", light: "1–2 hrs" }, // light weeks never add German
      defaultTarget: 1.5,
      unlockedBy: { subject: "spanish", taskId: "es-t2-exam", text: "Unlocks when you mark the Spanish Term 2 exam done." }
    }
  ].filter((d) => d.plan());

  // ─── Shape of saved progress ───────────────────────────────────────────
  //   version, settings: { theme, lightWeek }, subjects: { data: {…}, spanish: {…}, german: {…} }
  // lightWeek is the Monday of the week it's switched on for, so it switches
  // itself off when the next week starts.

  function blankSubject(def) {
    return {
      startDate: null,
      completedTaskIds: [],
      sessionLog: [],          // { date, minutes, note, taskId, extra? } — extra: a light-week bonus block
      notes: {},               // moduleId → free text
      portfolioLinks: {},      // phaseId → URL (Data only, in practice)
      skipped: { date: null, taskIds: [] }, // "Not today" — only applies on that date
      weeklyHoursTarget: def ? def.defaultTarget : 5
    };
  }

  function blank() {
    const subjects = {};
    SUBJECT_DEFS.forEach((d) => { subjects[d.id] = blankSubject(d); });
    return { version: VERSION, settings: { theme: "auto", lightWeek: null }, subjects };
  }

  const byDate = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

  // Takes one subject's saved progress (possibly old, partial or hand-edited)
  // and returns a clean copy. Anything unrecognisable falls back to the default.
  function normaliseSubject(raw, def) {
    const out = blankSubject(def);
    if (!raw || typeof raw !== "object") return out;

    if (isISODate(raw.startDate)) out.startDate = raw.startDate;

    if (Array.isArray(raw.completedTaskIds)) {
      out.completedTaskIds = [...new Set(raw.completedTaskIds.filter((id) => typeof id === "string"))];
    }

    if (Array.isArray(raw.sessionLog)) {
      out.sessionLog = raw.sessionLog
        .filter((s) => s && isISODate(s.date))
        .map((s) => {
          const entry = {
            date: s.date,
            minutes: Math.max(0, Math.round(Number(s.minutes) || 0)),
            note: typeof s.note === "string" ? s.note : "",
            taskId: typeof s.taskId === "string" ? s.taskId : null
          };
          if (s.extra === true) entry.extra = true;
          return entry;
        })
        .sort(byDate); // oldest first, always
    }

    for (const field of ["notes", "portfolioLinks"]) {
      if (raw[field] && typeof raw[field] === "object") {
        // Sorted, so the same progress always comes out the same, whatever order it was saved in.
        for (const [k, v] of Object.entries(raw[field]).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
          if (typeof v === "string") out[field][k] = v;
        }
      }
    }

    if (raw.skipped && isISODate(raw.skipped.date) && Array.isArray(raw.skipped.taskIds)) {
      out.skipped = { date: raw.skipped.date, taskIds: raw.skipped.taskIds.filter((id) => typeof id === "string") };
    }

    const target = Number(raw.weeklyHoursTarget);
    if (target > 0 && target < 100) out.weeklyHoursTarget = target;

    return out;
  }

  // Before subjects (version 1), progress was Data's alone, at the top level.
  const isVersion1 = (raw) => !raw.subjects && (Array.isArray(raw.completedTaskIds) || Array.isArray(raw.sessionLog));

  // Takes whatever was saved, in either version, and returns clean progress.
  // Version 1 progress becomes the Data subject, with nothing renamed or lost.
  function normalise(raw) {
    const out = blank();
    if (!raw || typeof raw !== "object") return out;

    if (isVersion1(raw)) {
      const data = SUBJECT_DEFS[0];
      out.subjects.data = normaliseSubject(
        { ...raw, weeklyHoursTarget: raw.settings && raw.settings.weeklyHoursTarget },
        data
      );
    } else if (raw.subjects && typeof raw.subjects === "object") {
      SUBJECT_DEFS.forEach((d) => { out.subjects[d.id] = normaliseSubject(raw.subjects[d.id], d); });
    }

    if (raw.settings && typeof raw.settings === "object") {
      if (["auto", "light", "dark"].includes(raw.settings.theme)) out.settings.theme = raw.settings.theme;
      if (isISODate(raw.settings.lightWeek)) out.settings.lightWeek = raw.settings.lightWeek;
    }

    return out;
  }

  // Saved by a newer version of The Climb than this one (another device that
  // updated first). This copy must not save over it.
  const tooNew = (raw) => !!raw && typeof raw === "object" && Number(raw.version) > VERSION;

  // ─── Where progress is kept ────────────────────────────────────────────
  // Two places, picked when the app starts:
  //   synced — opened from the web: one row in your Supabase database
  //            (config.js says which one). Only you can read or write it: the
  //            database checks your sign-in on every request.
  //   local  — opened as a file on this computer: the browser's localStorage,
  //            exactly as before.
  //
  // Your progress is held in memory while the app is open. Only two things touch
  // storage, and both are async: loading once at start-up, and saving after a
  // change. Every question the screens ask reads the copy in memory, so the
  // screens stay instant and never wait on the network.
  //
  // Saves run one at a time, in order. If several changes land while a save is
  // running, the next save writes the latest state once, instead of every step.

  const TABLE = "progress";
  const LOAD_TIMEOUT_MS = 20000;

  let backend = null;   // { name, load(), write(state), watch?(fn), refresh?(fn) }
  let fresh = false;    // nothing was saved anywhere before this visit
  let client = null;    // the Supabase connection, when synced
  let user = null;      // who's signed in, when synced
  const statusListeners = [];

  function readStorage() {
    let text = null;
    try {
      text = window.localStorage.getItem(KEY);
    } catch (e) {
      storageOk = false;
      return null;
    }
    if (text == null) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      // Saved data is damaged. Keep a copy rather than overwrite it, then start clean.
      try {
        window.localStorage.setItem(`${KEY}.damaged.${Date.now()}`, text);
      } catch (e2) { /* nothing more we can do */ }
      return null;
    }
  }

  const localBackend = {
    name: "local",
    async load() {
      return readStorage();
    },
    async write(s) {
      window.localStorage.setItem(KEY, JSON.stringify(s));
    }
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Supabase answers with { data, error, status } instead of failing outright.
  // This turns a problem into an error with a short code the rest of the file
  // understands: "offline", "paused", "signed_out", "not_allowed" or "unknown".
  class DbError extends Error {
    constructor(code, cause) {
      super(code);
      this.code = code;
      this.cause = cause;
    }
  }

  function check(result) {
    if (!result.error) return result.data;
    const status = result.status;
    const e = result.error;
    let code = "unknown";
    if (!status || (status >= 500 && status !== 540)) code = "offline";
    if (status === 540) code = "paused"; // Supabase's answer while a free project is paused
    if (status === 401 || e.code === "PGRST301" || e.code === "PGRST303") code = "signed_out";
    if (status === 403 || e.code === "42501") code = "not_allowed";
    throw new DbError(code, e);
  }

  // A connection that dropped for a moment gets one more try after a short
  // random pause. Anything else is reported as is.
  async function withRetry(call) {
    try {
      return await call();
    } catch (e) {
      if (e && e.code === "offline") {
        await wait(300 + Math.random() * 700);
        return call();
      }
      throw e;
    }
  }

  function remoteBackend() {
    const mine = () => client.from(TABLE).select("data").eq("user_id", user.id);
    return {
      name: "synced",
      async load() {
        const row = await withRetry(async () => check(await mine().maybeSingle()));
        return row ? row.data : null;
      },
      async write(s) {
        // Copied at the moment of saving, so later changes can't leak into this write.
        const data = JSON.parse(JSON.stringify(s));
        await withRetry(async () => check(
          await client.from(TABLE).upsert({ user_id: user.id, data, updated_at: new Date().toISOString() })
        ));
      },
      // Changes made on your other devices arrive here, live.
      watch(fn) {
        client
          .channel("climb-progress")
          .on("postgres_changes",
            { event: "*", schema: "public", table: TABLE, filter: `user_id=eq.${user.id}` },
            (change) => { if (change.new && change.new.data) fn(change.new.data); })
          .subscribe((status) => {
            if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
              console.warn("The Climb stopped listening for changes from other devices:", status);
            }
          });
      },
      async refresh(fn) {
        const raw = await this.load();
        if (raw) fn(raw);
      }
    };
  }

  // ─── Saving ────────────────────────────────────────────────────────────

  let chain = Promise.resolve(); // the save in progress (and any queued behind it)
  let saveTicket = 0;
  let saving = 0;                // saves started but not finished
  let quietTimer = null;         // a quiet save (typing) waiting for a pause
  let problem = null;            // plain-language message when saving isn't working

  function problemFor(e) {
    const code = e && e.code;
    if (code === "signed_out") return "You've been signed out on this device, so your last change wasn't saved. Reload the page and sign in again.";
    if (code === "not_allowed") return "Your database turned this save down. Export a backup and ask Claude Code to check the Supabase setup.";
    if (code === "paused") return "Your Supabase project is paused, so your last change wasn't saved. Restore it at supabase.com (see the Guide), then make your change again.";
    if (backend && backend.name === "local") return "This browser isn't letting The Climb save right now, so progress will only last until you close this tab.";
    return "Couldn't save your last change. Check your connection — it will try again on your next change.";
  }

  function notifyStatus() {
    statusListeners.forEach((fn) => {
      try { fn(); } catch (e) { console.error(e); }
    });
  }

  // Writes the current progress. Returns a promise of true (saved) or false.
  function save() {
    clearTimeout(quietTimer);
    quietTimer = null;
    if (!backend || outdated) return Promise.resolve(false);
    const ticket = ++saveTicket;
    saving++;
    const run = chain.then(async () => {
      try {
        if (ticket !== saveTicket) return; // a newer save is queued; it writes the latest state
        await backend.write(state);
        if (!storageOk || problem) {
          storageOk = true;
          problem = null;
          notifyStatus();
        }
      } catch (e) {
        console.warn("The Climb couldn't save:", e);
        storageOk = false;
        problem = problemFor(e);
        notifyStatus();
      } finally {
        saving--;
      }
    });
    chain = run;
    return run.then(() => storageOk);
  }

  // For typing (notes, links): wait for a pause, then save once.
  function saveQuietly() {
    clearTimeout(quietTimer);
    quietTimer = setTimeout(save, 700);
  }

  // Resolves once every change so far has been saved (or has failed to).
  function flush() {
    if (quietTimer) save();
    return chain.then(() => storageOk);
  }

  const hasUnsavedChanges = () => saving > 0 || quietTimer !== null;

  // ─── Telling the screens ───────────────────────────────────────────────

  let outdated = false; // a newer version of the app has saved; stop saving here

  function notify(info) {
    listeners.forEach((fn) => {
      try { fn(info); } catch (e) { console.error(e); }
    });
  }

  function commit() {
    save();
    notify({ remote: false });
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function onStatus(fn) {
    statusListeners.push(fn);
  }

  // Progress arrived from another device (or another tab). While this device
  // still has changes of its own on the way, it's ignored: those changes win,
  // and the next update after them brings the two back in step.
  function applyRemote(raw) {
    if (tooNew(raw)) {
      markOutdated();
      return;
    }
    if (hasUnsavedChanges()) return;
    const incoming = normalise(raw);
    if (JSON.stringify(incoming) === JSON.stringify(normalise(state))) return; // our own save coming back
    state = incoming;
    notify({ remote: true });
  }

  function markOutdated() {
    if (outdated) return;
    outdated = true;
    storageOk = false;
    problem = "A newer version of The Climb has saved your progress on another device. Reload this page to get it. Changes made here won't be saved.";
    notifyStatus();
  }

  // ─── One subject: its plan and its progress ────────────────────────────
  // Every question and action below is about one subject. The screens get one
  // of these with Store.subject("data") and ask it what they need.

  const sessionKey = (s) => JSON.stringify([s.date, s.minutes, s.note, s.taskId, !!s.extra]);

  function makeSubject(def) {
    const plan = def.plan();
    const sub = () => state.subjects[def.id];

    const sideModules = def.sideModules ? def.sideModules().filter(Boolean) : [];

    let flat = null;
    let byId = null;

    // Every task in order, with its phase, module and suggested day number.
    // Tasks inside a module are spread evenly across that module's days.
    // Side-module tasks and optional tasks are NOT in this list (so they never
    // change the day count or show on Today), but find() knows them, so ticking
    // and logging them on the Map works.
    function tasks() {
      if (flat) return flat;
      flat = [];
      byId = new Map();
      plan.phases.forEach((phase) => {
        phase.modules.forEach((module) => {
          const span = module.dayEnd - module.dayStart + 1;
          const required = module.tasks.filter((t) => !t.optional);
          const n = required.length;
          module.tasks.filter((t) => t.optional).forEach((task) => byId.set(task.id, { task, phase, module, day: null, optional: true }));
          required.forEach((task, i) => {
            const entry = {
              task,
              phase,
              module,
              index: flat.length,
              day: module.dayStart + Math.floor((i * span) / n)
            };
            flat.push(entry);
            byId.set(task.id, entry);
          });
        });
      });
      sideModules.forEach((sm) => {
        sm.modules.forEach((module) => {
          module.tasks.forEach((task) => byId.set(task.id, { task, phase: null, module, side: sm, day: null, optional: !!task.optional }));
        });
      });
      return flat;
    }

    function find(taskId) {
      tasks();
      return byId.get(taskId) || null;
    }

    const totalDays = () => plan.totalDays || 180;

    // A subject's own start date is set the first time anything is done in it
    // (Data and Spanish also get one when the app first opens).
    function started() {
      if (!sub().startDate) sub().startDate = today();
    }

    // ─── Questions ───────────────────────────────────────────────────────

    function isDone(taskId) {
      return sub().completedTaskIds.includes(taskId);
    }

    function locked() {
      const rule = def.unlockedBy;
      if (!rule) return false;
      const other = subjects.find((s) => s.id === rule.subject);
      return !other || !other.isDone(rule.taskId);
    }

    function skippedToday() {
      return sub().skipped.date === today() ? sub().skipped.taskIds : [];
    }

    // The next `count` tasks to do, in plan order. Tasks set aside with
    // "Not today" are left out for today only — tomorrow they're back first.
    // If everything left has been set aside, they come back rather than show nothing.
    function upcoming(count, list) {
      const open = (list || tasks()).filter((t) => !isDone(t.task.id));
      const skipped = skippedToday();
      const available = open.filter((t) => !skipped.includes(t.task.id));
      return (available.length ? available : open).slice(0, count);
    }

    function current() {
      return upcoming(1)[0] || null;
    }

    // "Day N of 180" — the day of the task you're on, not days since you started.
    function currentDay() {
      const c = current();
      return c ? c.day : plan.phases[plan.phases.length - 1].dayEnd;
    }

    function isFinished() {
      return tasks().every((t) => isDone(t.task.id));
    }

    // Optional tasks don't count toward a module being complete.
    function moduleStats(module) {
      const required = module.tasks.filter((t) => !t.optional);
      const total = required.length;
      const done = required.filter((t) => isDone(t.id)).length;
      return { done, total, complete: done === total };
    }

    // A phase is "done" when every task is done, "current" if it holds the next
    // task, otherwise "started" (some done) or "upcoming".
    function phaseStats(phase) {
      let done = 0, total = 0;
      phase.modules.forEach((m) => {
        const s = moduleStats(m);
        done += s.done;
        total += s.total;
      });
      const c = current();
      let status = "upcoming";
      if (done === total) status = "done";
      else if (c && c.phase.id === phase.id) status = "current";
      else if (done > 0) status = "started";
      return { done, total, status };
    }

    // Most recent date any of these tasks was logged as done.
    function lastLoggedDate(taskIds) {
      let latest = null;
      sub().sessionLog.forEach((s) => {
        if (s.taskId && taskIds.includes(s.taskId) && (!latest || s.date > latest)) latest = s.date;
      });
      return latest;
    }

    // Résumé lines, one per completed module that has one, in plan order,
    // then one per finished side module.
    function skillsUnlocked() {
      const out = [];
      plan.phases.forEach((phase) => {
        phase.modules.forEach((module) => {
          if (module.skill && moduleStats(module).complete) {
            out.push({
              skill: module.skill,
              moduleId: module.id,
              phaseId: phase.id,
              date: lastLoggedDate(module.tasks.map((t) => t.id))
            });
          }
        });
      });
      sides.forEach((sd) => {
        if (sd.plan.skill && sd.isFinished()) {
          out.push({ skill: sd.plan.skill, moduleId: null, phaseId: null, where: sd.name, date: lastLoggedDate(sd.tasks().map((t) => t.task.id)) });
        }
      });
      return out;
    }

    // The next skill to unlock: the first unfinished module that has one.
    function nextSkill() {
      for (const phase of plan.phases) {
        const m = phase.modules.find((x) => x.skill && !moduleStats(x).complete);
        if (m) {
          const s = moduleStats(m);
          // Tasks still to do up to and including that module.
          const end = tasks().findIndex((t) => t.module.id === m.id) + s.total;
          const left = tasks().slice(0, end).filter((t) => !isDone(t.task.id)).length;
          return { module: m, left, inModule: s.total - s.done };
        }
      }
      return null;
    }

    // Total minutes per week, keyed by the Monday that starts the week.
    function weeklyMinutes() {
      const weeks = {};
      sub().sessionLog.forEach((s) => {
        const w = weekOf(s.date);
        weeks[w] = (weeks[w] || 0) + s.minutes;
      });
      return weeks;
    }

    function minutesThisWeek() {
      return weeklyMinutes()[weekOf(today())] || 0;
    }

    // Streaks count WEEKS with at least one session, so skipping a day never
    // breaks anything — only a whole week with no study does. The current week
    // doesn't count against you until it's over.
    function streaks() {
      const weeks = new Set(sub().sessionLog.map((s) => weekOf(s.date)));
      if (!weeks.size) return { current: 0, longest: 0, thisWeek: false };

      const sorted = [...weeks].sort();
      let longest = 1, run = 1;
      for (let i = 1; i < sorted.length; i++) {
        run = addDays(sorted[i - 1], 7) === sorted[i] ? run + 1 : 1;
        longest = Math.max(longest, run);
      }

      const thisWeek = weeks.has(weekOf(today()));
      let cursor = weekOf(today());
      if (!thisWeek) cursor = addDays(cursor, -7);
      let currentRun = 0;
      while (weeks.has(cursor)) {
        currentRun++;
        cursor = addDays(cursor, -7);
      }
      return { current: currentRun, longest, thisWeek };
    }

    function lastSession() {
      const log = sub().sessionLog;
      return log.length ? log[log.length - 1] : null;
    }

    // Light week: the bonus block to show today, or null. Data's appears on
    // weekdays until two or three are done this week; Spanish's every day.
    // Only one a day, and never for German.
    function extraToday() {
      const rule = def.lightWeek;
      if (!rule || !isLightWeek() || locked()) return null;
      const d = parseDate(today()).getDay();
      if (rule.weekdaysOnly && (d === 0 || d === 6)) return null;
      const week = weekOf(today());
      const extras = sub().sessionLog.filter((s) => s.extra && weekOf(s.date) === week);
      if (extras.some((s) => s.date === today())) return null;
      if (extras.length >= rule.maxPerWeek) return null;
      return { ...rule, number: extras.length + 1 };
    }

    // ─── Things that happen ──────────────────────────────────────────────

    function markDone(taskId, minutes, note) {
      if (!find(taskId) || isDone(taskId)) return;
      started();
      sub().completedTaskIds.push(taskId);
      sub().sessionLog.push({
        date: today(),
        minutes: Math.max(0, Math.round(Number(minutes) || 0)),
        note: (note || "").trim(),
        taskId
      });
      sub().skipped.taskIds = sub().skipped.taskIds.filter((id) => id !== taskId);
      commit();
    }

    // Reverses markDone: un-completes the task and removes the session it logged.
    function undoDone(taskId) {
      sub().completedTaskIds = sub().completedTaskIds.filter((id) => id !== taskId);
      const log = sub().sessionLog;
      for (let i = log.length - 1; i >= 0; i--) {
        if (log[i].taskId === taskId) {
          log.splice(i, 1);
          break;
        }
      }
      commit();
    }

    // Tick or untick a task without logging a session (used by the Map).
    function setDone(taskId, done) {
      if (!find(taskId)) return;
      started();
      if (done && !isDone(taskId)) sub().completedTaskIds.push(taskId);
      if (!done) sub().completedTaskIds = sub().completedTaskIds.filter((id) => id !== taskId);
      commit();
    }

    function skipToday(taskId) {
      const d = today();
      if (sub().skipped.date !== d) sub().skipped = { date: d, taskIds: [] };
      if (!sub().skipped.taskIds.includes(taskId)) sub().skipped.taskIds.push(taskId);
      commit();
    }

    function undoSkip(taskId) {
      sub().skipped.taskIds = sub().skipped.taskIds.filter((id) => id !== taskId);
      commit();
    }

    // A session with no task: logged by hand on Progress, or a light-week block.
    // Returns the entry, so it can be removed again with removeSession.
    function logSession(minutes, note, date, extra) {
      started();
      const entry = {
        date: isISODate(date) ? date : today(),
        minutes: Math.max(0, Math.round(Number(minutes) || 0)),
        note: (note || "").trim(),
        taskId: null
      };
      if (extra) entry.extra = true;
      sub().sessionLog.push(entry);
      sub().sessionLog.sort(byDate);
      commit();
      return entry;
    }

    // Removes one session and returns it, so it can be put back with restoreSession.
    // `key` (from sessionKey) is what the screen showed: if progress from another
    // device has shifted the list since, the matching session is found by its
    // details instead, so the wrong one is never removed.
    function removeSession(index, key) {
      const log = sub().sessionLog;
      let i = index;
      const s = log[i];
      if (key && (!s || sessionKey(s) !== key)) {
        i = log.findIndex((x) => sessionKey(x) === key);
      }
      if (i < 0 || i >= log.length) return null;
      const [removed] = log.splice(i, 1);
      commit();
      return removed || null;
    }

    function restoreSession(entry) {
      if (!entry) return;
      sub().sessionLog.push(entry);
      sub().sessionLog.sort(byDate);
      commit();
    }

    // Saved quietly (no screen redraw), so typing in a notes box isn't interrupted.
    function setNote(moduleId, text) {
      sub().notes[moduleId] = text;
      saveQuietly();
    }

    // Saved quietly, like notes, so typing a link isn't interrupted by a redraw.
    function setPortfolioLink(phaseId, url) {
      sub().portfolioLinks[phaseId] = url.trim();
      saveQuietly();
    }

    function setTarget(hours) {
      const v = Number(hours);
      if (v > 0 && v < 100) sub().weeklyHoursTarget = v;
      commit();
    }

    // The start date only decides where the weekly chart begins. Where you are
    // comes from the ticked tasks, and those are never touched here.
    function setStartDate(iso) {
      if (!isISODate(iso)) return false;
      sub().startDate = iso;
      commit();
      return true;
    }

    // Start over: clears this subject's ticks, sessions, notes and "Not today",
    // and starts it today. Portfolio links stay (they're finished work, not
    // progress), and so does the weekly target. Returns what was there, so
    // restore() can put it back.
    function startOver() {
      const before = JSON.parse(JSON.stringify(sub()));
      state.subjects[def.id] = {
        ...blankSubject(def),
        startDate: today(),
        portfolioLinks: before.portfolioLinks,
        weeklyHoursTarget: before.weeklyHoursTarget
      };
      commit();
      return before;
    }

    function restore(snapshot) {
      if (!snapshot) return;
      state.subjects[def.id] = normaliseSubject(snapshot, def);
      commit();
    }

    // ─── Side modules ────────────────────────────────────────────────────
    // A short extra beside the plan (Data's Finance & SAP module). Its tasks
    // are ticked, logged and set aside "Not today" like any other, in this
    // subject's progress, so its time counts toward this subject's hours. It
    // has its own "next task", and is left out of the day count and the
    // plan's finished check.

    // A side module can be locked until a Data task is done (sm.unlockedBy),
    // and a single task can wait for one (task.unlockedBy, a task id). Both are
    // worked out from the ticks each time, so unticking locks them again.
    function makeSide(sm) {
      const list = [];
      sm.modules.forEach((module) => {
        module.tasks.filter((t) => !t.optional).forEach((task) => list.push({ task, phase: null, module, side: sm, day: null, index: list.length }));
      });
      const isLocked = () => !!(sm.unlockedBy && !isDone(sm.unlockedBy.taskId));
      const waits = (t) => !!(t.task.unlockedBy && !isDone(t.task.unlockedBy));
      const sideUpcoming = (count) => (isLocked() ? [] : upcoming(count, list.filter((t) => !waits(t))));
      return {
        id: sm.id,
        name: sm.name,
        plan: sm,
        tasks: () => list,
        upcoming: sideUpcoming,
        current: () => sideUpcoming(1)[0] || null,
        locked: isLocked,
        // Unfinished tasks still waiting for another task, with what they wait for.
        waiting: () => list.filter((t) => waits(t) && !isDone(t.task.id)).map((t) => ({ entry: t, waitsFor: find(t.task.unlockedBy) })),
        isFinished: () => list.every((t) => isDone(t.task.id)),
        done: () => list.filter((t) => isDone(t.task.id)).length,
        minutesLeft: () => list.filter((t) => !isDone(t.task.id)).reduce((sum, t) => sum + t.task.estimatedMinutes, 0)
      };
    }

    const sides = sideModules.map(makeSide);
    const side = (id) => sides.find((s) => s.id === id) || null;

    return {
      id: def.id,
      name: def.name,
      role: def.role,
      hours: def.hours,
      unlockedBy: def.unlockedBy || null,
      plan,
      unit: plan.unit || "day",
      get state() { return sub(); },
      get locked() { return locked(); },
      // the plan
      tasks, find, totalDays, sides, side,
      // questions
      isDone, upcoming, current, currentDay, isFinished, skippedToday,
      moduleStats, phaseStats, skillsUnlocked, nextSkill, weeklyMinutes, minutesThisWeek,
      streaks, lastSession, lastLoggedDate, extraToday,
      // actions
      markDone, undoDone, setDone, skipToday, undoSkip, logSession, removeSession, restoreSession,
      setNote, setPortfolioLink, setTarget, setStartDate, startOver, restore
    };
  }

  const subjects = SUBJECT_DEFS.map(makeSubject);

  function subject(id) {
    return subjects.find((s) => s.id === id) || null;
  }

  // The subjects you're studying now (German only once it's unlocked).
  const active = () => subjects.filter((s) => !s.locked);

  // ─── Across subjects ───────────────────────────────────────────────────

  function isLightWeek() {
    return state.settings.lightWeek === weekOf(today());
  }

  function setLightWeek(on) {
    state.settings.lightWeek = on ? weekOf(today()) : null;
    commit();
  }

  function setTheme(theme) {
    if (["auto", "light", "dark"].includes(theme)) state.settings.theme = theme;
    commit();
  }

  // The bad-week minimum: 3 hours of Data, and at least one Spanish session
  // so the Spanish (weekly) streak carries on.
  const MINIMUM_DATA_MINUTES = 180;

  function minimumThisWeek() {
    const data = subject("data");
    const spanish = subject("spanish");
    return {
      dataMinutes: data ? data.minutesThisWeek() : 0,
      dataNeeded: MINIMUM_DATA_MINUTES,
      spanishKept: spanish ? spanish.streaks().thisWeek : true
    };
  }

  // The most recent session in any subject, with the subject it was in.
  function lastSessionAnywhere() {
    let best = null;
    active().forEach((s) => {
      const last = s.lastSession();
      if (last && (!best || last.date >= best.session.date)) best = { subject: s, session: last };
    });
    return best;
  }

  // ─── Backup ────────────────────────────────────────────────────────────

  function exportJSON() {
    return JSON.stringify(
      { app: "the-climb", exportedAt: new Date().toISOString(), progress: state },
      null,
      2
    );
  }

  // Merges one subject's backup into what's here. See importJSON for the rules.
  function mergeSubject(mine, incoming) {
    let tasksAdded = 0;
    incoming.completedTaskIds.forEach((id) => {
      if (!mine.completedTaskIds.includes(id)) {
        mine.completedTaskIds.push(id);
        tasksAdded++;
      }
    });

    // Sessions are matched on all their details. Two genuinely identical sessions
    // are kept as two, by keeping the larger count from either side.
    const have = {};
    mine.sessionLog.forEach((s) => { have[sessionKey(s)] = (have[sessionKey(s)] || 0) + 1; });
    const seen = {};
    let sessionsAdded = 0;
    incoming.sessionLog.forEach((s) => {
      const k = sessionKey(s);
      seen[k] = (seen[k] || 0) + 1;
      if (seen[k] > (have[k] || 0)) {
        mine.sessionLog.push(s);
        sessionsAdded++;
      }
    });
    mine.sessionLog.sort(byDate);

    let notesMerged = 0;
    Object.entries(incoming.notes).forEach(([id, theirs]) => {
      const here = mine.notes[id] || "";
      if (!theirs.trim() || here.includes(theirs)) return;
      if (!here.trim() || theirs.includes(here)) mine.notes[id] = theirs;
      else {
        mine.notes[id] = `${here}\n\n— from your other machine —\n${theirs}`;
        notesMerged++;
      }
    });

    Object.entries(incoming.portfolioLinks).forEach(([id, url]) => {
      if (url && !mine.portfolioLinks[id]) mine.portfolioLinks[id] = url;
    });

    if (incoming.startDate && (!mine.startDate || incoming.startDate < mine.startDate)) {
      mine.startDate = incoming.startDate;
    }

    return { tasksAdded, sessionsAdded, notesMerged };
  }

  // Import MERGES a backup into what's already here — it never replaces it —
  // so moving between machines can't lose progress, whichever file is newer.
  // Each subject is merged on its own; a backup from before subjects existed
  // counts as Data.
  //   tasks done:   done on either side → done
  //   sessions:     everything from both, without doubling up (importing the
  //                 same file twice changes nothing)
  //   notes:        if they differ, both versions are kept, one under the other
  //   links:        this side's link wins; the imported one fills any gaps
  //   start date:   the earlier one
  //   settings:     this side's (theme, weekly targets, light week)
  // Returns { ok, tasksAdded, sessionsAdded, notesMerged } or { ok: false, error }.
  function importJSON(text) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return { ok: false, error: "That file isn't valid JSON — it may be damaged or not a Climb backup." };
    }
    const raw = parsed && parsed.progress ? parsed.progress : parsed;
    const looksRight = raw && typeof raw === "object" &&
      (isVersion1(raw) ? Array.isArray(raw.completedTaskIds) && Array.isArray(raw.sessionLog)
                       : raw.subjects && typeof raw.subjects === "object");
    if (!looksRight) {
      return { ok: false, error: "That file doesn't look like a Climb backup." };
    }
    if (tooNew(raw)) {
      return { ok: false, error: "That backup is from a newer version of The Climb. Reload this page, then import it again." };
    }
    const incoming = normalise(raw);

    const total = { ok: true, tasksAdded: 0, sessionsAdded: 0, notesMerged: 0 };
    SUBJECT_DEFS.forEach((d) => {
      const r = mergeSubject(state.subjects[d.id], incoming.subjects[d.id]);
      total.tasksAdded += r.tasksAdded;
      total.sessionsAdded += r.sessionsAdded;
      total.notesMerged += r.notesMerged;
    });

    commit();
    return total;
  }

  // ─── Start-up ──────────────────────────────────────────────────────────

  // A start-up problem the screens show instead of the app. Nothing is ever
  // saved after one of these, so a failed load can't overwrite real progress.
  class LoadError extends Error {}

  const LOAD_FAILED = "Couldn't load your progress. Check your connection and reload this page — nothing has been changed. If it still won't load tomorrow, your Supabase project may be paused: sign in at supabase.com and press Restore project.";
  const LOAD_PAUSED = "Your Supabase project is paused, so your progress can't load. Nothing has been lost. Sign in at supabase.com, open the project and press Restore project. It takes a few minutes; then reload this page.";

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      wait(ms).then(() => { throw new LoadError("timeout"); })
    ]);
  }

  // You need to sign in before progress can load (the web version only).
  // The screens show the sign-in form instead of the app.
  class SignInNeeded extends Error {}

  // The web version, set up: config.js names a Supabase project, and the page
  // isn't a file opened straight from this computer.
  function onlineConfig() {
    const cfg = window.CLIMB_CONFIG;
    const fromFile = typeof location !== "undefined" && location.protocol === "file:";
    return cfg && cfg.supabaseUrl && cfg.supabaseKey && !fromFile ? cfg : null;
  }

  // Async: resolves once progress has loaded. Rejects with a LoadError whose
  // message is written for you to read, or with SignInNeeded.
  async function init() {
    const cfg = onlineConfig();

    if (cfg) {
      if (!window.supabase || typeof window.supabase.createClient !== "function") {
        throw new LoadError("The Climb couldn't start its connection to your progress. Check your connection and reload this page — nothing has been changed.");
      }
      client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
      });
      let session = null;
      try {
        const result = await withTimeout(client.auth.getSession(), LOAD_TIMEOUT_MS);
        session = result && result.data && result.data.session;
      } catch (e) {
        throw new LoadError(LOAD_FAILED);
      }
      if (!session) throw new SignInNeeded("Sign in to see your progress.");
      user = session.user;
      backend = remoteBackend();
    } else {
      backend = localBackend;
    }

    let raw;
    try {
      raw = await withTimeout(backend.load(), LOAD_TIMEOUT_MS);
    } catch (e) {
      console.warn("The Climb couldn't load:", e);
      backend = null; // never save over progress we couldn't read
      if (e && e.code === "signed_out") {
        // This device's sign-in is no longer accepted: forget it and ask again.
        await client.auth.signOut({ scope: "local" }).catch(() => {});
        throw new SignInNeeded("Your sign-in on this device ran out. Sign in again.");
      }
      throw new LoadError(e && e.code === "paused" ? LOAD_PAUSED : LOAD_FAILED);
    }

    if (tooNew(raw)) {
      backend = null; // never save over a newer version's progress
      throw new LoadError("Your progress was saved by a newer version of The Climb. Reload this page to get the latest version.");
    }

    fresh = raw == null;
    state = normalise(raw);

    // Data and Spanish start the day you first open the app with them in it.
    // Saving here also moves progress saved before subjects existed into the
    // new shape, once (Data's progress is kept exactly as it was).
    let changed = raw != null && isVersion1(raw);
    ["data", "spanish"].forEach((id) => {
      const s = state.subjects[id];
      if (s && !s.startDate) {
        s.startDate = today();
        changed = true;
      }
    });
    if (changed) save();

    if (backend.watch) {
      backend.watch(applyRemote);
      // Coming back to the app (switching from another app on the phone):
      // fetch the latest straight away rather than wait for the live update.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          backend.refresh(applyRemote).catch(() => { /* the live update will catch up */ });
        }
      });
    } else {
      // If the local file is open in two tabs, keep them in step.
      try {
        window.addEventListener("storage", (e) => {
          if (e.key === KEY) applyRemote(readStorage());
        });
      } catch (e) { /* not important */ }
    }

    // Leaving or hiding the page: save any typing that's still waiting for a pause.
    try {
      window.addEventListener("pagehide", flush);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") flush();
      });
    } catch (e) { /* not important */ }
  }

  // ─── Signing in (the web version only) ─────────────────────────────────
  // Email and password, checked by Supabase. No emails are sent: a Home Screen
  // icon on iPhone and iPad can't open sign-in links, so a password is the one
  // way in that works everywhere.

  function signInProblem(error) {
    const msg = String((error && error.message) || "").toLowerCase();
    const status = error && error.status;
    if (/invalid login credentials|invalid_credentials/.test(msg) || (error && error.code === "invalid_credentials")) return "That email and password don't match. Check both and try again.";
    if (status === 429 || /rate limit|too many/.test(msg)) return "Too many tries for now. Wait a few minutes, then try again.";
    if (!status || /fetch|network/.test(msg)) return "Couldn't reach the sign-in service. Check your connection and try again.";
    return "Something went wrong signing in. Try again in a moment.";
  }

  async function signIn(email, password) {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw new Error(signInProblem(error));
  }

  async function signOut() {
    await flush();
    if (client) await client.auth.signOut({ scope: "local" }).catch(() => {}); // this device only
  }

  return {
    init,
    SignInNeeded,
    signIn,
    signOut,
    get email() { return user ? user.email : null; },
    flush,
    onChange,
    onStatus,
    LoadError,
    get state() { return state; },
    get storageOk() { return storageOk; },
    get problem() { return problem; },
    get mode() { return backend ? backend.name : null; }, // "synced" | "local"
    get fresh() { return fresh; },
    sessionKey,
    // dates
    today, weekOf, addDays,
    // subjects
    subjects, subject, active,
    // across subjects
    isLightWeek, setLightWeek, setTheme, minimumThisWeek, lastSessionAnywhere,
    // backup
    exportJSON, importJSON
  };
})();
