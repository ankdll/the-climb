# Changelog

## 2026-11-13: Mailing list pipeline becomes an ETL project

- Phase 3's *Mailing list cleaning pipeline* keeps its name, and its description now says it's an ETL pipeline: Extract → Transform → Load → Report.
- New tasks: set up the script as those four steps (you write the code yourself); log every step to a file with timestamps and row counts; incremental load, where a second run adds 0 rows and the README explains how.
- "Flag rows for review" is now "Validation checks, with a count per check" (same id, 60 minutes). Flagged rows still stay. The summary report also shows the run time. The README's key findings use the counts from the log.
- That adds about 3 hours (Phase 3 is now about 35). Days were re-spread by hours, still 180: SQL days 1–78, Power BI 79–129, Python 130–180. The mailing list project is days 160–176. Phase 4 is unchanged (days 181–207).

## 2026-11-13: ETL Basics side module

- A side module under Data, *ETL Basics*, in its own file (`sidemodule-etl.js`): about 3 hours over 5 tasks, none longer than 40 minutes, so it suits a lighter week. Available now. Data's day count and 180 days don't change.
- Tasks: what ETL is and ETL vs ELT (and why warehouses moved to ELT); full vs incremental loads, watermarks and key-based dedupe; idempotent pipelines; data quality checks and logging; a 5-line answer on ETL done in Excel/VBA, for interviews.
- Free sources only: IBM Think, AWS, Microsoft Learn, SQLite's docs, Start Data Engineering and Python's docs. All links checked on 2026-11-13.

## 2026-11-12 (later): Phase 4, Data Engineering

- A new Phase 4 after day 180, about 20 hours over 27 days, on the Mac. Phases 1–3 still fill the 180 days. Today says "Day N of 180" until then, and "Phase 4 · Day X of 27" in Phase 4.
- Main course: Start Data Engineering's free *Data Engineering 101* (courses.startdataengineering.com/learn/de101). Kept: set-up, data warehouses, the multi-hop architecture, Docker, processing engines (Spark, DuckDB), schedulers and Airflow, dbt. Skipped: its SQL and Python chapters (Phases 1 and 3) and its Kimball chapter (Phase 2's star schema). The hours are estimates. A short task right after the Docker set-up asks you to check them.
- Phase 4's portfolio project is required: a **dbt layer on the telecom database** (dbt-core with DuckDB, run locally, nothing expires), with its README task and its own Portfolio card.
- The Portfolio site module gets a third card reminder, for the dbt layer.
- The Map's mountain now runs to the end of Phase 4.

## 2026-11-12: CS50 SQL, portfolio projects, Portfolio site

- **CS50 SQL is Phase 1's main course:** weeks 0–6, each lecture in two halves and each problem set in one or two sittings. SQLBolt, SQLZoo, the SQL Tutorial and PostgreSQL Exercises lessons that weren't done yet are gone; DataLemur's CTE lesson, the window-function lessons and one set of interview questions stay, because CS50 barely covers them.
- **Done before the switch:** the 10 Phase 1 tasks finished before the change (SQLBolt 1–5, three SQLZoo sets, PostgreSQL Exercises Basic and the cheat-sheet start) stay as their own group at the start of Phase 1, with their time and their skill line. The other cheat-sheet tasks are gone.
- **Three phases now, still 180 days.** Day ranges are spread by hours: SQL days 1–79, Power BI 80–133, Python 134–180. The old Phase 4 is gone: Git moved to Phase 1 (each project needs GitHub), dbt Fundamentals and the old dbt project go to a later Data Engineering phase, and the last three tasks (README for The Climb, the hiring-manager review, the CV) now close Phase 3. The repeated README and "publish" tasks were removed, because each project now has its own.
- **Portfolio projects** replace the phase deliverables:
  - Phase 1: *Telecom complaints database*, on the FCC's Consumer Complaints data (opendata.fcc.gov, dataset 3xyp-aqkj). It is also the CS50 SQL final project. The video and the submission are optional tasks, needed only for the certificate (deadline 30 June 2027).
  - Phase 2: *Budget vs actual dashboard*, on Microsoft's AdventureWorks finance sample (monthly Actual and Budget, 2010–2013). Saved as a Power BI project (PBIP), so GitHub shows the changes as text, with screenshots, because Publish to web needs a work account. The Kaggle dataset task stays, now as practice for the modelling module.
  - Phase 3: *Mailing list cleaning pipeline*, on fake contact data made with Faker. Rows are flagged in helper columns, never deleted. It replaces the VBA rebuild and the cleaning practice on a data.gov file.
