# The Climb

Your 180-day plan from spreadsheets to analytics engineering, in three phases: SQL (with CS50 SQL), Power BI, then Python. Each phase ends with a portfolio project on GitHub. Open it, do the one task on the card, press Done.

It's set up like a small school:

| Subject | Type | Normal week | Light week | Plan file |
|---|---|---|---|---|
| Data (the 180 days) | Major | 5–7 hrs | 9–10 hrs | `curriculum.js` |
| Spanish | Minor | about 2 hrs | 3–4 hrs | `spanish.js` |
| German | Elective | 1–2 hrs, once unlocked | no extra | `german.js` |

Plus two **side modules** under Data, which don't change Data's 180 days: *Finance & SAP Reporting Basics* (about 6.5 hours over 2–3 weeks, `sidemodule-finance.js`) and *Portfolio site* (about 28 hours plus 6 optional, `sidemodule-site.js`), which unlocks once the SQL project is finished.

---

## The synced version (phone, iPad, laptop)

The Climb is published on GitHub Pages: **LINK-COMES-HERE**

Your progress is saved in your own free Supabase project, so every device you sign in on shows the same place. Each change saves within a second or two, and another device with the page open updates by itself.

- **Signing in:** your email and password, once on each device. It stays signed in until you sign out (Progress → Your data → Sign out on this device). No emails are involved.
- **iPhone and iPad Home Screen:** Safari → Share → Add to Home Screen. The icon keeps its own sign-in, separate from Safari, so it asks for your password once.
- **Private:** only you can read or change your progress. Sign-ups are switched off, and the database itself checks every request. The app's code is public on GitHub, which is fine: there's nothing private in it.
- **Backups:** Export progress still works (on iPhone/iPad the file goes to Files → Downloads). Do it monthly.

### Forgot your password?

Set a new one in Supabase. This changes only the password; your progress isn't touched.

1. Sign in at supabase.com/dashboard and open **the-climb**.
2. Left bar: **SQL Editor** → **New query**.
3. Paste this, put your new password and your email between the quote marks, and press **Run**:
   ```sql
   update auth.users
   set encrypted_password = extensions.crypt('NEW PASSWORD HERE', extensions.gen_salt('bf'))
   where email = 'YOUR EMAIL HERE';
   ```
   It should say "Success. 1 row".
4. The query (with the password in it) is kept in the SQL Editor's list on the left. Delete it there: **⋯** next to it → **Delete query**.

Don't delete your user and make a new one instead: that would delete your progress with it.

### If the app says your project is paused

Supabase pauses a free project after about a week with nobody using it. Two things stop that: you studying (every visit counts), and a small job on GitHub that visits it every three days. So it should only happen if both stop.

Nothing is lost when it pauses. Go to supabase.com/dashboard, open **the-climb**, press **Restore project**, wait a few minutes, then reload The Climb. (Supabase only keeps a paused project restorable from the dashboard for 90 days, so don't leave it longer than that.)

GitHub switches off scheduled jobs in a repository nobody has changed for 60 days, and emails you first. If that email comes, click its button to keep the job on, or ask Claude Code to make any small change.

### Where things are set up

| What | Where |
|---|---|
| The app's code | GitHub: the `the-climb` repository. Every change pushed to `main` republishes the site within a minute or two (`.github/workflows/pages.yml`). |
| Your progress | Supabase: project `the-climb`, table `progress`, one row. |
| The database setup | `supabase/setup.sql`, run once in Supabase's SQL Editor. Safe to run again. |
| Which Supabase project the app talks to | `climb/config.js` (its address and public key). |
| Keep-awake job | `.github/workflows/keep-awake.yml`. |

**Publishing a change.** The public repository has its own clean history, separate from the full one on this computer. After a change is committed, ask Claude Code to "publish The Climb", which runs `scripts/publish-public.sh`. It leaves out everything listed in `.publicignore` and never sends this computer's history. The site asks search engines not to list it, so only people with the link find it.

## Opening it (local copy)

Double-click **`index.html`** in this folder. It opens in your browser and saves in that browser only; it never touches your online progress. There's nothing to install and no internet connection needed, except for the lesson links and the fonts. (If the fonts can't load, it falls back to standard ones and still works.) Use the online version as your main copy; the local copy is a fallback.

- **Use Chrome.** Your progress is saved inside the browser. If you open the app in a different browser, it starts from scratch.
- **Bookmark it** after the first open (Ctrl+D on Windows, Cmd+D on Mac), so it's one click away.
- In Chrome, you can move or rename this folder without losing progress.

## Your two machines

- **The Mac is your main machine.** Use the app there for everything.
- **The Windows machine is for the Power BI work in Phase 2 (days 80–133)**, and tasks 9–10 of the Finance side module. Power BI Desktop and Excel's Data Model only run on Windows.

With the online version there's nothing to copy: open the link in Chrome on Windows, sign in once, and it's the same progress as the Mac.

### Moving progress by file (local copies only)

