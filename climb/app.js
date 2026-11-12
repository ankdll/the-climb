/*
  THE CLIMB — screens
  ===================

  Draws each screen from what store.js knows. Switching screens uses the part
  of the address after "#" (#today, #map …), which works when opening the file
  directly — no server needed.
*/

(async function () {
  const view = document.getElementById("view");

  // The page arrives showing "Loading your progress…" (in the HTML itself), so
  // nothing flashes empty. The screens are drawn only once progress has loaded.
  try {
    await Store.init();
  } catch (e) {
    if (e instanceof Store.SignInNeeded) {
      renderSignIn();
      return;
    }
    const message = e instanceof Store.LoadError ? e.message : "Something went wrong starting The Climb. Reload this page to try again.";
    view.innerHTML = `<p class="load-problem" role="alert">${String(message).replace(/</g, "&lt;")}</p>`;
    return;
  }

  // ─── Sign-in (the web version only) ──────────────────────────────────────
  // Shown instead of the app until this device is signed in: email and
  // password, nothing emailed. Each device then stays signed in.

  function renderSignIn() {
    const EMAIL_KEY = "climb.email";
    document.body.classList.add("signed-out");
    let email = "";
    try { email = window.localStorage.getItem(EMAIL_KEY) || ""; } catch (e) { /* not important */ }
    let busy = false;
    let message = "";

    function draw() {
      view.innerHTML = `
        <section class="sign-in" aria-labelledby="h-sign-in">
          <p class="eyebrow">Sign in</p>
          <h1 class="screen-title" id="h-sign-in">Your progress, on every device.</h1>
          <p class="lede">Only you can see or change it. Sign in once on each device and it stays signed in.</p>
          <form class="sign-in-form" id="sign-in">
            <label class="field">Email
              <input id="sign-in-address" name="email" type="email" inputmode="email" autocomplete="username" autocapitalize="off" spellcheck="false" required value="${esc(email)}">
            </label>
            <label class="field">Password
              <input id="sign-in-password" name="password" type="password" autocomplete="current-password" required>
            </label>
            <button class="btn btn-solid" type="submit" ${busy ? "disabled" : ""}>${busy ? "Signing in…" : "Sign in"}</button>
          </form>
          <p class="status" role="status">${esc(message)}</p>
          <p class="fine">Forgot the password? Set a new one in Supabase (the README says how). Your progress isn't affected.</p>
        </section>`;
    }

    view.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (busy || e.target.id !== "sign-in") return;
      email = document.getElementById("sign-in-address").value.trim();
      const password = document.getElementById("sign-in-password").value;
      try { window.localStorage.setItem(EMAIL_KEY, email); } catch (err) { /* not important */ }
      busy = true;
      message = "";
      draw();
      try {
        await Store.signIn(email, password);
        message = "Signed in. Loading your progress…";
        draw();
        location.reload();
        return;
      } catch (err) {
        message = err.message;
      }
      busy = false;
      draw();
      document.getElementById(email ? "sign-in-password" : "sign-in-address").focus();
    });

    document.title = "Sign in · The Climb";
    draw();
  }

  // The theme the page started with, so "Match device" can give it back.
  const hostTheme = document.documentElement.getAttribute("data-theme");

  // A one-line message under a subject's card with an Undo, e.g. after Done or Not today.
  // Each card on Today has a key: the subject's id ("data"), or for a side
  // module, the subject and the module ("data:fin").
  let flash = null;      // { subject: key, text, undo: function }
  let arriving = null;   // key of the card that animates in after a completion
  let logging = null;    // key of the card whose "how long did it take?" box is open

  // ─── Helpers ───────────────────────────────────────────────────────────

  function esc(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function duration(mins) {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h} hr ${m} min` : `${h} hr`;
  }

  const KIND = {
    interactive: { label: "Interactive lesson", open: "Open lesson" },
    video: { label: "Video", open: "Watch" },
    reading: { label: "Reading", open: "Read it" },
    practice: { label: "Practice", open: "Open exercises" },
    build: { label: "Build", open: "Open reference" },
    setup: { label: "Setup", open: "Open" },
    listening: { label: "Listening", open: "Listen" },
    exam: { label: "End-of-term exam", open: "Open" }
  };

  function longDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  }

  function applyTheme() {
    const theme = Store.state.settings.theme;
    const root = document.documentElement;
    if (theme !== "auto") {
      root.setAttribute("data-theme", theme);
      themeSet = true;
    } else if (themeSet) {
      // Back to "Match device": hand the page back to whatever the viewer had set.
      if (hostTheme) root.setAttribute("data-theme", hostTheme);
      else root.removeAttribute("data-theme");
      themeSet = false;
    }
  }
  let themeSet = false;

  function showStorageWarning() {
    const el = document.getElementById("storage-warning");
    el.hidden = Store.storageOk && !Store.problem;
    if (Store.problem) el.textContent = Store.problem;
  }

  // ─── Changes from your other devices ───────────────────────────────────
  // They redraw the screen straight away, unless you're typing in a box —
  // then the redraw waits until you leave it, so nothing you type is lost.

  let remoteWaiting = false;

  const isTyping = () => {
    const el = document.activeElement;
    return !!el && view.contains(el) && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && el.type !== "radio";
  };

  function onStoreChange(info) {
    if (info && info.remote && isTyping()) {
      remoteWaiting = true;
      return;
    }
    remoteWaiting = false;
    render();
  }

  view.addEventListener("focusout", () => {
    if (!remoteWaiting) return;
    setTimeout(() => {
      if (remoteWaiting && !isTyping()) {
        remoteWaiting = false;
        render();
      }
    }, 0);
  });

  // ─── Today ─────────────────────────────────────────────────────────────
  // One group per subject you're studying (German joins once it unlocks),
  // each with its next task. Light-week bonus blocks sit under the card.

  const NEXT_COUNT = { data: 3 }; // how many dimmed tasks under each card (others: 2)

  // A card's key → the subject, and what to ask for its next task: the
  // subject itself, or one of its side modules. Both answer current() and
  // upcoming(); ticking and logging always go to the subject.
  function track(key) {
    const [sid, sideId] = key.split(":");
    const S = Store.subject(sid);
    return { S, src: sideId ? S.side(sideId) : S };
  }

  // Where you are, in the subject's own unit: "Day 4 of 180" or "Week 3 of 39".
  function where(S, entry) {
    if (S.unit === "week") return `Week ${Math.ceil(entry.day / 7)} of ${Math.ceil(S.totalDays() / 7)}`;
    return `Day ${entry.day} of ${S.totalDays()}`;
  }

  function whereShort(S, entry) {
    return S.unit === "week" ? `Week ${Math.ceil(entry.day / 7)}` : `Day ${entry.day}`;
  }

  function subjectHours(S) {
    return Store.isLightWeek() ? `${S.hours.light} this light week` : `${S.hours.normal} a week`;
  }

  function flashLine(sid) {
    const f = flash && flash.subject === sid ? flash : null;
    return `<p class="status" role="status">${f ? `${esc(f.text)}${f.undo ? `<button class="link-button" type="button" data-undo>Undo</button>` : ""}` : ""}</p>`;
  }

  function renderFinished(S) {
    const text = S.id === "data"
      ? { kind: "All three phases", title: "That's the whole climb.", detail: "Every task is done. Your deliverables are on the Portfolio page, ready for the next application that asks for work samples.", link: `<a class="btn btn-solid" href="#portfolio">Open Portfolio</a>` }
      : { kind: "Every week planned so far", title: `That's all of ${S.name}, for now.`, detail: "Keep the same rhythm going, and ask Claude Code to write the next stretch.", link: "" };
    return `
      <article class="card summit">
        <p class="task-kind">${text.kind}</p>
        <h3 class="task-title">${text.title}</h3>
        <p class="task-detail">${text.detail}</p>
        ${text.link ? `<div class="actions">${text.link}</div>` : ""}
      </article>`;
  }

  function renderCard(key, cur) {
    const { task } = cur;
    const kind = KIND[task.type] || KIND.build;
    const isLogging = logging === key;
    const openButton = task.url
      ? `<a class="btn btn-solid" href="${esc(task.url)}" target="_blank" rel="noopener">${kind.open}<span class="arrow" aria-hidden="true">↗</span></a>`
      : "";

    const body = isLogging
      ? `
        <form class="log-form" data-log-form="${key}">
          <p class="prompt">Nice. How long did it take?</p>
          <div class="log-fields">
            <label class="field">Time
              <span class="unit"><input id="log-minutes-${key}" type="number" inputmode="numeric" min="0" max="600" step="5" value="${task.estimatedMinutes}"><span>min</span></span>
            </label>
            <label class="field">Note
              <input id="log-note-${key}" type="text" maxlength="500" placeholder="Optional" autocomplete="off">
            </label>
          </div>
          <div class="log-actions">
            <button class="btn btn-solid" type="submit">Save</button>
            <button class="link-button" type="button" data-log-cancel="${key}">Cancel</button>
            <span class="kbd-hint">Enter saves · Esc cancels</span>
          </div>
        </form>`
      : `
        <div class="actions">
          ${openButton}
          <button class="btn" type="button" data-done="${key}">Done</button>
        </div>
        <button class="link-button not-today" type="button" data-not-today="${key}">Not today</button>`;

    // Extra reading for the task, as small links under the detail (side modules use these).
    const more = task.more && task.more.length && !isLogging ? `
        <ul class="more-links" aria-label="Also for this task">
          ${task.more.map((m) => `<li><a href="${esc(m.url)}" target="_blank" rel="noopener">${esc(m.label)}<span class="arrow" aria-hidden="true">↗</span></a></li>`).join("")}
        </ul>` : "";

    return `
      <article class="card${arriving === key ? " arriving" : ""}" id="card-${key}">
        <p class="task-kind">${kind.label} · about ${duration(task.estimatedMinutes)}</p>
        <h3 class="task-title">${esc(task.label)}</h3>
        <p class="task-detail">${esc(task.detail)}</p>
        ${more}
        ${body}
      </article>`;
  }

  // Light week's bonus block: logged in one tap, with Undo.
  function renderExtra(S) {
    const x = S.extraToday();
    if (!x) return "";
    const count = S.id === "data" ? ` · ${x.number} of 2–3 this week` : "";
    return `
      <div class="extra">
        <p class="extra-kind">Light week${count}</p>
        <p class="extra-title">${esc(x.label)}</p>
        <p class="extra-detail">${esc(x.detail)}</p>
        <div class="actions">
          ${x.url ? `<a class="btn" href="${esc(x.url)}" target="_blank" rel="noopener">Open<span class="arrow" aria-hidden="true">↗</span></a>` : ""}
          <button class="btn" type="button" data-extra="${S.id}">Done · ${duration(x.minutes)}</button>
        </div>
      </div>`;
  }

  function renderSubjectToday(S) {
    const cur = S.current();
    const count = NEXT_COUNT[S.id] || 2;
    const next = cur ? S.upcoming(count + 1).slice(1) : [];
    return `
      <section class="subject" data-subject="${S.id}" aria-labelledby="subject-${S.id}">
        <h2 class="subject-h" id="subject-${S.id}">
          <span class="subject-name">${esc(S.name)}</span>
          <span class="subject-meta">${esc(S.role)} · ${esc(subjectHours(S))}</span>
        </h2>
        ${cur ? `
          <p class="orientation">
            <span class="day">${where(S, cur)}</span>
            <span class="sep" aria-hidden="true">·</span>
            <span>${esc(cur.phase.name)}</span>
            ${S.unit === "day" ? `<span class="sep" aria-hidden="true">·</span><span>${esc(cur.module.name)}</span>` : ""}
          </p>
          ${renderCard(S.id, cur)}` : renderFinished(S)}
        ${renderExtra(S)}
        ${flashLine(S.id)}
        ${next.length ? `
          <section class="next" aria-label="Coming up in ${esc(S.name)}">
            <h3>After this</h3>
            <ol>
              ${next.map((n) => `
                <li>
                  <span class="n-day">${whereShort(S, n)}</span>
                  <span class="n-title">${esc(n.task.label)}${S.unit === "day" && n.module.id !== cur.module.id ? `<span class="n-module">New module · ${esc(n.module.name)}</span>` : ""}</span>
                  <span class="n-mins">${duration(n.task.estimatedMinutes)}</span>
                </li>`).join("")}
            </ol>
          </section>` : ""}
      </section>`;
  }

  // A side module (Data's Finance & SAP) gets its own group under its subject
  // until it's finished; then it leaves Today and lives on the Map.
  function renderSideToday(S, side) {
    const cur = side.current();
    if (!cur) return "";
    const key = `${S.id}:${side.id}`;
    const all = side.tasks();
    const next = side.upcoming(3).slice(1);
    const left = side.minutesLeft();
    return `
      <section class="subject side" data-subject="${S.id}" aria-labelledby="subject-${S.id}-${side.id}">
        <h2 class="subject-h" id="subject-${S.id}-${side.id}">
          <span class="subject-name">${esc(side.name)}</span>
          <span class="subject-meta">${esc(S.name)} side module · ${side.plan.timeframe ? `${esc(side.plan.timeframe)} · ` : ""}${duration(left)} left</span>
        </h2>
        <p class="orientation">
          <span class="day">Task ${cur.index + 1} of ${all.length}</span>
          <span class="sep" aria-hidden="true">·</span>
          <span>${esc(cur.module.name)}</span>
        </p>
        ${renderCard(key, cur)}
        ${flashLine(key)}
        ${next.length ? `
          <section class="next" aria-label="Coming up in ${esc(side.name)}">
            <h3>After this</h3>
            <ol>
              ${next.map((n) => `
                <li>
                  <span class="n-day">Task ${n.index + 1}</span>
                  <span class="n-title">${esc(n.task.label)}</span>
                  <span class="n-mins">${duration(n.task.estimatedMinutes)}</span>
                </li>`).join("")}
            </ol>
          </section>` : ""}
      </section>`;
  }

  // A subject's group, followed by any of its side modules still in progress.
  const renderSubjectGroups = (S) => renderSubjectToday(S) + S.sides.map((side) => renderSideToday(S, side)).join("");

  function renderWeekBar() {
    const on = Store.isLightWeek();
    return `
      <div class="week-bar">
        <button class="switch" type="button" role="switch" aria-checked="${on}" id="light-week">
          <span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span>
          <span class="switch-label">Light week</span>
        </button>
        <p class="fine">${on
          ? "On for this week: an extra hour of Data on 2–3 weekdays, and 15 more minutes of Spanish listening a day. It switches off on Monday."
          : "A lighter work week? Switch this on for extra study blocks."}</p>
      </div>`;
  }

  // The bad-week minimum, with where this week stands against it.
  function renderMinimum() {
    if (!Store.subject("spanish")) return "";
    const m = Store.minimumThisWeek();
    const dataOk = m.dataMinutes >= m.dataNeeded;
    return `
      <p class="minimum">
        <span class="minimum-h">Bad week?</span> The minimum is 3 hrs of Data and one Spanish session, so the streak keeps going.
        <span class="minimum-now">This week so far: ${m.dataMinutes ? duration(m.dataMinutes) : "no time"} of Data${dataOk ? " ✓" : ""} · Spanish ${m.spanishKept ? "done ✓" : "not yet"}</span>
      </p>`;
  }

  function renderToday() {
    const last = Store.lastSessionAnywhere();
    view.innerHTML = `
      <h1 class="visually-hidden">Today</h1>
      ${Store.active().map(renderSubjectGroups).join("")}

      ${renderWeekBar()}
      ${renderMinimum()}

      ${last ? `<p class="last-session">Last session · ${esc(last.subject.name)} · ${longDate(last.session.date)}${last.session.note ? ` · <q>${esc(last.session.note)}</q>` : ""}</p>` : ""}
    `;

    arriving = null;

    // The "how long did it take?" box: focus the note, Esc cancels.
    if (logging) {
      const note = document.getElementById(`log-note-${logging}`);
      if (note) note.focus();
      else logging = null;
    }
  }

  // One set of listeners for Today; they survive redraws because they sit on #view.
  view.addEventListener("click", (e) => {
    if (currentScreen() !== "today") return;

    if (e.target.closest("[data-undo]")) {
      const undo = flash && flash.undo;
      flash = null;
      if (undo) undo();
      else render();
      return;
    }

    if (e.target.closest("#light-week")) {
      Store.setLightWeek(!Store.isLightWeek());
      return;
    }

    const done = e.target.closest("[data-done]");
    if (done) {
      logging = done.dataset.done;
      render();
      return;
    }

    const cancel = e.target.closest("[data-log-cancel]");
    if (cancel) {
      cancelLogging(cancel.dataset.logCancel);
      return;
    }

    const skip = e.target.closest("[data-not-today]");
    if (skip) {
      const key = skip.dataset.notToday;
      const { S, src } = track(key);
      const cur = src.current();
      flash = {
        subject: key,
        text: `“${cur.task.label}” is set aside for today. It'll be first next time.`,
        undo: () => S.undoSkip(cur.task.id)
      };
      arriving = key;
      S.skipToday(cur.task.id);
      return;
    }

    const extra = e.target.closest("[data-extra]");
    if (extra) {
      const S = Store.subject(extra.dataset.extra);
      const x = S.extraToday();
      if (!x) return;
      const entry = S.logSession(x.minutes, x.label, null, true);
      flash = {
        subject: S.id,
        text: `Logged ${duration(x.minutes)} of light-week ${S.name}.`,
        undo: () => S.removeSession(-1, Store.sessionKey(entry))
      };
      render();
    }
  });

  function cancelLogging(sid) {
    logging = null;
    render();
    const btn = view.querySelector(`[data-done="${sid}"]`);
    if (btn) btn.focus();
  }

  view.addEventListener("keydown", (e) => {
    if (currentScreen() !== "today" || e.key !== "Escape") return;
    const form = e.target.closest("[data-log-form]");
    if (form) cancelLogging(form.dataset.logForm);
  });

  view.addEventListener("submit", (e) => {
    const form = e.target.closest("[data-log-form]");
    if (!form) return;
    e.preventDefault();
    const key = form.dataset.logForm;
    const { S, src } = track(key);
    const cur = src.current();
    if (!cur) return;
    const mins = Math.max(0, Math.round(Number(document.getElementById(`log-minutes-${key}`).value) || 0));
    const text = document.getElementById(`log-note-${key}`).value;
    const taskId = cur.task.id;
    const label = cur.task.label;
    logging = null;

    const finish = () => {
      // Finishing a side module's last task: its group leaves Today, so the
      // message (and its Undo) shows under the subject instead.
      // A side module can also leave Today for now, when its other tasks are
      // waiting for a project to be finished.
      const sideDone = src !== S && src.tasks().every((t) => t.task.id === taskId || S.isDone(t.task.id));
      const sidePaused = src !== S && !sideDone && !src.upcoming(src.tasks().length).some((t) => t.task.id !== taskId);
      flash = {
        subject: sideDone || sidePaused ? S.id : key,
        text: sideDone
          ? `Logged ${duration(mins)} on “${label}”. That's all of ${src.name}: it stays on the Map.`
          : sidePaused
            ? `Logged ${duration(mins)} on “${label}”. ${src.name} is done for now: its next task appears when you finish ${src.waiting().map((w) => `“${w.waitsFor.task.label}”`)[0]}.`
            : `Logged ${duration(mins)} on “${label}”.`,
        undo: () => S.undoDone(taskId)
      };
      arriving = key;
      S.markDone(taskId, mins, text);
    };

    // Let the finished card settle away before the next one arrives.
    const card = document.getElementById(`card-${key}`);
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
    } else {
      card.classList.add("leaving");
      let finished = false;
      const once = () => { if (!finished) { finished = true; finish(); } };
      card.addEventListener("animationend", once);
      setTimeout(once, 400); // in case the animation event never fires
    }
  });

  // ─── Choosing a subject (Map and Progress) ─────────────────────────────
  // Always starts on Data. German can be chosen while locked, to see what's coming.

  let shown = "data";
  const S = () => Store.subject(shown);
  const D = () => Store.subject("data");

  function renderSubjectSwitch() {
    const option = (sub) => `
      <label class="seg"><input type="radio" name="subject" value="${sub.id}" ${sub.id === shown ? "checked" : ""}><span>${esc(sub.name)}${sub.locked ? `<span class="seg-note"> · locked</span>` : ""}</span></label>`;
    return `
      <fieldset class="subject-switch">
        <legend class="visually-hidden">Subject</legend>
        <div class="segmented">${Store.subjects.map(option).join("")}</div>
      </fieldset>`;
  }

  view.addEventListener("change", (e) => {
    if (e.target.name !== "subject") return;
    shown = e.target.value;
    logFlash = null;
    pendingStart = null;
    restartStep = false;
    settingsFlash = null;
    showAllSessions = false;
    render();
    const radio = view.querySelector(`[name="subject"][value="${CSS.escape(shown)}"]`);
    if (radio) radio.focus();
  });

  // What a locked subject shows instead of its Map or Progress.
  function renderLocked(screenName) {
    const sub = S();
    const first = sub.tasks()[0];
    view.innerHTML = `
      ${renderSubjectSwitch()}
      <header class="map-intro">
        <p class="eyebrow">${screenName} · ${esc(sub.name)}</p>
        <h1 class="screen-title">${esc(sub.name)} is locked for now.</h1>
      </header>
      <section class="block locked">
        <p>${esc(sub.unlockedBy.text)} Then it joins Today at ${esc(sub.hours.normal)} a week.</p>
        <p class="fine">Course: ${first ? `<a href="${esc(first.task.url)}" target="_blank" rel="noopener">${esc(sub.plan.phases[0].name)}</a>` : esc(sub.plan.phases[0].name)}. ${esc(sub.plan.phases[0].why || "")}</p>
      </section>`;
  }

  // ─── The Map ───────────────────────────────────────────────────────────

  // Which phases/modules are open, per subject. Starts with wherever you are now.
  const mapOpenBySubject = {};
  let mapOpen = null;
  let refocus = null; // after a redraw, put keyboard focus back where it was

  function shortDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  function stateClass(done, total, isCurrent) {
    if (total && done === total) return "is-done";
    return isCurrent ? "is-current" : "is-upcoming";
  }

  // The mountain outline: the whole 180 days as one climb, steeper where a
  // phase climbs more. Climbed so far = solid ink; still ahead = dotted.
  function renderProfile() {
    const W = 600, H = 120, TOP = 16, BOTTOM = 8;
    const total = S().totalDays();
    const phases = S().plan.phases;
    // Height reached at the end of each phase. Data's three phases climb unevenly;
    // other subjects climb in even steps.
    const heights = phases.length === 3 ? [0.45, 0.78, 1] : phases.map((p, i) => (i + 1) / phases.length);
    const here = S().current() ? S().currentDay() - 1 : total;

    function elevation(day) {
      let start = 0, from = 0;
      for (let i = 0; i < phases.length; i++) {
        const end = phases[i].dayEnd;
        const to = heights[i] ?? 1;
        if (day <= end || i === phases.length - 1) {
          const t = Math.min(1, Math.max(0, (day - start) / (end - start)));
          const eased = t * t * (3 - 2 * t) * 0.6 + t * 0.4;
          const wobble = day > 0 && day < total ? 0.022 * Math.sin(day * 0.33) + 0.012 * Math.sin(day * 0.91) : 0;
          return from + (to - from) * eased + wobble;
        }
        start = end;
        from = to;
      }
      return 1;
    }

    const x = (day) => (day / total) * W;
    const y = (day) => H - BOTTOM - elevation(day) * (H - TOP - BOTTOM);
    const pts = (a, b) => {
      const out = [];
      for (let d = a; d < b; d += 2) out.push(`${x(d).toFixed(1)},${y(d).toFixed(1)}`);
      out.push(`${x(b).toFixed(1)},${y(b).toFixed(1)}`);
      return out.join(" ");
    };

    const camps = phases.map((p) => {
      const done = S().phaseStats(p).status === "done";
      const cx = x(p.dayEnd), cy = y(p.dayEnd);
      return `
        <g class="camp ${done ? "is-done" : ""}">
          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 14}" />
          <path d="M${cx} ${cy - 14} l9 3.5 l-9 3.5 z" />
        </g>`;
    }).join("");

    return `
      <figure class="profile" aria-label="${S().current() ? `You are on ${where(S(), S().current()).toLowerCase()}` : "Finished"}">
        <div class="profile-art">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
          <polygon class="land" points="0,${H} ${pts(0, total)} ${W},${H}" />
          ${here < total ? `<polyline class="ahead" points="${pts(here, total)}" />` : ""}
          ${here > 0 ? `<polyline class="climbed" points="${pts(0, here)}" />` : ""}
        </svg>
        <svg class="profile-marks" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
          ${camps}
        </svg>
        <span class="you" style="left:${(x(here) / W) * 100}%; top:${(y(here) / H) * 100}%"></span>
        </div>
        <div class="profile-labels" style="grid-template-columns:${phases.map((p) => `${p.dayEnd - p.dayStart + 1}fr`).join(" ")}">
          ${phases.map((p) => `<span class="${S().current() && S().current().phase.id === p.id ? "is-current" : ""}">${esc(p.shortName || p.name)}</span>`).join("")}
        </div>
      </figure>`;
  }

  function renderTask(entry, cur) {
    const { task, day } = entry;
    const done = S().isDone(task.id);
    const isCurrent = cur && cur.task.id === task.id;
    const doneOn = done ? S().lastLoggedDate([task.id]) : null;
    const kind = (KIND[task.type] || KIND.build).label;
    // A side task waiting for another task (e.g. a project card waiting for its project).
    const waitsFor = !done && task.unlockedBy && !S().isDone(task.unlockedBy) ? S().find(task.unlockedBy) : null;
    const meta = done
      ? `Done${doneOn ? ` ${shortDate(doneOn)}` : ""}`
      : `${entry.optional ? "Optional · " : S().unit === "day" && day ? `Day ${day} · ` : ""}${waitsFor ? `Appears after “${esc(waitsFor.task.label)}” · ` : ""}${duration(task.estimatedMinutes)} · ${kind}`;
    const title = task.url
      ? `<a href="${esc(task.url)}" target="_blank" rel="noopener">${esc(task.label)}</a>`
      : `<span>${esc(task.label)}</span>`;
    return `
      <li class="t ${done ? "is-done" : isCurrent ? "is-current" : ""}">
        <button class="tick" type="button" data-tick="${esc(task.id)}" aria-pressed="${done}"
          aria-label="${done ? "Mark as not done" : "Mark as done"}: ${esc(task.label)}">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8.5l2.6 2.5L12 5.5" /></svg>
        </button>
        <span class="t-main">
          <span class="t-title">${title}${isCurrent ? `<span class="t-now">Next up</span>` : ""}</span>
          <span class="t-meta">${meta}</span>
        </span>
      </li>`;
  }

  const phaseOf = (module) => S().plan.phases.find((p) => p.modules.includes(module));

  // `side` is set for a side module's modules, whose tasks aren't in the plan's list.
  function renderModule(module, cur, side) {
    let s = S().moduleStats(module);
    const isCurrent = cur && cur.module.id === module.id;
    // A module of optional tasks only (the site's stretch steps) is never "done" by default.
    const optionalOnly = module.tasks.every((t) => t.optional);
    if (optionalOnly) {
      const n = module.tasks.filter((t) => S().isDone(t.id)).length;
      s = { done: n, total: module.tasks.length, complete: n === module.tasks.length };
    }
    const cls = stateClass(s.done, s.total, isCurrent);
    const open = mapOpen.modules.has(module.id);
    // Every task in the module, optional ones included, in the plan's order.
    const entries = module.tasks.map((t) => S().find(t.id)).filter(Boolean);
    const status = s.complete ? "Done" : s.done ? `${s.done} of ${s.total}` : `${optionalOnly ? "Optional · " : ""}${s.total} task${s.total === 1 ? "" : "s"}`;
    return `
      <section class="module ${cls}">
        <h3 class="module-h">
          <button class="module-head" type="button" data-module="${esc(module.id)}" aria-expanded="${open}" aria-controls="m-${esc(module.id)}">
            <span class="m-days">${side ? esc(side.plan.shortName || "") : S().unit === "week" ? esc(phaseOf(module).shortName || "") : `Days ${module.dayStart}–${module.dayEnd}`}</span>
            <span class="m-name">${esc(module.name)}</span>
            <span class="m-state">${status}</span>
          </button>
        </h3>
        ${s.complete && module.skill ? `<p class="m-skill"><span>Skill</span> ${esc(module.skill)}</p>` : ""}
        <div class="fold ${open ? "open" : ""}" id="m-${esc(module.id)}">
          <div class="fold-inner">
            <ol class="tasks">${entries.map((e) => renderTask(e, cur)).join("")}</ol>
            <label class="m-notes">
              <span>Notes</span>
              <textarea data-note="${esc(module.id)}" rows="2" placeholder="Anything to remember about this ${S().unit === "week" ? "week" : "module"}">${esc(S().state.notes[module.id] || "")}</textarea>
            </label>
          </div>
        </div>
      </section>`;
  }

  function renderPhase(phase, cur) {
    const s = S().phaseStats(phase);
    const isCurrent = s.status === "current";
    const cls = s.status === "done" ? "is-done" : isCurrent ? "is-current" : "is-upcoming";
    const open = mapOpen.phases.has(phase.id);
    const finishedOn = s.status === "done"
      ? S().lastLoggedDate(phase.modules.flatMap((m) => m.tasks.filter((t) => !t.optional).map((t) => t.id)))
      : null;

    let state;
    if (s.status === "done") state = `<span class="stamp">Finished${finishedOn ? ` · ${shortDate(finishedOn)}` : ""}</span>`;
    else if (isCurrent) state = `<span class="here">You are here</span><span class="p-count">${s.done} of ${s.total} tasks done</span>`;
    else state = `<span class="p-count">${s.done ? `${s.done} of ${s.total} tasks done` : `${s.total} tasks`}</span>`;

    const extras = phase.extras && phase.extras.length ? `
      <section class="extras">
        <h3>Extra practice <span>Optional — not part of the path</span></h3>
        <ul>
          ${phase.extras.map((e) => `
            <li><a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.label)}</a><span>${esc(e.detail)}</span></li>`).join("")}
        </ul>
      </section>` : "";

    return `
      <li class="stop ${cls}">
        <span class="marker" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M4 8.5l2.6 2.5L12 5.5" /></svg>
        </span>
        <h2 class="stop-h">
          <button class="stop-head" type="button" data-phase="${esc(phase.id)}" aria-expanded="${open}" aria-controls="p-${esc(phase.id)}">
            <span class="p-days">${S().unit === "week"
              ? `Weeks ${Math.ceil(phase.dayStart / 7)}–${Math.ceil(phase.dayEnd / 7)}`
              : `Days ${phase.dayStart}–${phase.dayEnd}`} · about ${phase.estimatedHours} hours</span>
            <span class="p-name">${esc(phase.name)}</span>
            <span class="p-state">${state}</span>
          </button>
        </h2>
        <p class="p-deliverable"><span>${phase.deliverableLabel || (s.status === "done" ? "What you made" : "You'll have")}</span> ${esc(phase.deliverable)}</p>
        <div class="fold ${open ? "open" : ""}" id="p-${esc(phase.id)}">
          <div class="fold-inner">
            <div class="modules">${phase.modules.map((m) => renderModule(m, cur)).join("")}</div>
            ${extras}
          </div>
        </div>
      </li>`;
  }

  // A side module sits under the trail, outside the climb: it has no days and
  // doesn't move the "you are here" marker. It stays here once it's finished.
  function renderSideMap(side) {
    const cur = side.current();
    const done = side.done();
    const total = side.tasks().length;
    const finished = side.isFinished();
    const finishedOn = finished ? S().lastLoggedDate(side.tasks().map((t) => t.task.id)) : null;
    const hrs = side.tasks().reduce((sum, t) => sum + t.task.estimatedMinutes, 0) / 60;
    const optionalMins = side.plan.modules.reduce((sum, m) => sum + m.tasks.filter((t) => t.optional).reduce((a, t) => a + t.estimatedMinutes, 0), 0);
    const hours = `about ${Number.isInteger(hrs) ? hrs : hrs.toFixed(1)} hours${optionalMins ? ` (+${Math.round(optionalMins / 60)} optional)` : ""}`;
    const waiting = side.waiting();
    let state;
    if (side.locked()) state = `<span class="p-count">Locked · ${esc(side.plan.unlockedBy.text)}</span>`;
    else if (finished) state = `<span class="stamp">Finished${finishedOn ? ` · ${shortDate(finishedOn)}` : ""}</span>`;
    else if (!cur && waiting.length) state = `<span class="p-count">${done} of ${total} tasks done · the rest appear on Today when you finish ${waiting.map((w) => `“${esc(w.waitsFor.task.label)}”`).join(" and ")}</span>`;
    else state = `<span class="p-count">${done ? `${done} of ${total} tasks done` : `${total} tasks`} · on Today until it's finished</span>`;
    return `
      <section class="side-map${finished ? " is-done" : ""}" aria-labelledby="side-${esc(side.id)}">
        <p class="side-tag">Side module · ${side.plan.timeframe ? `${esc(side.plan.timeframe)} · ` : ""}${hours} · not part of the ${S().totalDays()} days</p>
        <h2 class="side-name" id="side-${esc(side.id)}">${esc(side.name)}</h2>
        <p class="side-state">${state}</p>
        <p class="side-why">${esc(side.plan.why || "")}</p>
        <div class="modules">${side.plan.modules.map((m) => renderModule(m, cur, side)).join("")}</div>
      </section>`;
  }

  function renderMap() {
    if (S().locked) return renderLocked("The Map");
    const cur = S().current();
    if (!mapOpenBySubject[shown]) {
      const open = { phases: new Set(), modules: new Set() };
      if (cur) {
        open.phases.add(cur.phase.id);
        open.modules.add(cur.module.id);
      }
      S().sides.forEach((side) => {
        const c = side.current();
        if (c) open.modules.add(c.module.id);
      });
      mapOpenBySubject[shown] = open;
    }
    mapOpen = mapOpenBySubject[shown];

    view.innerHTML = `
      ${renderSubjectSwitch()}
      <header class="map-intro">
        <p class="eyebrow">The Map · ${esc(S().name)}</p>
        <h1 class="screen-title">${cur
          ? `${where(S(), cur)}, in ${esc(cur.phase.name)}.`
          : `The whole of ${esc(S().name)}, done.`}</h1>
      </header>
      ${renderProfile()}
      <ol class="trail">${S().plan.phases.map((p) => renderPhase(p, cur)).join("")}</ol>
      ${S().sides.map(renderSideMap).join("")}
    `;

    if (refocus) {
      const el = view.querySelector(refocus);
      if (el) el.focus({ preventScroll: true });
      refocus = null;
    }
  }

  // One set of listeners for the Map; they survive redraws because they sit on #view.
  view.addEventListener("click", (e) => {
    if (currentScreen() !== "map") return;

    const tick = e.target.closest("[data-tick]");
    if (tick) {
      const id = tick.dataset.tick;
      refocus = `[data-tick="${CSS.escape(id)}"]`;
      S().setDone(id, !S().isDone(id));
      return;
    }

    const head = e.target.closest("[data-phase], [data-module]");
    if (!head) return;
    const isPhase = "phase" in head.dataset;
    const id = isPhase ? head.dataset.phase : head.dataset.module;
    const set = isPhase ? mapOpen.phases : mapOpen.modules;
    const fold = document.getElementById(`${isPhase ? "p" : "m"}-${id}`);
    const open = !set.has(id);
    if (open) set.add(id);
    else set.delete(id);
    head.setAttribute("aria-expanded", open);
    fold.classList.toggle("open", open); // toggled in place so the opening animates
  });

  view.addEventListener("input", (e) => {
    const box = e.target.closest("[data-note]");
    if (box) S().setNote(box.dataset.note, box.value);
  });

  // ─── Progress ──────────────────────────────────────────────────────────

  const WEEKS_SHOWN = 12;
  const SESSIONS_SHOWN = 15;
  let logFlash = null;    // { text, undo } under the session log
  let dataMessage = null; // result of an import or export
  let showAllSessions = false;

  function hours(mins) {
    const h = mins / 60;
    return h >= 10 || Number.isInteger(h) ? `${Math.round(h)}` : h.toFixed(1);
  }

  function renderChart() {
    const target = S().state.weeklyHoursTarget;
    const thisWeek = Store.weekOf(Store.today());
    const minutes = S().weeklyMinutes();
    const sessions = {};
    S().state.sessionLog.forEach((s) => {
      const w = Store.weekOf(s.date);
      sessions[w] = (sessions[w] || 0) + 1;
    });

    // Every week from the one you started in up to this one (the last 12).
    const weeks = [];
    let w = Store.weekOf(S().state.startDate || Store.today());
    while (w <= thisWeek) {
      weeks.push(w);
      w = Store.addDays(w, 7);
    }
    const weeksShown = weeks.slice(-WEEKS_SHOWN);
    const top = Math.max(target * 60 * 1.3, ...weeksShown.map((wk) => minutes[wk] || 0), 60);
    const pct = (m) => (m / top) * 100;

    const bars = weeksShown.map((wk) => {
      const m = minutes[wk] || 0;
      const n = sessions[wk] || 0;
      const isNow = wk === thisWeek;
      const tip = `Week of ${shortDate(wk)} · ${m ? duration(m) : "nothing logged"}${n ? ` · ${n} session${n > 1 ? "s" : ""}` : ""}`;
      return `
        <div class="col${isNow ? " is-now" : ""}" tabindex="0" aria-label="${esc(tip)}">
          ${m ? `<span class="bar" style="height:${pct(m)}%"></span>` : ""}
          ${isNow && m ? `<span class="bar-value" style="bottom:${pct(m)}%">${hours(m)} hr</span>` : ""}
          <span class="tip" role="tooltip">${esc(tip)}</span>
          <span class="col-label">${isNow ? "This week" : shortDate(wk)}</span>
        </div>`;
    }).join("");

    const table = weeksShown.slice().reverse().map((wk) => `
      <tr><th scope="row">${shortDate(wk)}</th><td>${minutes[wk] ? duration(minutes[wk]) : "—"}</td><td>${sessions[wk] || 0}</td></tr>`).join("");

    return `
      <div class="chart" style="--cols:${weeksShown.length}">
        <div class="plot">
          <span class="target-line" style="bottom:${pct(target * 60)}%"><span>Target ${target} hr</span></span>
          ${bars}
        </div>
      </div>
      ${weeks.length > WEEKS_SHOWN ? `<p class="fine">The last ${WEEKS_SHOWN} weeks.</p>` : ""}
      <details class="as-table">
        <summary>Show as a table</summary>
        <table>
          <thead><tr><th scope="col">Week of</th><th scope="col">Time</th><th scope="col">Sessions</th></tr></thead>
          <tbody>${table}</tbody>
        </table>
      </details>`;
  }

  function renderSkills() {
    const unlocked = S().skillsUnlocked();
    const phaseName = (id) => S().plan.phases.find((p) => p.id === id).name;

    // The next skill you're working towards. In Data that's the current module;
    // Spanish has one at the end of each term, so count every task until then.
    const next = S().nextSkill();
    const nextUp = next && next.module;
    const left = !next ? 0 : S().unit === "week" ? next.left : next.inModule;

    return `
      ${unlocked.length ? `
        <ol class="skills">
          ${unlocked.map((s) => `
            <li>
              <span class="skill-line">${esc(s.skill)}</span>
              <span class="fine">${esc(s.where || phaseName(s.phaseId))}${s.date ? ` · ${shortDate(s.date)}` : ""}</span>
            </li>`).join("")}
        </ol>` : `<p class="empty">${S().unit === "week"
          ? "Skills appear here as you finish each term, written so you can lift them straight into a CV."
          : "Skills appear here as you finish each module, written so you can lift them straight into a CV."}</p>`}
      ${nextUp ? `
        <p class="skill-next">
          <span class="fine">Next to unlock · ${left} task${left === 1 ? "" : "s"} to go ${S().unit === "week" ? `to the end of ${esc(phaseOf(nextUp).name)}` : `in “${esc(nextUp.name)}”`}</span>
          <span class="skill-line">${esc(nextUp.skill)}</span>
        </p>` : ""}`;
  }

  function renderSessions() {
    const log = S().state.sessionLog.map((s, index) => ({ ...s, index })).reverse();
    const visible = showAllSessions ? log : log.slice(0, SESSIONS_SHOWN);

    const rows = visible.map((s) => {
      const t = s.taskId ? S().find(s.taskId) : null;
      const what = t ? t.task.label : s.taskId ? "A task no longer in the plan" : "Study session";
      return `
        <li>
          <span class="s-date">${longDate(s.date)}</span>
          <span class="s-what">${esc(what)} <span class="s-mins">· ${duration(s.minutes)}</span></span>
          ${s.note ? `<q class="s-note">${esc(s.note)}</q>` : ""}
          <button class="link-button s-remove" type="button" data-remove="${s.index}" data-key="${esc(Store.sessionKey(s))}" aria-label="Remove the session on ${longDate(s.date)}">Remove</button>
        </li>`;
    }).join("");

    return `
      <form class="session-form" id="session-form">
        <p class="fine">Studied without finishing a task? Log the time here.</p>
        <div class="session-fields">
          <label class="field">Date <input id="s-date" type="date" value="${Store.today()}" max="${Store.today()}" required></label>
          <label class="field">Time <span class="unit"><input id="s-minutes" type="number" inputmode="numeric" min="5" max="600" step="5" value="30" required><span>min</span></span></label>
          <label class="field s-note-field">Note <input id="s-note" type="text" maxlength="500" placeholder="Optional" autocomplete="off"></label>
        </div>
        <button class="btn" type="submit">Log session</button>
      </form>
      <p class="status" role="status">${logFlash ? `${esc(logFlash.text)}${logFlash.undo ? `<button class="link-button" type="button" id="log-undo">Undo</button>` : ""}` : ""}</p>
      ${log.length ? `<ol class="sessions">${rows}</ol>` : `<p class="empty">Each time you press Done on Today, the session lands here with your note.</p>`}
      ${log.length > SESSIONS_SHOWN ? `<button class="link-button" type="button" id="show-all">${showAllSessions ? "Show recent only" : `Show all ${log.length} sessions`}</button>` : ""}`;
  }

  // ─── A subject's settings (on Progress) ───────────────────────────────

  let pendingStart = null;    // a new start date waiting for "Change start date"
  let restartStep = false;    // the "Start over" confirmation is open
  let settingsFlash = null;   // { text, undo }

  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  function renderSubjectSettings() {
    const sub = S();
    const st = sub.state;
    const ticks = st.completedTaskIds.length;
    const notes = Object.values(st.notes).filter((t) => t.trim()).length;

    const startConfirm = pendingStart ? `
      <div class="confirm" role="group" aria-labelledby="confirm-start">
        <p id="confirm-start">Change ${esc(sub.name)}'s start date to ${longDate(pendingStart)}? Your ${plural(ticks, "ticked task")} stay ticked. Only the weekly chart changes.</p>
        <div class="actions">
          <button class="btn btn-solid" type="button" id="start-confirm">Change start date</button>
          <button class="link-button" type="button" id="start-cancel">Cancel</button>
        </div>
      </div>` : "";

    const cleared = [plural(ticks, "ticked task"), plural(st.sessionLog.length, "session")];
    if (notes) cleared.push(plural(notes, "note"));
    const restart = restartStep ? `
      <div class="confirm" role="group" aria-labelledby="confirm-restart">
        <p id="confirm-restart"><strong>Start ${esc(sub.name)} over?</strong> This clears ${cleared.join(", ")} in ${esc(sub.name)}, and starts it again today from the first task.${sub.id === "data" ? " Your Portfolio links stay." : ""} Other subjects aren't touched.</p>
        <p class="fine">Export a backup first, so you can import it back if you change your mind.</p>
        <div class="actions">
          <button class="btn" type="button" id="export">Export progress first</button>
          <button class="btn btn-solid" type="button" id="restart-confirm">Clear and start over</button>
          <button class="link-button" type="button" id="restart-cancel">Cancel</button>
        </div>
        <p class="status" role="status">${dataMessage ? esc(dataMessage) : ""}</p>
      </div>` : `
      <div class="setting">
        <button class="btn" type="button" id="restart">Start ${esc(sub.name)} over</button>
        <p class="fine">Clears ${esc(sub.name)}'s ticks, sessions and notes and starts again today${sub.id === "data" ? ", keeping your Portfolio links" : ""}. You'll be asked to confirm.</p>
      </div>`;

    return `
      <div class="setting">
        <label class="field" for="start-date">Started on
          <input id="start-date" type="date" value="${esc(pendingStart || st.startDate || Store.today())}" max="${Store.today()}" required>
        </label>
        <p class="fine">Where the weekly chart begins. It doesn't move you in the plan: that comes from the tasks you've ticked.</p>
      </div>
      ${startConfirm}
      ${restart}
      <p class="status" role="status">${settingsFlash ? `${esc(settingsFlash.text)}${settingsFlash.undo ? `<button class="link-button" type="button" id="settings-undo">Undo</button>` : ""}` : ""}</p>`;
  }

  view.addEventListener("change", (e) => {
    if (currentScreen() !== "progress" || e.target.id !== "start-date") return;
    const value = e.target.value;
    const sub = S();
    if (!value || value > Store.today()) return;
    if (value === sub.state.startDate) {
      pendingStart = null;
      render();
      return;
    }
    settingsFlash = null;
    if (sub.state.completedTaskIds.length) {
      pendingStart = value; // ticks exist: ask first
      render();
      const btn = document.getElementById("start-confirm");
      if (btn) btn.focus();
    } else {
      sub.setStartDate(value);
      settingsFlash = { text: `${sub.name} now starts on ${longDate(value)}.` };
      render();
    }
  });

  view.addEventListener("click", (e) => {
    if (currentScreen() !== "progress") return;
    const sub = S();
    const id = e.target.closest("button") && e.target.closest("button").id;
    if (id === "start-confirm" && pendingStart) {
      const value = pendingStart;
      pendingStart = null;
      settingsFlash = { text: `${sub.name} now starts on ${longDate(value)}. Your ticks are as they were.` };
      sub.setStartDate(value);
    } else if (id === "start-cancel") {
      pendingStart = null;
      render();
    } else if (id === "restart") {
      restartStep = true;
      dataMessage = null;
      settingsFlash = null;
      render();
      const btn = document.getElementById("restart-cancel");
      if (btn) btn.focus();
    } else if (id === "restart-cancel") {
      restartStep = false;
      dataMessage = null;
      render();
    } else if (id === "restart-confirm") {
      restartStep = false;
      dataMessage = null;
      const before = sub.startOver();
      settingsFlash = { text: `${sub.name} starts over today.`, undo: () => sub.restore(before) };
      render();
    } else if (id === "settings-undo" && settingsFlash && settingsFlash.undo) {
      const undo = settingsFlash.undo;
      settingsFlash = null;
      undo();
    }
  });

  function renderData() {
    const theme = Store.state.settings.theme;
    const option = (value, label) => `
      <label class="seg"><input type="radio" name="theme" value="${value}" ${theme === value ? "checked" : ""}><span>${label}</span></label>`;
    return `
      ${Store.mode === "synced"
        ? `<p>Progress is saved to your own Supabase database, behind your sign-in, so your phone, iPad and computers all show the same place. Export a backup now and then, just in case. A backup holds every subject.</p>
           <p class="fine">Signed in as <strong>${esc(Store.email || "")}</strong>. <button class="link-button" type="button" id="sign-out">Sign out on this device</button></p>`
        : `<p>Progress is saved in this browser only. Export a backup now and then — and when you move between your Mac and Windows machine, export on one and import on the other.</p>`}
      <p class="fine">Importing <strong>adds</strong> to what's here and never removes anything, so it's safe even with an older file.</p>
      <div class="actions">
        <button class="btn" type="button" id="export">Export progress</button>
        <label class="btn" for="import-file">Import a backup</label>
        <input class="visually-hidden" id="import-file" type="file" accept=".json,application/json">
      </div>
      <p class="status" role="status">${dataMessage && !restartStep ? esc(dataMessage) : ""}</p>
      <fieldset class="theme">
        <legend>Appearance</legend>
        <div class="segmented">${option("auto", "Match device")}${option("light", "Light")}${option("dark", "Dark")}</div>
      </fieldset>`;
  }

  function renderProgress() {
    if (S().locked) return renderLocked("Progress");
    const log = S().state.sessionLog;
    const totalMins = log.reduce((sum, s) => sum + s.minutes, 0);
    const { current, longest } = S().streaks();
    const target = S().state.weeklyHoursTarget;

    const headline = log.length
      ? `${hours(totalMins)} hour${hours(totalMins) === "1" ? "" : "s"} across ${log.length} session${log.length === 1 ? "" : "s"}.`
      : "Nothing logged yet.";

    view.innerHTML = `
      ${renderSubjectSwitch()}
      <header>
        <p class="eyebrow">Progress · ${esc(S().name)}</p>
        <h1 class="screen-title">${headline}</h1>
      </header>

      <section class="block" aria-labelledby="h-weeks">
        <div class="block-head">
          <h2 id="h-weeks">Hours each week</h2>
          <label class="target">Target
            <input id="target" type="number" inputmode="decimal" min="0.5" max="40" step="0.5" value="${target}">
            hrs a week
          </label>
        </div>
        ${renderChart()}
      </section>

      <section class="block" aria-labelledby="h-streak">
        <h2 id="h-streak">Streak</h2>
        <p class="streak"><span class="big">${current}</span> week${current === 1 ? "" : "s"} in a row</p>
        <p class="fine">Longest so far: ${longest} week${longest === 1 ? "" : "s"}. A week counts if you study at least once in it — skipping days never breaks anything.</p>
      </section>

      <section class="block" aria-labelledby="h-skills">
        <h2 id="h-skills">Skills unlocked</h2>
        ${renderSkills()}
      </section>

      <section class="block" aria-labelledby="h-log">
        <h2 id="h-log">Session log</h2>
        ${renderSessions()}
      </section>

      <section class="block" aria-labelledby="h-settings">
        <h2 id="h-settings">${esc(S().name)} settings</h2>
        ${renderSubjectSettings()}
      </section>

      <section class="block" aria-labelledby="h-data">
        <h2 id="h-data">Your data</h2>
        ${renderData()}
      </section>
    `;
  }

  async function exportProgress() {
    const filename = `climb-progress-${Store.today()}.json`;
    try {
      const blob = new Blob([Store.exportJSON()], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      dataMessage = `Saved ${filename} to your Downloads folder (on iPhone and iPad: the Files app → Downloads).`;
    } catch (e) {
      dataMessage = "This browser wouldn't save the file. Try again in Chrome.";
    }
    render();
  }

  // Reads a backup file and merges it in. `done(message)` gets the result in
  // words; by default it shows under "Your data" on Progress.
  function importProgress(file, done) {
    const report = done || ((message) => {
      dataMessage = message;
      render();
    });
    const reader = new FileReader();
    reader.onload = () => {
      const r = Store.importJSON(String(reader.result));
      if (!r.ok) report(r.error);
      else if (!r.tasksAdded && !r.sessionsAdded && !r.notesMerged) report("Nothing new in that backup — this already has all of it.");
      else {
        const parts = [];
        if (r.tasksAdded) parts.push(`${r.tasksAdded} finished task${r.tasksAdded === 1 ? "" : "s"}`);
        if (r.sessionsAdded) parts.push(`${r.sessionsAdded} session${r.sessionsAdded === 1 ? "" : "s"}`);
        if (r.notesMerged) parts.push(`${r.notesMerged} note${r.notesMerged === 1 ? "" : "s"} combined`);
        report(`Merged in ${parts.join(", ")}. Nothing here was removed.`);
      }
    };
    reader.onerror = () => report("Couldn't read that file.");
    reader.readAsText(file);
  }

  view.addEventListener("click", (e) => {
    if (currentScreen() !== "progress") return;
    const remove = e.target.closest("[data-remove]");
    if (remove) {
      const entry = S().removeSession(Number(remove.dataset.remove), remove.dataset.key);
      if (entry) logFlash = { text: `Removed the session on ${longDate(entry.date)}.`, undo: () => S().restoreSession(entry) };
      render();
    } else if (e.target.closest("#log-undo")) {
      const undo = logFlash.undo;
      logFlash = null;
      undo();
    } else if (e.target.closest("#show-all")) {
      showAllSessions = !showAllSessions;
      render();
    } else if (e.target.closest("#export")) {
      exportProgress();
    } else if (e.target.closest("#sign-out")) {
      Store.signOut().then(() => location.reload());
    }
  });

  view.addEventListener("change", (e) => {
    if (currentScreen() !== "progress") return;
    if (e.target.id === "target") {
      const v = Number(e.target.value);
      if (v > 0) S().setTarget(v);
      else render();
    } else if (e.target.name === "theme") {
      Store.setTheme(e.target.value);
    } else if (e.target.id === "import-file" && e.target.files[0]) {
      importProgress(e.target.files[0]);
    }
  });

  view.addEventListener("submit", (e) => {
    if (e.target.id !== "session-form") return;
    e.preventDefault();
    const mins = Math.round(Number(document.getElementById("s-minutes").value) || 0);
    const date = document.getElementById("s-date").value;
    if (!mins) return;
    logFlash = { text: `Logged ${duration(mins)} on ${longDate(date || Store.today())}.` };
    S().logSession(mins, document.getElementById("s-note").value, date);
  });

  // ─── Portfolio ─────────────────────────────────────────────────────────

  // Turns what was pasted into a usable web link, or returns null if it isn't one.
  // "github.com/me" becomes "https://github.com/me".
  function cleanLink(text) {
    const t = text.trim();
    if (!t) return "";
    const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    try {
      const u = new URL(withScheme);
      return /\./.test(u.hostname) && !/\s/.test(t) ? u.href : null;
    } catch (e) {
      return null;
    }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Older fallback in case the clipboard is blocked.
      const box = document.createElement("textarea");
      box.value = text;
      box.setAttribute("readonly", "");
      box.style.position = "fixed";
      box.style.opacity = "0";
      document.body.appendChild(box);
      box.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e2) { ok = false; }
      box.remove();
      return ok;
    }
  }

  // The link box, Open and Copy: the same on every card. `id` is where the link is saved.
  function linkBlock(id, link, hint) {
    return `
          <div class="pf-link">
            <label class="field" for="link-${esc(id)}">Link</label>
            <div class="pf-link-row">
              <input id="link-${esc(id)}" type="url" inputmode="url" autocomplete="off" spellcheck="false"
                data-link="${esc(id)}" value="${esc(link)}" placeholder="${esc(hint || "Paste the link once it exists")}">
              <a class="btn" data-open="${esc(id)}" target="_blank" rel="noopener" ${link ? `href="${esc(link)}"` : `aria-disabled="true"`}>Open<span class="arrow" aria-hidden="true">↗</span></a>
              <button class="btn" type="button" data-copy="${esc(id)}" ${link ? "" : "disabled"}>Copy</button>
            </div>
            <p class="pf-msg" id="msg-${esc(id)}" role="status"></p>
          </div>`;
  }

  // Side modules with a piece of work get their own card, after the phases.
  const sideWork = () => D().sides.filter((side) => side.plan.portfolio);

  function renderSideCard(side) {
    const pf = side.plan.portfolio;
    const link = D().state.portfolioLinks[pf.id] || "";
    const done = D().isDone(pf.taskId);
    const doneOn = done ? D().lastLoggedDate([pf.taskId]) : null;
    const started = side.done() > 0;
    const state = done ? "is-done" : started ? "is-started" : "is-upcoming";
    const status = done
      ? `<span class="stamp">Done${doneOn ? ` · ${shortDate(doneOn)}` : ""}</span>`
      : side.locked && side.locked()
        ? `<span class="pf-status">Locked · ${esc(side.plan.unlockedBy.text)}</span>`
      : started
        ? `<span class="pf-status">In progress · ${side.done()} of ${side.tasks().length} tasks in the module</span>`
        : `<span class="pf-status">Not started</span>`;
    return `
        <article class="pf-card ${state}">
          <p class="pf-tab">Side module · ${esc(side.plan.shortName || side.name)}</p>
          <h2 class="pf-title">${esc(pf.name)}</h2>
          ${status}
          <p class="pf-desc">${esc(pf.deliverable)}</p>
          ${linkBlock(pf.id, link, pf.linkHint)}
        </article>`;
  }

  function renderPortfolio() {
    const cur = D().current();
    const cards = D().plan.phases.map((phase, i) => {
      const s = D().phaseStats(phase);
      const link = D().state.portfolioLinks[phase.id] || "";
      const finishedOn = s.status === "done"
        ? D().lastLoggedDate(phase.modules.flatMap((m) => m.tasks.filter((t) => !t.optional).map((t) => t.id)))
        : null;
      const isHere = cur && cur.phase.id === phase.id;
      const state = s.status === "done" ? "is-done" : s.done > 0 || isHere ? "is-started" : "is-upcoming";
      const status = s.status === "done"
        ? `<span class="stamp">Done${finishedOn ? ` · ${shortDate(finishedOn)}` : ""}</span>`
        : state === "is-started"
          ? `<span class="pf-status">In progress · ${s.done} of ${s.total} tasks</span>`
          : `<span class="pf-status">Not started</span>`;

      return `
        <article class="pf-card ${state}${isHere ? " is-here" : ""}">
          <p class="pf-tab">Phase ${i + 1} · Days ${phase.dayStart}–${phase.dayEnd}</p>
          <h2 class="pf-title">${esc(phase.deliverableName || phase.name)}</h2>
          ${status}
          <p class="pf-desc">${esc(phase.deliverable)}</p>
          ${linkBlock(phase.id, link, phase.linkHint)}
        </article>`;
    }).join("");

    const finished = D().plan.phases.filter((p) => D().phaseStats(p).status === "done").length;
    const headline = finished === 0
      ? "Your work samples, as they come together."
      : `${finished} of ${D().plan.phases.length} pieces of work finished.`;

    view.innerHTML = `
      <header class="pf-intro">
        <p class="eyebrow">Portfolio</p>
        <h1 class="screen-title">${headline}</h1>
        <p class="fine">When an application asks for work samples, copy every link at once.</p>
        <div class="actions"><button class="btn btn-solid" type="button" id="copy-all">Copy all links</button></div>
        <p class="status" role="status" id="copy-all-msg"></p>
      </header>
      <div class="pf-stack">${cards}</div>
      ${sideWork().length ? `
        <section class="pf-side" aria-labelledby="pf-side-h">
          <h2 class="pf-side-h" id="pf-side-h">Side work <span>Extra pieces from side modules, apart from the phase projects above</span></h2>
          <div class="pf-stack">${sideWork().map(renderSideCard).join("")}</div>
        </section>` : ""}
    `;
  }

  function linkInput(phaseId) {
    return view.querySelector(`[data-link="${CSS.escape(phaseId)}"]`);
  }

  // "Open" is a real link, so it opens in a new tab like any other link.
  function setOpenLink(phaseId, url) {
    const a = view.querySelector(`[data-open="${CSS.escape(phaseId)}"]`);
    if (!a) return;
    if (url) {
      a.href = url;
      a.removeAttribute("aria-disabled");
    } else {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
    }
  }

  function setMessage(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  view.addEventListener("input", (e) => {
    const box = e.target.closest("[data-link]");
    if (!box) return;
    const id = box.dataset.link;
    const url = cleanLink(box.value);
    if (url !== null) D().setPortfolioLink(id, url);
    view.querySelectorAll(`[data-copy="${CSS.escape(id)}"]`).forEach((b) => { b.disabled = !url; });
    setOpenLink(id, url);
    setMessage(`msg-${id}`, "");
    setMessage("copy-all-msg", "");
  });

  // When you leave the box: tidy what was pasted, or explain what's wrong with it.
  view.addEventListener("change", (e) => {
    const box = e.target.closest("[data-link]");
    if (!box) return;
    const url = cleanLink(box.value);
    if (url === null) {
      setMessage(`msg-${box.dataset.link}`, "That doesn't look like a web link. It should look like github.com/your-name/project.");
    } else {
      box.value = url;
      setMessage(`msg-${box.dataset.link}`, url ? "Saved." : "");
    }
  });

  view.addEventListener("click", async (e) => {
    if (currentScreen() !== "portfolio") return;

    const copy = e.target.closest("[data-copy]");
    if (copy) {
      const id = copy.dataset.copy;
      const url = cleanLink(linkInput(id).value);
      if (url) setMessage(`msg-${id}`, (await copyText(url)) ? "Copied." : "Couldn't copy — select the link and press Ctrl+C.");
      return;
    }

    if (e.target.closest("#copy-all")) {
      const pieces = [
        ...D().plan.phases.map((p) => ({ id: p.id, name: p.deliverableName || p.name })),
        ...sideWork().map((side) => ({ id: side.plan.portfolio.id, name: side.plan.portfolio.name }))
      ];
      const lines = pieces
        .map((p) => {
          const url = D().state.portfolioLinks[p.id];
          return url ? `${p.name}: ${url}` : null;
        })
        .filter(Boolean);
      if (!lines.length) {
        setMessage("copy-all-msg", "No links yet — paste one into a card below once it's online.");
        return;
      }
      const ok = await copyText(lines.join("\n"));
      setMessage("copy-all-msg", ok
        ? `Copied ${lines.length} link${lines.length === 1 ? "" : "s"}, one per line, ready to paste.`
        : "Couldn't reach the clipboard in this browser.");
    }
  });

  // ─── Guide ─────────────────────────────────────────────────────────────
  // A page like the others (#guide), reached from "? Guide" in the top bar.
  // It opens by itself once on each new device, the first time the app loads.

  const GUIDE_SEEN_KEY = "climb.guideSeen";

  function firstVisitOnThisDevice() {
    try {
      if (window.localStorage.getItem(GUIDE_SEEN_KEY) === "1") return false;
      window.localStorage.setItem(GUIDE_SEEN_KEY, "1");
      return true;
    } catch (e) {
      return false; // can't remember it was shown, so don't show it every time
    }
  }

  function renderGuide() {
    const es = Store.subject("spanish");
    const sides = D().sides;
    const sideOpen = sides.find((side) => side.current());
    view.innerHTML = `
      <header class="guide-intro">
        <p class="eyebrow">Guide</p>
        <h1 class="screen-title">How to use The Climb</h1>
        <p class="lede">Data is your major, Spanish your minor, and German an elective that unlocks later. Everything you do saves by itself and shows up on every device you've signed in on.</p>
        <div class="actions"><a class="btn btn-solid" href="#today">Go to Today</a></div>
      </header>

      <section class="block guide" aria-labelledby="g-routine">
        <h2 id="g-routine">Every day</h2>
        <ol class="steps">
          <li>Open <strong>Today</strong>. Each subject has one card with its next task: Data first${sideOpen ? `, then ${esc(sideOpen.name)} (a short Data side module) while it's unfinished` : ""}${es ? ", then Spanish" : ""}.</li>
          <li>Press the card's link (Open lesson, Listen, Watch…) and do the task.</li>
          <li>Press <strong>Done</strong>. A box asks how long it took, already filled in with the usual time.</li>
          <li>Change the minutes if you need to, add a note if you like, then press <strong>Enter</strong> or Save.</li>
          <li>The next task slides in. Pressed Done by mistake? <strong>Undo</strong> is right under the card.</li>
        </ol>
      </section>

      <section class="block guide" aria-labelledby="g-screens">
        <h2 id="g-screens">The four screens</h2>
        <dl class="terms">
          <div><dt>Today</dt><dd>Your next task in each subject, and nothing else.</dd></div>
          <div><dt>Map</dt><dd>A subject's whole plan. Tick tasks you did out of order, and keep notes.</dd></div>
          <div><dt>Progress</dt><dd>Hours each week, streak, skills and every session. Backups and each subject's settings are at the bottom.</dd></div>
          <div><dt>Portfolio</dt><dd>A link to each Data phase's project${sides.some((side) => side.plan.portfolio) ? ", plus side work (the Variance report and your portfolio site) in its own section" : ""}. Copy all links when an application asks for work samples.</dd></div>
        </dl>
        <p class="fine">On the Map and Progress, pick the subject with the switch at the top. They always open on Data.</p>
      </section>

      <section class="block guide" aria-labelledby="g-buttons">
        <h2 id="g-buttons">On Today</h2>
        <dl class="terms">
          <div><dt>Not today</dt><dd>Sets that task aside for today only and shows the next one. Tomorrow it's first again, and nothing gets reshuffled. Use it when you can't do that task today.</dd></div>
          <div><dt>Light week</dt><dd>The switch near the bottom, for a lighter work week. It adds an extra hour of Data on 2–3 weekdays and 15 more minutes of Spanish listening a day, each as a dashed block with its own Done. It never adds German. It's on for this week only and switches off on Monday.</dd></div>
          <div><dt>Bad-week minimum</dt><dd>The note under the switch: 3 hours of Data, plus one Spanish session so the Spanish streak keeps going. It shows where this week stands.</dd></div>
        </dl>
      </section>

      <section class="block guide" aria-labelledby="g-know">
        <h2 id="g-know">Good to know</h2>
        <ul class="notes">
          <li><strong>Unticking.</strong> Undo appears right after Done. Later, untick any task on the Map. That doesn't remove time you logged; remove the session in Progress → Session log. Importing a backup only ever adds, so it can bring back a tick you removed.</li>
          <li><strong>Streaks count weeks.</strong> Study once in a week and the week counts. Skipping a day never breaks a streak.</li>
          ${sides.length ? `<li><strong>Side modules</strong> are extras beside the Data plan: ${sides.map((side) => esc(side.name)).join(" and ")}. They don't change Data's day count or the 180 days, but their time counts toward Data's hours. Each shows on Today under Data until it's finished, then lives at the bottom of Data's Map.</li>` : ""}
          ${D().side("site") ? `<li><strong>Portfolio site</strong> unlocks when you finish the Telecom complaints database. Every task is an hour or less, so it fits a lighter week. Each “add this card to your site” task appears once its project is finished. Steps 8 and 9 are optional stretch steps: tick them on the Map, they never appear on Today.</li>` : ""}
          <li><strong>Portfolio projects:</strong> one at the end of each phase (SQL, Power BI, Python), each ending with its README. You write the SQL, DAX and Python yourself; Claude only helps with the README layout.</li>
          <li><strong>Optional tasks</strong> (like the CS50 video, for the certificate) are on the Map with “Optional”, never on Today, and a module is finished without them.</li>
          <li><strong>German</strong> unlocks when you tick the Spanish Term 2 exam (on Today or the Map). Untick the exam and it locks again, keeping its progress.</li>
          <li><strong>Back up monthly:</strong> Progress → Your data → Export progress. One file holds every subject.</li>
          <li><strong>Settings</strong> are at the bottom of Progress. Pick the subject with the switch at the top first.</li>
          <li><strong>Started on</strong> only changes where the hours chart begins. It doesn't move you in the plan: that comes from the tasks you've ticked, and they're always kept.</li>
          <li><strong>To really restart a subject:</strong> Progress → Start over. It offers an export first, and Undo right after. Data keeps your Portfolio links.</li>
        </ul>
      </section>

      <section class="block guide" aria-labelledby="g-devices">
        <h2 id="g-devices">Your link and signing in</h2>
        <p>The Climb lives at <a href="${esc(location.origin + location.pathname)}">${esc((location.host + location.pathname).replace(/\/$/, ""))}</a>. Bookmark it on each device.</p>
        <ul class="notes">
          <li><strong>Signing in:</strong> your email and password, once on each device. It stays signed in until you sign out (Progress → Your data). Let your phone or browser save the password for you.</li>
          <li><strong>Only you</strong> can see or change your progress. The app's code is public on GitHub; your progress isn't.</li>
          <li><strong>Forgot the password?</strong> Set a new one in Supabase; the README has the steps. Your progress isn't touched.</li>
        </ul>
      </section>

      <section class="block guide" aria-labelledby="g-phone">
        <h2 id="g-phone">On iPhone and iPad</h2>
        <p>Open the link in Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>. The Climb then opens from its own icon. That icon keeps its own sign-in, separate from Safari, so it asks for your email and password once.</p>
      </section>

      <section class="block guide" aria-labelledby="g-paused">
        <h2 id="g-paused">If it says your project is paused</h2>
        <p>Your progress is kept in a free Supabase project, and Supabase pauses free projects after about a week with no use. Studying keeps it awake, and a small automatic check on GitHub visits it every few days, so this should be rare. Nothing is lost when it pauses.</p>
        <ol class="steps">
          <li>Go to <a href="https://supabase.com/dashboard">supabase.com/dashboard</a> and sign in.</li>
          <li>Open your project (<strong>the-climb</strong>) and press <strong>Restore project</strong>.</li>
          <li>Wait a few minutes until it says it's running, then reload The Climb.</li>
        </ol>
      </section>

      <p class="guide-end"><a class="btn" href="#today">Go to Today</a></p>
    `;
  }

  // ─── Routing ───────────────────────────────────────────────────────────

  const SCREENS = {
    today: renderToday,
    map: renderMap,
    progress: renderProgress,
    portfolio: renderPortfolio,
    guide: renderGuide
  };

  const TITLES = { today: "Today", map: "The Map", progress: "Progress", portfolio: "Portfolio", guide: "Guide" };

  function currentScreen() {
    const name = location.hash.replace("#", "");
    return SCREENS[name] ? name : "today";
  }

  function render() {
    const name = currentScreen();
    document.querySelectorAll(".nav a, .guide-link").forEach((a) => {
      if (a.dataset.view === name) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    applyTheme();
    showStorageWarning();
    document.title = `${TITLES[name]} · The Climb`;
    // Map and Progress take the chosen subject's colour; Today colours each group itself.
    view.className = (name === "map" || name === "progress") && shown !== "data" ? `accent-${shown}` : "";
    SCREENS[name]();
  }

  window.addEventListener("hashchange", () => {
    flash = null;
    logFlash = null;
    dataMessage = null;
    pendingStart = null;
    restartStep = false;
    settingsFlash = null;
    logging = null;
    render();
    view.focus();
  });

  Store.onChange(onStoreChange);
  Store.onStatus(showStorageWarning);
  if (firstVisitOnThisDevice()) location.replace("#guide"); // first time on this device: start on the guide
  render();
})();