- **Optional tasks:** a task can be marked optional. It shows on the Map with "Optional", never on Today, and isn't needed for its module to be finished.
- **Portfolio site side module** (`sidemodule-site.js`): steps 0–9 to build your own site by hand with The Odin Project, MDN and Kevin Powell, unlocked by the telecom README. It's about 28 hours, plus 6 for the optional stretch steps. Card reminders for the Power BI and Python projects wait until those projects are finished. It has its own Portfolio card. Its first task sets the rule: you write the code; AI only explains errors and reviews your code afterwards.
- All new links checked on 2026-11-12.

## 2026-11-06: Moved to GitHub Pages and Supabase

- The Climb is no longer a Claude artifact. The app is published on GitHub Pages from the `climb/` folder, and progress is saved in your own free Supabase project.
- Sign-in is email and password. (Email links and codes were tried first: Supabase's free plan no longer lets the sign-in email be edited to include a code, and a link can't sign in a Home Screen icon on iPhone and iPad.) No emails are sent.
- Sign-ups are switched off in Supabase, so nobody else can make an account, and the database only lets each signed-in person reach their own row. The app's code is public; your progress isn't.
- Saving works as before: loaded once at start, saved one change at a time in order, live updates from other devices, and nothing is ever saved after a failed load.
- Phase 4's "Put The Climb on GitHub Pages" (already done) is now "Write a README for The Climb as a portfolio piece", with a link to GitHub's guide to READMEs. Its id (`climb-on-pages`) is unchanged. The GitHub Pages lesson before it no longer says you're about to use it.
- New messages for a paused Supabase project (with how to restore it) and for a device whose sign-in has run out (it asks you to sign in again).
- Progress → Your data shows who's signed in and has **Sign out on this device**. Signing out never signs out your other devices.
- Export and Import work as before. Export now always downloads the file (iPhone and iPad: Files → Downloads).
- `artifact.html` is gone. `index.html` is the one page, both online and as a local file. Opened as a file, it still saves in the browser only.
- The Supabase library is kept in the project (`vendor/supabase.js`, version 2.118.0), so the app doesn't depend on a third website to load.
- A GitHub job visits the Supabase project every three days so it doesn't pause while you're away.
- Added an icon for the iPhone and iPad Home Screen.
- The site asks search engines not to list it (a `noindex` tag), so only people with the link find it.
- The public GitHub repository has its own fresh history, made by `scripts/publish-public.sh`. It leaves out the files in `.publicignore` (the original spec) and is signed with your GitHub name and GitHub's no-reply email. The full history stays on this computer.
- Wording made less personal for the public repository: the light week is for "a lighter work week", the Finance side module is about "finance reporting basics", and the CHANGELOG says "the original spec".
- The Guide has a new section on the link and signing in, a corrected iPhone/iPad note, and what to do if the project is paused.

## 2026-10-22: Finance & SAP side module

- A side module under Data, *Finance & SAP Reporting Basics*, in its own file (`sidemodule-finance.js`). `curriculum.js` isn't touched, and Data's day count and 180 days don't change.
- 10 tasks, 6.5 hours, in three groups: Finance basics, Cube-based reporting, Practice. All links were checked on 2026-10-22.
- Today shows it as its own group under Data until it's finished; the Map keeps it at the bottom of Data's plan. Its time counts toward Data's hours.
- Portfolio has a separate "Side work" section with a Variance report card.
- Tasks can now carry extra links (`more`), shown under the task on Today.
- Choices made, since the request left them open:
  - Sources: CFI had no free page on cost centres or month-end close. Cost centres use SAP Learning's own lesson, with CFI's cost allocation page as the second link. Month-end close uses Xero's guide; NetSuite's and SAP's pages block automated checks, so they couldn't be verified.
  - The practice dataset is Microsoft's free IT Spend Analysis sample: an IT department's actual vs. plan, by IT area and cost element. Its data sits in Excel's Data Model, so it also continues task 9. Its terms ask that work made with it credits "obviEnce ©".
  - Tasks 9 and 10 say to use the Windows machine: Excel for Mac can't build or open a Data Model.
  - Task 8 (Analysis for Office) is about recognising the tool from SAP's lessons and screenshots. It can't be installed without an SAP system.
  - Finishing the module adds a skill line on Data's Progress, like a finished module does.