If you ever use the local copy, each machine keeps its own progress. Export on one (**Progress → Your data → Export progress**), get the file across (Google Drive, email, USB stick), and **Import a backup** on the other.

**Importing adds and never removes.** Finished tasks, sessions and notes from the file are combined with what's already there. You can't lose progress by importing, even if you pick an older file by mistake, and importing the same file twice does nothing.

Because importing never removes anything, **a task you unticked will come back ticked** if you import a backup where it was still ticked. That's deliberate: never losing progress matters more than being able to untick. If it happens, just untick it again.

When two copies have different notes for the same module, both are kept, the other one under a line saying *"— from your other machine —"*. Tidy them up whenever you like.

## Backing up

Online, your progress lives in Supabase and survives anything that happens to a device or browser. Export a backup now and then anyway (the end of each phase is a good habit) and keep the files somewhere safe, like Google Drive. To restore, import the latest one.

The local copy keeps progress in Chrome's storage for that page, which does **not** survive clearing Chrome's browsing data with "Cookies and other site data" ticked.

## How it behaves

- **Today** shows one task, the next one you haven't done. Under it are the next three, faded, so you can see what's coming.
- **Done** asks how long it took. The box is pre-filled with the estimate, so you can type a note and press Enter, or just press Enter.
- **Not today** sets the task aside for today only. Tomorrow it's first again, and nothing gets reshuffled. Undo is right there if you change your mind.
- **"Day 12 of 180"** is the day of the task you're on, not the number of days since you started. It always matches where you actually are, so it can never say you're behind.
- **Streaks count weeks, not days.** A week counts if you study at least once in it. Skipping a Tuesday can't break anything; only a whole week off ends a streak. The current week never counts against you while it's still going.
- **The Map** lets you tick or untick any task (for something you did out of order) and keep notes for each module. Ticking on the Map doesn't log time; only Done on Today does that. To log time without finishing a task, use the form in **Progress → Session log**.
- **Skills** appear on the Progress screen as each module is finished, written as CV lines you can use as they are.
- **Portfolio** holds a link for each phase's finished work. **Copy all links** gives you a ready-to-paste list for job applications.
- **Appearance** (light, dark, or match your device) is at the bottom of the Progress screen.

- **Guide** (the "? Guide" link in the top bar) explains all of this inside the app. It opens by itself the first time you use the app on each device.

### Subjects

- **Today** shows a group for each subject you're studying, each with its next task. Data comes first.
- **Spanish** runs in weeks: five short weekday sessions (Language Transfer and Duolingo, later Dreaming Spanish), a 30-minute listening session and a 20-minute review. It works like Data: the next session is simply the next undone task, so missing days never puts you behind. Language Transfer's 90 tracks run one a day, so the last 25 finish in the first five weeks of Term 2.
- **Spanish exams** close Terms 1 and 2: a 2-minute recorded introduction, then a 15-minute conversation with a HelloTalk or Tandem partner. They show on the Map where Data shows its deliverables.
- **German** stays locked until you mark the Spanish Term 2 exam done. Untick the exam and it locks again (its progress is kept). Only the first task is written; ask Claude Code for the rest when it unlocks.
- **Light week** (the switch near the bottom of Today) is for a lighter work week. It adds an extra hour of Data on two or three weekdays and 15 more minutes of Spanish listening a day, never anything for German. It's on for the current week only and switches off on Monday.
- **The bad-week minimum** under it: 3 hours of Data, plus one Spanish session so the Spanish streak keeps going. It shows where this week stands.
- **Side modules** are extras beside a subject's plan. Data has two: *Finance & SAP Reporting Basics* (10 tasks, about 6.5 hours) and *Portfolio site* (below). Each one shows on Today as its own group under Data, with its own next task, Done and Not today, until every task is done; then it leaves Today. It always stays at the bottom of Data's Map, where tasks can be ticked or unticked. It never changes Data's day count or the 180 days. Its time does count toward Data's hours, streak and the bad-week minimum, because it's Data study. Finishing it adds a skill line on Data's Progress.
- **Portfolio site** is locked until you finish the Telecom complaints database (its README task); untick that and it locks again. Then it's on Today like the Finance module. Every task is an hour or less, so it suits a lighter week. Its "add this card to your site" tasks for the Power BI and Python projects appear once each project is finished; until then the Map says what they're waiting for. Steps 8 and 9 are optional stretch steps.
- **Optional tasks** (the CS50 video and submission, and the site's stretch steps) are on the Map marked "Optional". They never appear on Today, and a module is finished without them. Tick them on the Map when you do them.
- **Portfolio projects:** each phase ends with one (Telecom complaints database, Budget vs actual dashboard, Mailing list cleaning pipeline), finished with a README in a fixed order: problem, data, approach, key findings with numbers, screenshot, how to run, what you'd do next. You write the SQL, DAX and Python yourself; Claude only helps with the README layout.
- **Map and Progress** have a subject switch at the top. They always open on Data. Each subject has its own streak, weekly target, skills and session log.
- **Portfolio** is Data only: the three phase projects, then a separate "Side work" section with the **Variance report** and the **Portfolio site**. Copy all links includes it once it has a link.
- **Each subject's settings** are at the bottom of its Progress screen:
  - **Started on** sets where the weekly chart begins. It never moves you in the plan, because that comes from your ticked tasks, so ticks are always kept. If the subject already has ticks, it asks before changing.
  - **Start over** clears that subject's ticks, sessions and notes and starts it again today from the first task. Data keeps its Portfolio links. It asks first and offers an export, and Undo is there straight after.
- **Colours:** Data marks "where you are" in persimmon, Spanish in olive and German in slate blue.

---

## Changing the plan

Data's plan is in **`curriculum.js`**. Spanish's is in **`spanish.js`**: same shape, but the weeks are built by short recipes at the bottom of the file, so a change to "every Saturday" is made once. German's is in **`german.js`**. Data's side modules are in **`sidemodule-finance.js`** and **`sidemodule-site.js`**: same task shape, grouped in modules, with no days. You can open it in any text editor, or describe the change to Claude Code (see the end of this section). The rule that keeps your progress safe:

> **Never change a task's `id` once you've finished that task.** The id is how the app remembers it's done. Everything else (wording, link, time, order) is safe to change.

### What a task looks like

```js
{
  id: "sqlbolt-6",
  label: "SQLBolt lesson 6: Multi-table queries with JOINs",
  detail: "INNER JOIN — like a VLOOKUP that only keeps rows where a match exists on both sides.",
  estimatedMinutes: 40,
  url: "https://sqlbolt.com/lesson/select_queries_with_joins",
  type: "interactive"
},
```

| Line | What it is |
|---|---|
| `id` | A unique name, lowercase with dashes. Make one up for new tasks; never reuse one. |
| `label` | The title on the card. |
| `detail` | One or two sentences under the title. |
| `estimatedMinutes` | Roughly how long it takes. It pre-fills the "how long did it take?" box. |
| `url` | Where the Open button goes. Use `""` for no button. |
| `type` | One of `interactive`, `video`, `reading`, `practice`, `build`, `setup`. It sets the small label and the button wording. |

### Common changes

- **Add a task:** copy an existing task block, from its `{` to its `},`, paste it where you want it, then give it a new `id` and change the other lines.
- **Reorder tasks:** move whole blocks up or down. Tasks run top to bottom.
- **Change a link or wording:** just edit it.
- **Remove a task:** delete its block. If you'd already finished it, nothing breaks; the app quietly ignores it.

Phases and modules have a few extra lines (day ranges, the *why*, the deliverable, and the `skill` line that appears on Progress). Those are described at the top of `curriculum.js`.

### After editing

Save the file and refresh the page (F5 on Windows, Cmd+R on Mac). **If the page comes up blank**, there's a typo in `curriculum.js`, nearly always a missing comma between two blocks or a missing quote mark. Undo your last change, or ask Claude Code to find it.

### Asking Claude Code to change it

Describe the change the way you'd spec anything else, for example:

- *"In curriculum.js, add a task after sqlzoo-null: 'Practice LEFT JOINs on my own reconciliation data', 45 minutes, type build, no link."*
- *"Move the Google Sheets chapter (atbs-sheets) to the end of the Python phase."*
- *"Check every link in curriculum.js still works."*

Claude Code can also run the plan checker, which catches duplicate ids, gaps in the day ranges and missing fields:

```
node tests/check-curriculum.js
```

---

## What's in this folder

| File | What it does |
|---|---|
| `index.html` | The page: online, and when opened as a local file. |
| `config.js` | Which Supabase project to save to. Empty means "this browser only". |
| `vendor/supabase.js` | Supabase's own library (sign-in and saving), kept here so the app doesn't depend on another website. |
| `icon-180.png` | The iPhone and iPad Home Screen icon. |
| `curriculum.js` | Data's plan: every phase, module and task. |
| `sidemodule-finance.js` | Data's side module, Finance & SAP Reporting Basics: 10 tasks and its Portfolio card. |
| `sidemodule-site.js` | Data's side module, Portfolio site: steps 0–9, the project-card reminders, and its Portfolio card. |
| `spanish.js` | Spanish's plan: three terms of weeks, with the two exams. |
| `german.js` | German's plan: the structure only, for now. |
| `store.js` | Signing in, saving and loading your progress (Supabase online, the browser locally), and working out where you are. |
| `app.js` | Draws the four screens, for every subject. |
| `styles.css` | How everything looks: colours, type and layout, in light and dark. |
| `README.md` | This file. |
| `CHANGELOG.md` | Links that were swapped for working ones, and changes made from the original spec. |

One level up, outside this folder: `tests/` holds the checks Claude Code runs after changes, `supabase/setup.sql` sets up the database, and `.github/workflows/` publishes the site and keeps Supabase awake. The whole project is also tracked with git, with a save point after each working piece, so any change can be rolled back. Ask Claude Code to "go back to before the last change" if something you liked breaks.