## 2026-10-20: Guide

- "? Guide" in the top bar opens a How to use page, the same as any other screen. It opens by itself once on each new device.
- Corrected from the request:
  - On Today you press Done, not a tick. Ticking is a Map feature.
  - Unticking isn't limited: the Map unticks anything. It doesn't remove logged time, and importing a backup can bring a tick back.
  - The bad-week minimum is a note, not a button.
  - The home-screen tip warns you may need to sign in to Claude again.

## 2026-10-20: Subject settings

- Removed the "Bringing your progress over?" card. There was no earlier progress to bring over, so Data and Spanish both start on 2026-10-20.
- Each subject's Progress screen has settings: change the start date (ticks are kept, and it asks first if any exist), and Start over (asks first, offers an export, keeps Data's Portfolio links, can be undone).

## 2026-10-20: Subjects (Spanish, German)

- Progress is stored per subject. Progress from before moves into Data the first time the new version opens, with nothing renamed or lost. Backups from before import into Data.
- Spanish (minor), in `spanish.js`. 39 weeks over three terms, with exams at the end of Terms 1 and 2. Agreed changes from the spec:
  - Language Transfer has 90 tracks but Term 1 has 65 weekdays, so tracks 66–90 finish in Term 2's first five weeks.
  - The Spanish streak counts weeks, like Data's.
  - Missing days never piles up: the next session is the next undone task.
  - Term 1's Saturday listening uses Dreaming Spanish Superbeginner videos. The spec only named Dreaming Spanish from Term 2, and the Superbeginner videos are made for complete beginners.
  - Term 3 is mostly Dreaming Spanish, plus a weekly conversation. It has no exam.
  - A "find a language partner" task sits in week 22, ahead of the Term 2 exam.
- Link change: dreamingspanish.com now redirects to dreaming.com/spanish, so that's the link used. All Spanish and German links were checked on 2026-10-20.
- German (elective), in `german.js`: DW's Nicos Weg. Locked until the Spanish Term 2 exam is done. Structure and one starter task only.
- The light week switch, the bad-week minimum note, and subject switches on Map and Progress.
- Subject colours: olive for Spanish and slate blue for German, beside Data's persimmon.
- If another device runs a newer version of The Climb, an older copy refuses to save over its progress and asks you to reload.

## 2026-10-20: Synced across devices

- Published as a Claude artifact. Progress is saved to the artifact's database, so it's shared by every device signed in to your account, and only you can read or write it.
- Progress loads once at start-up behind a "Loading your progress…" message. If it can't load, the app says so and changes nothing, so a failed load can never overwrite real progress.
- Saves happen one at a time, in order. Changes from your other devices appear live, but wait while you're typing so nothing you type is lost.
- Moving existing progress over is a one-time Export (old copy) → Import (new). The online version can't read the old copy's browser storage directly, because each website's storage is private to it.
- Export uses Claude's own save prompt (Claude's viewer blocks ordinary downloads). Portfolio's Open is now a real link for the same reason.
- Bigger tap targets on touch screens (menu, Map task links, "Show as a table"). The weekly chart no longer squeezes "This week" against the date before it on phones.
- The local file version (index.html) still saves to the browser, as before.

## 2026-10-15: First version

### Link substitutions

Every link in Section 5 of the original spec was checked on 15 October 2026. **None were dead**, but four had moved or no longer pointed at the right thing:

| Spec link | What had happened | Used instead |
|---|---|---|
| Mode SQL Tutorial: `https://mode.com/sql-tutorial/` | Mode was bought by ThoughtSpot, and the tutorial now lives on ThoughtSpot's site. The same Basic / Intermediate / Advanced sections are still there. | `https://www.thoughtspot.com/sql-tutorial`, with tasks linking to individual lessons on it |
| SQLBI Introducing DAX: `https://www.sqlbi.com/training/introducing-dax/` | Now redirects to a general DAX training page that mixes in paid courses. The free course has its own page (32 lectures, about 3 hours, still free). | `https://www.sqlbi.com/p/introducing-dax-video-course/` |
| GitHub Skills: `https://skills.github.com/` | Now just redirects to GitHub Learn. | `https://learn.github.com/skills`, and the individual courses at `https://github.com/skills/…` |
| Power BI Desktop: `https://powerbi.microsoft.com/desktop/` | Refuses automated checks, and Microsoft has moved its Power BI pages. | `https://www.microsoft.com/en-us/power-platform/products/power-bi/desktop` |

Also worth knowing:

- **dbt Learn** (`https://www.getdbt.com/dbt-learn`) still works, but the Fundamentals course itself is at `https://learn.getdbt.com/courses/dbt-fundamentals`, so tasks link straight there.
- **Kaggle** (Learn: Python, Learn: Pandas, Intro to SQL, Datasets) shows a "checking your browser" page to automated checkers, so these couldn't be machine-verified. They're long-standing pages, and the tasks link to the course pages.
- **Automate the Boring Stuff** now has a free 3rd edition online. Tasks use it (`https://automatetheboringstuff.com/3e/…`).
- A handful of links redirect to tidier addresses (Python for Data Analysis chapters, Microsoft's Power Query page, data.gov's catalogue). The final addresses are used.

All 91 links in `curriculum.js` returned a working page when checked.

### Changes from the original spec (agreed before building)

- **SQLBolt lesson ranges corrected.** The original spec listed lessons 1–6 then 6–9, overlapping on lesson 6. SQLBolt's SELECT/WHERE/ORDER BY lessons are 1–5 and its JOIN lessons are 6–7, so the first module uses 1–5 and the JOINs module uses 6–8 (adding the short lesson on NULLs).
- **Power Query in Excel** starts with Microsoft's Excel Power Query guide before the original spec's "Get data in Power BI" module, because that module is about Power BI, not Excel.
- **Automate the Boring Stuff:** instead of chapters 1–9 (which repeat the Python basics already covered on Kaggle), the automation module uses chapters 10, 11, 14, 15 and 18: files, organising files, Excel, Google Sheets, and CSV/JSON.
- **The dbt portfolio project runs locally** (dbt with DuckDB), so it doesn't depend on a cloud trial that expires. The dbt Fundamentals course itself still uses its own trial setup.
- **The SQL cheat sheet is built as you go,** a few patterns at the end of each module, rather than all at the end.
- **"Put The Climb on GitHub Pages"** is a task in Phase 4, so the app can be used on a phone.
- **The total is about 118 hours,** against the original spec's roughly 130. The estimates were kept realistic rather than padded, which leaves slack for irregular weeks.

### Changes to how the app behaves

- **"Day N of 180"** is the day of the task you're on, not days since you started, so it can't say you're behind.
- **Streaks count consecutive weeks** with at least one session. The original spec said "sessions, not calendar days" but didn't say what breaks a streak.
- **"Not today"** sets a task aside for today only; it's first again the next day.
- **Done** opens a small "how long did it take?" box, pre-filled with the estimate, with a note field. Enter saves.
- **The start date** is the day the app is first opened.
- **The Phase 1 extras** (HackerRank, W3Schools, Kaggle Intro to SQL, the freeCodeCamp video) are optional "extra practice", shown on the Map but not in the main path.
- **Import was added** next to Export, and it **merges** rather than replaces, for moving between the Mac and the Windows machine. Trade-off: a task unticked on one machine is re-ticked by importing a backup where it's ticked (explained in the README).
- **Per-module notes live on the Map,** which is the only place the original spec's `notes` field could be edited.
- **A "Log session" form on Progress** handles study time that didn't finish a task.
- **`store.js`** holds the data layer, one more file than the original spec's list, so it could be tested on its own.
