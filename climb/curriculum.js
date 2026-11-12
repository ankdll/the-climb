/*
  THE CLIMB — curriculum
  ======================

  This file is the plan. The app reads it; your progress is stored separately
  in the browser, so editing this file never wipes what you've done.

  Shape:
    phases  → the big stages. Phases 1–3 fill the 180 days; a phase that starts
              after day 180 (Phase 4) counts its own days: "Phase 4 · Day 3 of 27"
      modules → a block of days inside a phase (each one unlocks a "skill" line)
        tasks   → one sitting's worth of work. The Today screen shows these in order.

  Each phase also has a shortName (used on the mountain outline on the Map),
  a deliverableName (the title of its Portfolio card) and a linkHint (the
  example shown in that card's empty link box).

  Every task has:
    id                a unique name, lowercase-with-dashes. Never change an id once
                      you've completed that task — that's how the app remembers it's done.
    label             what you see on the card
    detail            one or two sentences: what it is and what to focus on
    estimatedMinutes  rough time; pre-fills the "how long did it take?" box
    url               the link the "Open" button goes to ("" for no link)
    type              interactive | video | reading | practice | build | setup
    optional          (optional) true = shown and tickable on the Map, but never on
                      Today, and not needed for its module or phase to be finished
    more              (optional) extra links shown under the task on Today

  Tasks run top to bottom. To reorder, move a whole { ... } block up or down.
  Day numbers: each module gets days in proportion to its hours, so after adding
  or removing tasks, ask Claude Code to re-spread them (the checks in
  tests/check-curriculum.js catch gaps and overlaps).
*/

const CURRICULUM = {
  totalDays: 180,

  phases: [
    // ───────────────────────────────────────────────────────────── PHASE 1
    {
      id: "sql",
      name: "SQL Foundations",
      shortName: "SQL",
      dayStart: 1,
      dayEnd: 79,
      estimatedHours: 55,
      why: "SQL is the most-requested skill in every analytics job post and pays back fastest per hour spent.",
      deliverable: "A SQLite database of FCC consumer complaints: your own schema, the data loaded and cleaned, and 10–15 business questions answered with CTEs and window functions. It's also your CS50 SQL final project.",
      deliverableName: "Telecom complaints database",
      linkHint: "https://github.com/your-name/telecom-complaints",
      modules: [
        {
          id: "sql-basics",
          name: "Done before the switch: SELECT, WHERE, ORDER BY",
          dayStart: 1,
          dayEnd: 10,
          skill: "Write SELECT queries that filter, sort and limit results",
          tasks: [
            {
              id: "sqlbolt-1",
              label: "SQLBolt lesson 1: SELECT queries 101",
              detail: "Your first queries — picking columns from a table. Think of it as choosing which columns of a sheet to look at.",
              estimatedMinutes: 30,
              url: "https://sqlbolt.com/lesson/select_queries_introduction",
              type: "interactive"
            },
            {
              id: "sqlbolt-2",
              label: "SQLBolt lesson 2: Queries with constraints (part 1)",
              detail: "WHERE with numbers — the SQL version of a filter on a column.",
              estimatedMinutes: 30,
              url: "https://sqlbolt.com/lesson/select_queries_with_constraints",
              type: "interactive"
            },
            {
              id: "sqlbolt-3",
              label: "SQLBolt lesson 3: Queries with constraints (part 2)",
              detail: "WHERE with text — exact matches and LIKE patterns, the equivalent of 'contains' and wildcards.",
              estimatedMinutes: 30,
              url: "https://sqlbolt.com/lesson/select_queries_with_constraints_pt_2",
              type: "interactive"
            },
            {
              id: "sqlbolt-4",
              label: "SQLBolt lesson 4: Filtering and sorting results",
              detail: "DISTINCT, ORDER BY and LIMIT — removing duplicates, sorting, and taking the top N.",
              estimatedMinutes: 40,
              url: "https://sqlbolt.com/lesson/filtering_sorting_query_results",
              type: "interactive"
            },
            {
              id: "sqlbolt-5",
              label: "SQLBolt review: Simple SELECT queries",
              detail: "A short review that mixes everything so far. If one stumps you, reread that lesson rather than peeking.",
              estimatedMinutes: 30,
              url: "https://sqlbolt.com/lesson/select_queries_review",
              type: "practice"
            },
            {
              id: "sqlzoo-select-basics",
              label: "SQLZoo: SELECT basics",
              detail: "Same ideas, a new dataset (world countries). Seeing it twice in different clothes is what makes it stick.",
              estimatedMinutes: 30,
              url: "https://sqlzoo.net/wiki/SELECT_basics",
              type: "practice"
            },
            {
              id: "sqlzoo-world",
              label: "SQLZoo: SELECT from WORLD",
              detail: "Thirteen questions that build on each other. Do as many as you can; the last few are meant to be stretching.",
              estimatedMinutes: 60,
              url: "https://sqlzoo.net/wiki/SELECT_from_WORLD_Tutorial",
              type: "practice"
            },
            {
              id: "sqlzoo-nobel",
              label: "SQLZoo: SELECT from Nobel",
              detail: "More filtering practice on Nobel prize winners — combining conditions with AND, OR and IN.",
              estimatedMinutes: 60,
              url: "https://sqlzoo.net/wiki/SELECT_from_Nobel_Tutorial",
              type: "practice"
            },
            {
              id: "pgex-basic",
              label: "PostgreSQL Exercises: Basic",
              detail: "A country club's booking database — closer to real business data. Work through the Basic section.",
              estimatedMinutes: 60,
              url: "https://pgexercises.com/questions/basic/",
              type: "practice"
            },
            {
              id: "cheatsheet-start",
              label: "Start your SQL cheat sheet",
              detail: "Create a file called sql-patterns.md. Write your first 4 patterns (select columns, filter, text match, top N) — each with a one-line description and a query you wrote yourself.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "cs50-querying",
          name: "CS50 SQL weeks 0–1: Querying and relating",
          dayStart: 11,
          dayEnd: 23,
          skill: "Query and relate tables in SQLite: subqueries, JOINs, grouping and many-to-many tables",
          tasks: [
            {
              id: "cs50-setup",
              label: "Set up CS50 SQL",
              detail: "Sign in to cs50.dev with your GitHub account. It's a free VS Code in the browser with SQLite ready, so there's nothing to install. An edX account only matters later, if you want the free certificate.",
              estimatedMinutes: 30,
              url: "https://cs50.dev/",
              type: "setup",
              more: [
                { label: "CS50 SQL course home", url: "https://cs50.harvard.edu/sql/" }
              ]
            },
            {
              id: "cs50-w0-lecture-1",
              label: "CS50 SQL week 0: Querying (lecture, first half)",
              detail: "Watch the first half of the lecture. Pause and type the queries yourself in your cs50.dev window as you go.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/0/",
              type: "video"
            },
            {
              id: "cs50-w0-lecture-2",
              label: "CS50 SQL week 0: Querying (lecture, second half)",
              detail: "Finish the lecture. Read the notes on the same page afterwards: they're the quickest way to look something up later.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/0/",
              type: "video"
            },
            {
              id: "cs50-pset-0a",
              label: "CS50 SQL problem set 0: Cyberchase and Normals",
              detail: "Week 0 repeats what you did on SQLBolt and SQLZoo, so this should move quickly. Use it to get used to SQLite and to submitting with check50 and submit50.",
              estimatedMinutes: 75,
              url: "https://cs50.harvard.edu/sql/psets/0/",
              type: "practice"
            },
            {
              id: "cs50-pset-0b",
              label: "CS50 SQL problem set 0: Players and Views",
              detail: "Finish problem set 0. Write each answer yourself before checking it.",
              estimatedMinutes: 75,
              url: "https://cs50.harvard.edu/sql/psets/0/",
              type: "practice"
            },
            {
              id: "cs50-w1-lecture-1",
              label: "CS50 SQL week 1: Relating (lecture, first half)",
              detail: "Watch the first half of the lecture. Pause and type the queries yourself in your cs50.dev window as you go.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/1/",
              type: "video"
            },
            {
              id: "cs50-w1-lecture-2",
              label: "CS50 SQL week 1: Relating (lecture, second half)",
              detail: "Finish the lecture. Read the notes on the same page afterwards: they're the quickest way to look something up later.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/1/",
              type: "video"
            },
            {
              id: "cs50-pset-1a",
              label: "CS50 SQL problem set 1: DESE and Packages",
              detail: "JOINs and subqueries across several tables. Draw the tables on paper first if the links between them aren't obvious.",
              estimatedMinutes: 75,
              url: "https://cs50.harvard.edu/sql/psets/1/",
              type: "practice"
            },
            {
              id: "cs50-pset-1b",
              label: "CS50 SQL problem set 1: Moneyball",
              detail: "The longest one in week 1. Moneyball's last questions are hard; leave them and come back after a break if you're stuck.",
              estimatedMinutes: 75,
              url: "https://cs50.harvard.edu/sql/psets/1/",
              type: "practice"
            }
          ]
        },
        {
          id: "cs50-designing",
          name: "CS50 SQL weeks 2–3: Designing and writing",
          dayStart: 24,
          dayEnd: 34,
          skill: "Design a database schema (tables, keys, constraints) and change data with INSERT, UPDATE and DELETE",
          tasks: [
            {
              id: "cs50-w2-lecture-1",
              label: "CS50 SQL week 2: Designing (lecture, first half)",
              detail: "Watch the first half of the lecture. Pause and type the queries yourself in your cs50.dev window as you go.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/2/",
              type: "video"
            },
            {
              id: "cs50-w2-lecture-2",
              label: "CS50 SQL week 2: Designing (lecture, second half)",
              detail: "Finish the lecture. Read the notes on the same page afterwards: they're the quickest way to look something up later.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/2/",
              type: "video"
            },
            {
              id: "cs50-pset-2a",
              label: "CS50 SQL problem set 2: ATL and Donuts",
              detail: "Your first schemas: you decide the tables, the columns and the keys. This is the skill your telecom project needs most.",
              estimatedMinutes: 75,
              url: "https://cs50.harvard.edu/sql/psets/2/",
              type: "practice"
            },
            {
              id: "cs50-pset-2b",
              label: "CS50 SQL problem set 2: Connect",
              detail: "Design a small professional-network database. Write down why you chose each table; it's practice for your project's design document.",
              estimatedMinutes: 60,
              url: "https://cs50.harvard.edu/sql/psets/2/",
              type: "practice"
            },
            {
              id: "cs50-w3-lecture-1",
              label: "CS50 SQL week 3: Writing (lecture, first half)",
              detail: "Watch the first half of the lecture. Pause and type the queries yourself in your cs50.dev window as you go.",
              estimatedMinutes: 45,
              url: "https://cs50.harvard.edu/sql/weeks/3/",
              type: "video"
            },
            {
              id: "cs50-w3-lecture-2",
              label: "CS50 SQL week 3: Writing (lecture, second half)",
              detail: "Finish the lecture. Read the notes on the same page afterwards: they're the quickest way to look something up later.",
              estimatedMinutes: 45,
              url: "https://cs50.harvard.edu/sql/weeks/3/",
              type: "video"
            },
            {
              id: "cs50-pset-3a",
              label: "CS50 SQL problem set 3: Don't Panic!",
              detail: "INSERT, UPDATE and DELETE on a database you're 'breaking into'. Short and fun.",
              estimatedMinutes: 45,
              url: "https://cs50.harvard.edu/sql/psets/3/",
              type: "practice"
            },
            {
              id: "cs50-pset-3b",
              label: "CS50 SQL problem set 3: Meteorites",
              detail: "Clean a messy CSV with SQL and load it into a table: the same job you'll do with the FCC data.",
              estimatedMinutes: 75,
              url: "https://cs50.harvard.edu/sql/psets/3/",
              type: "practice"
            }
          ]
        },
        {
          id: "cs50-scaling",
          name: "CS50 SQL weeks 4–6: Viewing, optimizing and scaling",
          dayStart: 35,
          dayEnd: 49,
          skill: "Build views and indexes, make slow queries fast, and explain how MySQL and PostgreSQL differ from SQLite",
          tasks: [
            {
              id: "cs50-w4-lecture-1",
              label: "CS50 SQL week 4: Viewing (lecture, first half)",
              detail: "Watch the first half of the lecture. Pause and type the queries yourself in your cs50.dev window as you go.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/4/",
              type: "video"
            },
            {
              id: "cs50-w4-lecture-2",
              label: "CS50 SQL week 4: Viewing (lecture, second half)",
              detail: "Finish the lecture. Read the notes on the same page afterwards: they're the quickest way to look something up later.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/4/",
              type: "video"
            },
            {
              id: "cs50-pset-4a",
              label: "CS50 SQL problem set 4: Census and BnB",
              detail: "Views: saved queries that behave like tables. Very close to how analysts give others a clean slice of data.",
              estimatedMinutes: 75,
              url: "https://cs50.harvard.edu/sql/psets/4/",
              type: "practice"
            },
            {
              id: "cs50-pset-4b",
              label: "CS50 SQL problem set 4: Private",
              detail: "A short puzzle built from a view.",
              estimatedMinutes: 45,
              url: "https://cs50.harvard.edu/sql/psets/4/",
              type: "practice"
            },
            {
              id: "cs50-w5-lecture-1",
              label: "CS50 SQL week 5: Optimizing (lecture, first half)",
              detail: "Watch the first half of the lecture. Pause and type the queries yourself in your cs50.dev window as you go.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/5/",
              type: "video"
            },
            {
              id: "cs50-w5-lecture-2",
              label: "CS50 SQL week 5: Optimizing (lecture, second half)",
              detail: "Finish the lecture. Read the notes on the same page afterwards: they're the quickest way to look something up later.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/5/",
              type: "video"
            },
            {
              id: "cs50-pset-5",
              label: "CS50 SQL problem set 5: Snap",
              detail: "Indexes and query plans: make queries fast without changing their answers.",
              estimatedMinutes: 75,
              url: "https://cs50.harvard.edu/sql/psets/5/",
              type: "practice"
            },
            {
              id: "cs50-w6-lecture-1",
              label: "CS50 SQL week 6: Scaling (lecture, first half)",
              detail: "Watch the first half of the lecture. Pause and type the queries yourself in your cs50.dev window as you go.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/6/",
              type: "video"
            },
            {
              id: "cs50-w6-lecture-2",
              label: "CS50 SQL week 6: Scaling (lecture, second half)",
              detail: "Finish the lecture. Read the notes on the same page afterwards: they're the quickest way to look something up later.",
              estimatedMinutes: 55,
              url: "https://cs50.harvard.edu/sql/weeks/6/",
              type: "video"
            },
            {
              id: "cs50-pset-6",
              label: "CS50 SQL problem set 6: Deep and Connect",
              detail: "A short written answer about splitting data across servers, then your week-2 Connect schema rebuilt in MySQL. That's the last problem set.",
              estimatedMinutes: 90,
              url: "https://cs50.harvard.edu/sql/psets/6/",
              type: "practice"
            }
          ]
        },
        {
          id: "sql-windows",
          name: "CTEs and window functions",
          dayStart: 50,
          dayEnd: 55,
          skill: "Write CTEs and window functions (ROW_NUMBER, RANK, LAG, running totals)",
          tasks: [
            {
              id: "dl-cte",
              label: "DataLemur: CTE vs. subquery",
              detail: "CTEs (WITH …) let you name each step of a query. CS50 only touches on them, and your telecom project uses them in most answers.",
              estimatedMinutes: 40,
              url: "https://datalemur.com/sql-tutorial/sql-cte-subquery",
              type: "reading"
            },
            {
              id: "ts-window",
              label: "SQL Tutorial (Advanced): Window functions",
              detail: "Running totals and rankings without collapsing rows: the bit GROUP BY can't do. SQLite supports all of these.",
              estimatedMinutes: 50,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-window-functions",
              type: "reading"
            },
            {
              id: "dl-window-aggregates",
              label: "DataLemur: Aggregate window functions",
              detail: "SUM() OVER and friends: running totals and share-of-total.",
              estimatedMinutes: 40,
              url: "https://datalemur.com/sql-tutorial/sql-aggregate-window-functions",
              type: "reading"
            },
            {
              id: "dl-window-ranking",
              label: "DataLemur: Ranking with window functions",
              detail: "ROW_NUMBER, RANK and DENSE_RANK, and the classic 'top 3 per category' question.",
              estimatedMinutes: 40,
              url: "https://datalemur.com/sql-tutorial/sql-rank-dense_rank-row_number-window-function",
              type: "reading"
            },
            {
              id: "dl-window-lag",
              label: "DataLemur: LEAD and LAG",
              detail: "Comparing a row with the one before it: month-on-month change.",
              estimatedMinutes: 40,
              url: "https://datalemur.com/sql-tutorial/sql-time-series-window-function-lead-lag",
              type: "reading"
            },
            {
              id: "dl-questions-1",
              label: "DataLemur: 3 interview questions",
              detail: "Filter the list to Easy and pick three, at least one using a window function. These are real interview questions from real companies.",
              estimatedMinutes: 45,
              url: "https://datalemur.com/questions?category=SQL",
              type: "practice"
            }
          ]
        },
        {
          id: "git",
          name: "Git and GitHub",
          dayStart: 56,
          dayEnd: 64,
          skill: "Version-control work with Git and share it on GitHub",
          tasks: [
            {
              id: "git-what",
              label: "Read: What is Git?",
              detail: "The short official explanation. Git is a save history for a folder: every version kept, any one recoverable. You need it now, because each portfolio project lives on GitHub.",
              estimatedMinutes: 20,
              url: "https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F",
              type: "reading"
            },
            {
              id: "lgb-intro",
              label: "Learn Git Branching: Introduction sequence",
              detail: "A visual game. Do the four Introduction levels: commits, branches, merging, rebasing.",
              estimatedMinutes: 45,
              url: "https://learngitbranching.js.org/?locale=en_US",
              type: "interactive"
            },
            {
              id: "lgb-ramp",
              label: "Learn Git Branching: Ramping up",
              detail: "Moving around history and undoing things. The undo levels are the ones you'll actually need.",
              estimatedMinutes: 45,
              url: "https://learngitbranching.js.org/?locale=en_US",
              type: "interactive"
            },
            {
              id: "lgb-remote",
              label: "Learn Git Branching: Remote (first levels)",
              detail: "Switch to the Remote tab. Push, pull and fetch: how your machine talks to GitHub.",
              estimatedMinutes: 45,
              url: "https://learngitbranching.js.org/?locale=en_US",
              type: "interactive"
            },
            {
              id: "git-install",
              label: "Install Git on your machine",
              detail: "On Windows, Git for Windows from the official site. On the Mac, type git in Terminal and it offers to install itself. You already have a GitHub account; check its name and photo are ones you'd put on a CV.",
              estimatedMinutes: 30,
              url: "https://git-scm.com/downloads",
              type: "setup"
            },
            {
              id: "gh-skills-intro",
              label: "GitHub Skills: Introduction to GitHub",
              detail: "A guided course that runs inside a real repository on your account. Follow the instructions in the README.",
              estimatedMinutes: 60,
              url: "https://github.com/skills/introduction-to-github",
              type: "interactive"
            },
            {
              id: "gh-skills-markdown",
              label: "GitHub Skills: Communicate using Markdown",
              detail: "How READMEs are written. Every portfolio project ends with one.",
              estimatedMinutes: 45,
              url: "https://github.com/skills/communicate-using-markdown",
              type: "interactive"
            },
            {
              id: "gh-skills-pr",
              label: "GitHub Skills: Review pull requests",
              detail: "How teams propose and check changes. Most analytics engineering teams work this way.",
              estimatedMinutes: 45,
              url: "https://github.com/skills/review-pull-requests",
              type: "interactive"
            }
          ]
        },
        {
          id: "telecom",
          name: "Portfolio project: Telecom complaints database",
          dayStart: 65,
          dayEnd: 79,
          skill: "Design, load and analyse a real database end to end in SQL, documented for others",
          tasks: [
            {
              id: "tel-plan",
              label: "Telecom complaints database: read the rules and plan",
              detail: "Ground rule for every portfolio project: you write the SQL, DAX and Python yourself. Claude only helps with the README layout. This is also your CS50 SQL final project, so read CS50's project page first: SQLite, and three files (DESIGN.md, schema.sql, queries.sql).",
              estimatedMinutes: 45,
              url: "https://cs50.harvard.edu/sql/project/",
              type: "reading"
            },
            {
              id: "tel-data",
              label: "Download the FCC complaints data and take a slice",
              detail: "The FCC's Consumer Complaints data holds every informal complaint since October 2014, so it's big. Export one or two years (the portal can filter before you download). List the columns and everything messy you notice. The FCC doesn't verify complaints; your README should say so.",
              estimatedMinutes: 60,
              url: "https://opendata.fcc.gov/d/3xyp-aqkj",
              type: "setup",
              more: [
                { label: "Direct CSV download (everything, large)", url: "https://opendata.fcc.gov/api/views/3xyp-aqkj/rows.csv?accessType=DOWNLOAD" }
              ]
            },
            {
              id: "tel-questions",
              label: "Write your 10–15 business questions",
              detail: "Questions a telecom manager would ask, e.g. which issues grew fastest year on year, or the top 3 issues in each state. Aim for at least half that need a CTE or a window function.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            },
            {
              id: "tel-schema",
              label: "Design the schema and draw the diagram",
              detail: "Split the flat file into tables (complaints, issues, locations, methods…) with keys and constraints. Draw the entity relationship diagram; CS50 wants it as an image in DESIGN.md. Start schema.sql with comments.",
              estimatedMinutes: 75,
              url: "https://dbdiagram.io/",
              type: "build"
            },
            {
              id: "tel-load",
              label: "Load the data into SQLite",
              detail: "Import the CSV into a staging table with .import, then INSERT … SELECT into your tables, cleaning as you go. Check row counts at every step.",
              estimatedMinutes: 75,
              url: "https://sqlite.org/cli.html",
              type: "build"
            },
            {
              id: "tel-optimize",
              label: "Add views and indexes",
              detail: "A view or two that people would query often, and indexes for your slowest questions. Time a query before and after. CS50 asks for these under 'optimizations'.",
              estimatedMinutes: 45,
              url: "https://www.sqlite.org/lang_createindex.html",
              type: "build"
            },
            {
              id: "tel-queries-1",
              label: "Answer your questions in SQL (part 1)",
              detail: "The first half of your questions, in queries.sql, each with a comment saying what it answers. Write every query yourself.",
              estimatedMinutes: 75,
              url: "https://www.sqlite.org/windowfunctions.html",
              type: "build"
            },
            {
              id: "tel-queries-2",
              label: "Answer your questions in SQL (part 2)",
              detail: "The rest. Note the 3 or 4 most interesting numbers: they become your README's key findings.",
              estimatedMinutes: 75,
              url: "https://www.sqlite.org/lang_with.html",
              type: "build"
            },
            {
              id: "tel-design",
              label: "Write DESIGN.md",
              detail: "CS50's design document, about 1,000 words: purpose, scope, entities, relationships, optimizations and limitations, with your diagram.",
              estimatedMinutes: 90,
              url: "https://cs50.harvard.edu/sql/project/",
              type: "build"
            },
            {
              id: "tel-publish",
              label: "Publish the project on GitHub",
              detail: "A new public repository. The full CSV is too big for GitHub (100 MB per file), so commit a small sample plus instructions for downloading the rest.",
              estimatedMinutes: 30,
              url: "https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories",
              type: "build"
            },
            {
              id: "tel-readme",
              label: "Write the README (Phase 1 deliverable)",
              detail: "In this order: the problem, the data, your approach, key findings with numbers, a screenshot, how to run it, and what you'd do next.",
              estimatedMinutes: 60,
              url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
              type: "build"
            },
            {
              id: "tel-video",
              label: "Optional: record the CS50 video",
              detail: "Only needed for CS50's free certificate. Up to 3 minutes. Open with the project title, your name, your GitHub and edX usernames, Manila as your city, and the date. Upload it to YouTube as Unlisted (not Private).",
              estimatedMinutes: 60,
              url: "https://cs50.harvard.edu/sql/project/",
              type: "build",
              optional: true
            },
            {
              id: "tel-submit",
              label: "Optional: submit to CS50 for the certificate",
              detail: "Needs all seven problem sets submitted too. Fill in CS50's project form, run submit50 from the folder with your three files, then claim the certificate at cs50.me/cs50sql. Deadline 30 June 2027.",
              estimatedMinutes: 30,
              url: "https://cs50.harvard.edu/sql/project/",
              type: "setup",
              optional: true
            }
          ]
        },

      ],
      extras: [
        {
          label: "HackerRank SQL",
          detail: "Hundreds of graded SQL problems, from easy to hard.",
          url: "https://www.hackerrank.com/domains/sql",
          type: "practice"
        },
        {
          label: "Kaggle Learn: Intro to SQL",
          detail: "A short course using Google BigQuery on real public datasets.",
          url: "https://www.kaggle.com/learn/intro-to-sql",
          type: "interactive"
        },
        {
          label: "W3Schools SQL",
          detail: "A quick reference when you've forgotten the exact syntax for something.",
          url: "https://www.w3schools.com/sql/",
          type: "reading"
        },
        {
          label: "freeCodeCamp: SQL full course (video)",
          detail: "A four-hour beginner course on YouTube. Good if you'd rather watch than read.",
          url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
          type: "video"
        }
      ]
    },

    // ───────────────────────────────────────────────────────────── PHASE 2
    {
      id: "powerbi",
      name: "Power BI, Power Query & DAX",
      shortName: "Power BI",
      dayStart: 80,
      dayEnd: 133,
      estimatedHours: 37,
      why: "Power BI is in most analyst job posts, and Power Query is the closest thing to what you already do every day.",
      deliverable: "A Power BI budget vs actual dashboard on Microsoft's AdventureWorks finance data: cleaned in Power Query, a star schema, and DAX for variance and year-to-date. On GitHub as a Power BI project with screenshots.",
      deliverableName: "Budget vs actual dashboard",
      linkHint: "https://github.com/your-name/budget-vs-actual",
      modules: [
        {
          id: "pq-excel",
          name: "Power Query inside Excel",
          dayStart: 80,
          dayEnd: 88,
          skill: "Clean and reshape data repeatably with Power Query",
          tasks: [
            {
              id: "pq-about",
              label: "Read: About Power Query in Excel",
              detail: "Microsoft's overview. The key idea: every cleaning step is recorded, so next month's file cleans itself.",
              estimatedMinutes: 30,
              url: "https://support.microsoft.com/en-us/excel/about-power-query-in-excel",
              type: "reading"
            },
            {
              id: "pq-own-file",
              label: "Clean a messy file you know, in Power Query",
              detail: "Take an export you normally clean by hand. Do the same cleanup in Power Query instead — Data → Get Data → From File. Notice which steps were easier and which were harder.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "pq-merge-append",
              label: "Merge and append queries",
              detail: "Combine two files: append (stack them) and merge (look one up in the other). This replaces VLOOKUP-and-copy-down.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "pq-unpivot",
              label: "Unpivot a wide table",
              detail: "Find (or make) a sheet with months as columns and unpivot it into rows. This one step is a big part of why Power BI models work.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            },
            {
              id: "pq-advanced-editor",
              label: "Read the code your steps wrote",
              detail: "Open Home → Advanced Editor on one of your queries. Don't edit anything — just match each line to a step you clicked. That language is called M.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            },
            {
              id: "pbi-install",
              label: "Install Power BI Desktop",
              detail: "Free from Microsoft (or the Microsoft Store). Open it once and close it — that's the whole task.",
              estimatedMinutes: 30,
              url: "https://www.microsoft.com/en-us/power-platform/products/power-bi/desktop",
              type: "setup"
            },
            {
              id: "ms-get-data",
              label: "Microsoft Learn: Get data in Power BI",
              detail: "The same Power Query you just used, now inside Power BI. Work through the module units.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/training/modules/get-data/",
              type: "interactive"
            },
            {
              id: "pq-in-pbi",
              label: "Load your messy file into Power BI",
              detail: "Repeat your Excel cleanup from earlier, this time in Power BI Desktop. It should feel familiar — that's the point.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "pbi-basics",
          name: "Power BI Desktop basics",
          dayStart: 89,
          dayEnd: 97,
          skill: "Load, shape and visualise data in Power BI Desktop",
          tasks: [
            {
              id: "ms-get-started",
              label: "Microsoft Learn: Get started with Microsoft data analytics",
              detail: "The first part of the PL-300 path — what a data analyst does in the Power BI world, and the vocabulary.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/training/paths/data-analytics-microsoft/",
              type: "interactive"
            },
            {
              id: "pbi-desktop-tour",
              label: "Read: Get started with Power BI Desktop",
              detail: "A guided tour you follow along with in Power BI open. Do the steps, don't just read them.",
              estimatedMinutes: 45,
              url: "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started",
              type: "reading"
            },
            {
              id: "ms-clean-data-1",
              label: "Microsoft Learn: Clean, transform and load data (first half)",
              detail: "Data types, renaming, and fixing inconsistent values — the stuff you know, in Power BI terms.",
              estimatedMinutes: 50,
              url: "https://learn.microsoft.com/en-us/training/modules/clean-data-power-bi/",
              type: "interactive"
            },
            {
              id: "ms-clean-data-2",
              label: "Microsoft Learn: Clean, transform and load data (second half)",
              detail: "Finish the module, including the exercise at the end.",
              estimatedMinutes: 50,
              url: "https://learn.microsoft.com/en-us/training/modules/clean-data-power-bi/",
              type: "interactive"
            },
            {
              id: "ms-effective-reports",
              label: "Microsoft Learn: Design effective reports (first module)",
              detail: "Choosing visuals and laying out a page. Do the first module of the path.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/training/paths/power-bi-effective/",
              type: "interactive"
            },
            {
              id: "pbi-first-report",
              label: "Build a one-page report from your cleaned file",
              detail: "Two or three visuals and a slicer. Ugly is fine — this is a sketch, not the deliverable.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "pick-dataset",
              label: "Choose a practice dataset for modelling",
              detail: "Browse Kaggle for a flat, messy table with dates, categories and amounts (sales, orders, bookings). It's for practising star schemas in the next module; your portfolio project uses a different dataset.",
              estimatedMinutes: 30,
              url: "https://www.kaggle.com/datasets?search=sales",
              type: "practice"
            }
          ]
        },
        {
          id: "pbi-modeling",
          name: "Data modeling — star schema",
          dayStart: 98,
          dayEnd: 107,
          skill: "Build a star schema in Power BI with fact and dimension tables",
          tasks: [
            {
              id: "star-schema-read",
              label: "Read: Understand star schema",
              detail: "Microsoft's guide. Facts are the events (each sale); dimensions describe them (who, what, when, where).",
              estimatedMinutes: 45,
              url: "https://learn.microsoft.com/en-us/power-bi/guidance/star-schema",
              type: "reading"
            },
            {
              id: "ms-model-1",
              label: "Microsoft Learn: Configure a semantic model (first half)",
              detail: "Relationships, cardinality and filter direction. This is the module the PL-300 exam leans on hardest.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/training/modules/configure-semantic-model-power-bi/",
              type: "interactive"
            },
            {
              id: "ms-model-2",
              label: "Microsoft Learn: Configure a semantic model (second half)",
              detail: "Finish the module and its exercise.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/training/modules/configure-semantic-model-power-bi/",
              type: "interactive"
            },
            {
              id: "date-table",
              label: "Read: Creating a simple date table",
              detail: "SQLBI's short article. Every model needs one; you'll add it to yours next.",
              estimatedMinutes: 40,
              url: "https://www.sqlbi.com/articles/creating-a-simple-date-table-in-dax/",
              type: "reading"
            },
            {
              id: "sketch-schema",
              label: "Sketch the star schema for your dataset",
              detail: "On paper. One fact table in the middle, the dimensions around it, and the key that links each one. Ten minutes of drawing saves an hour of rework.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            },
            {
              id: "model-build-1",
              label: "Split your flat table into fact and dimensions",
              detail: "In Power Query, reference your cleaned table to create each dimension, remove duplicates, and keep only keys and amounts in the fact.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "model-build-2",
              label: "Add relationships and a date table",
              detail: "Connect everything in Model view, one-to-many from each dimension to the fact. Add your date table and mark it as a date table.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "ms-optimize",
              label: "Microsoft Learn: Optimize semantic model performance",
              detail: "Why fewer columns and the right data types matter. Skim the parts that feel deep.",
              estimatedMinutes: 45,
              url: "https://learn.microsoft.com/en-us/training/modules/optimize-semantic-model-performance/",
              type: "interactive"
            },
            {
              id: "explain-schema",
              label: "Explain your model in one paragraph",
              detail: "Write it as if an interviewer just asked 'walk me through your data model'. Keep it — it goes in the report write-up.",
              estimatedMinutes: 20,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "dax",
          name: "DAX core",
          dayStart: 108,
          dayEnd: 118,
          skill: "Write DAX measures using CALCULATE, filter context and time intelligence",
          tasks: [
            {
              id: "sqlbi-dax-1",
              label: "SQLBI Introducing DAX: first hour of videos",
              detail: "Free course from the people who wrote the book on DAX. Measures vs calculated columns is the big idea here.",
              estimatedMinutes: 60,
              url: "https://www.sqlbi.com/p/introducing-dax-video-course/",
              type: "video"
            },
            {
              id: "sqlbi-dax-2",
              label: "SQLBI Introducing DAX: second hour",
              detail: "Iterators (SUMX and friends) and the start of filter context.",
              estimatedMinutes: 60,
              url: "https://www.sqlbi.com/p/introducing-dax-video-course/",
              type: "video"
            },
            {
              id: "sqlbi-dax-3",
              label: "SQLBI Introducing DAX: final hour",
              detail: "CALCULATE and time intelligence. Rewatch any lecture that didn't land — this is the hard part of DAX.",
              estimatedMinutes: 60,
              url: "https://www.sqlbi.com/p/introducing-dax-video-course/",
              type: "video"
            },
            {
              id: "ms-write-dax",
              label: "Microsoft Learn: Write DAX formulas",
              detail: "Syntax, data types and operators — a reference pass after the videos.",
              estimatedMinutes: 50,
              url: "https://learn.microsoft.com/en-us/training/modules/dax-power-bi-write-formulas/",
              type: "interactive"
            },
            {
              id: "ms-dax-measures",
              label: "Microsoft Learn: Use DAX in semantic models",
              detail: "Creating measures. Work through the first module in the path.",
              estimatedMinutes: 50,
              url: "https://learn.microsoft.com/en-us/training/paths/dax-power-bi/",
              type: "interactive"
            },
            {
              id: "dax-guide-calculate",
              label: "DAX Guide: CALCULATE and FILTER",
              detail: "Read both reference pages and their examples. Bookmark DAX Guide — you'll use it for years.",
              estimatedMinutes: 30,
              url: "https://dax.guide/calculate/",
              type: "reading"
            },
            {
              id: "ms-filter-context",
              label: "Microsoft Learn: Modify DAX filter context",
              detail: "CALCULATE in practice. If it feels slippery, that's normal — everyone finds this the hardest part.",
              estimatedMinutes: 50,
              url: "https://learn.microsoft.com/en-us/training/modules/dax-power-bi-modify-filter/",
              type: "interactive"
            },
            {
              id: "ms-time-intelligence",
              label: "Microsoft Learn: Use DAX time intelligence",
              detail: "Year-to-date, same period last year, and why your date table matters.",
              estimatedMinutes: 50,
              url: "https://learn.microsoft.com/en-us/training/modules/dax-power-bi-time-intelligence/",
              type: "interactive"
            },
            {
              id: "dax-own-measures",
              label: "Write 5 measures on your own model",
              detail: "Total amount, % of total, year-to-date, vs same period last year, and a safe ratio with DIVIDE. Check each against a number you can verify by hand.",
              estimatedMinutes: 60,
              url: "https://dax.guide/divide/",
              type: "build"
            }
          ]
        },
        {
          id: "bva",
          name: "Portfolio project: Budget vs actual dashboard",
          dayStart: 119,
          dayEnd: 133,
          skill: "Build a budget vs actual dashboard end to end: Power Query, star schema, variance and year-to-date DAX",
          tasks: [
            {
              id: "bva-plan",
              label: "Budget vs actual dashboard: plan it",
              detail: "Ground rule for every portfolio project: you write the SQL, DAX and Python yourself. Claude only helps with the README layout. Write the 3 or 4 questions the dashboard answers, e.g. which departments are over budget this year, and by how much.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            },
            {
              id: "bva-download",
              label: "Download the AdventureWorks finance files",
              detail: "Microsoft's free AdventureWorks sample: FactFinance (monthly Actual and Budget amounts, 2010–2013) plus DimScenario, DimAccount, DimOrganization, DimDepartmentGroup and DimDate. Use the Windows machine for this project.",
              estimatedMinutes: 30,
              url: "https://github.com/microsoft/sql-server-samples/tree/master/samples/databases/adventure-works/data-warehouse-install-script",
              type: "setup"
            },
            {
              id: "bva-clean-1",
              label: "Power Query: load and clean (part 1)",
              detail: "The files have no header row and use | as the separator. Load them, set the separator, and name the columns using instawdbdw.sql in the same folder.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "bva-clean-2",
              label: "Power Query: load and clean (part 2)",
              detail: "Set data types, keep the Actual and Budget scenarios, and rename every applied step so someone else could follow it.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "bva-model",
              label: "Build the star schema",
              detail: "FactFinance in the middle; account, organization, department, scenario and date around it. Mark the date table and check every relationship runs one-to-many.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/power-bi/guidance/star-schema",
              type: "build"
            },
            {
              id: "bva-variance",
              label: "DAX: actual, budget and variance",
              detail: "Measures for Actual, Budget, Variance and Variance % (with DIVIDE). Check revenue and expense accounts: over budget is good for one and bad for the other.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/dax/divide-function-dax",
              type: "build"
            },
            {
              id: "bva-ytd",
              label: "DAX: year to date",
              detail: "Year-to-date Actual, Budget and Variance with TOTALYTD. Check one month against a number you work out by hand.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/dax/totalytd-function-dax",
              type: "build"
            },
            {
              id: "bva-visuals-1",
              label: "Build the dashboard page",
              detail: "One page that answers your questions: variance by department, a month-by-month trend, and a year-to-date card. Give each visual a title that states the answer.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "bva-visuals-2",
              label: "Polish the page",
              detail: "Alignment, consistent colours, and nothing that doesn't answer a question. Revisit 'Design effective reports' if you're unsure.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/training/paths/power-bi-effective/",
              type: "build"
            },
            {
              id: "bva-publish",
              label: "Save as a Power BI project and put it on GitHub",
              detail: "File → Save as → Power BI project (.pbip). It saves the report as text files, so GitHub can show exactly which measure changed. Publish to web needs a work account, so the repository shows screenshots plus the project files.",
              estimatedMinutes: 45,
              url: "https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview",
              type: "build"
            },
            {
              id: "bva-readme",
              label: "Write the README (Phase 2 deliverable)",
              detail: "In this order: the problem, the data, your approach, key findings with numbers, a screenshot, how to run it, and what you'd do next.",
              estimatedMinutes: 60,
              url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
              type: "build"
            },
            {
              id: "report-rehearse",
              label: "Rehearse the 3-minute walkthrough",
              detail: "Talk through the dashboard out loud as if screen-sharing in an interview: problem, data, model, one insight. Record yourself once if you can bear it.",
              estimatedMinutes: 30,
              url: "",
              type: "practice"
            }
          ]
        }
      ],
      extras: [
        {
          label: "PL-300 certification page and free practice assessment",
          detail: "Worth sitting after this phase, and only if cash allows. The practice assessment is free.",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/",
          type: "reading"
        },
        {
          label: "DAX Guide",
          detail: "The reference for every DAX function, with examples.",
          url: "https://dax.guide/",
          type: "reading"
        }
      ]
    },

    // ───────────────────────────────────────────────────────────── PHASE 3
    {
      id: "python",
      name: "Python for Data",
      shortName: "Python",
      dayStart: 134,
      dayEnd: 180,
      estimatedHours: 32,
      why: "The goal isn't to become a software engineer — it's to read, modify and debug a data script, and write a straightforward one from scratch.",
      deliverable: "A Python pipeline that cleans fake, messy contact data: standardised, duplicates and problem rows flagged in helper columns (nothing deleted), loaded into SQLite, with a summary report.",
      deliverableName: "Mailing list cleaning pipeline",
      linkHint: "https://github.com/your-name/mailing-list-pipeline",
      modules: [
        {
          id: "py-basics",
          name: "Python basics",
          dayStart: 134,
          dayEnd: 143,
          skill: "Write Python with variables, loops, functions and file handling",
          tasks: [
            {
              id: "kaggle-py-1",
              label: "Kaggle Python, lesson 1: Hello, Python",
              detail: "Runs in your browser — nothing to install yet. Each lesson is a short tutorial followed by an exercise notebook.",
              estimatedMinutes: 45,
              url: "https://www.kaggle.com/learn/python",
              type: "interactive"
            },
            {
              id: "kaggle-py-2",
              label: "Kaggle Python, lesson 2: Functions and getting help",
              detail: "Functions are reusable steps — like a VBA Sub or Function.",
              estimatedMinutes: 50,
              url: "https://www.kaggle.com/learn/python",
              type: "interactive"
            },
            {
              id: "kaggle-py-3",
              label: "Kaggle Python, lesson 3: Booleans and conditionals",
              detail: "If / elif / else. You've written a hundred IF formulas; this is the same logic.",
              estimatedMinutes: 45,
              url: "https://www.kaggle.com/learn/python",
              type: "interactive"
            },
            {
              id: "kaggle-py-4",
              label: "Kaggle Python, lesson 4: Lists",
              detail: "Ordered collections — roughly a single column of values.",
              estimatedMinutes: 45,
              url: "https://www.kaggle.com/learn/python",
              type: "interactive"
            },
            {
              id: "kaggle-py-5",
              label: "Kaggle Python, lesson 5: Loops and list comprehensions",
              detail: "For loops, like For Each in VBA. List comprehensions are a compact version — read them, don't worry about writing them yet.",
              estimatedMinutes: 50,
              url: "https://www.kaggle.com/learn/python",
              type: "interactive"
            },
            {
              id: "kaggle-py-6",
              label: "Kaggle Python, lesson 6: Strings and dictionaries",
              detail: "Text handling, and dictionaries — lookups by key, like a two-column lookup table.",
              estimatedMinutes: 50,
              url: "https://www.kaggle.com/learn/python",
              type: "interactive"
            },
            {
              id: "kaggle-py-7",
              label: "Kaggle Python, lesson 7: Working with external libraries",
              detail: "How to use other people's code. Sets up pandas next.",
              estimatedMinutes: 45,
              url: "https://www.kaggle.com/learn/python",
              type: "interactive"
            },
            {
              id: "install-python",
              label: "Install Python and VS Code on your machine",
              detail: "Follow VS Code's Python guide. On Windows, tick 'Add python.exe to PATH' in the Python installer. Ask Claude Code to help if anything errors.",
              estimatedMinutes: 30,
              url: "https://code.visualstudio.com/docs/python/python-tutorial",
              type: "setup"
            },
            {
              id: "atbs-files",
              label: "Automate the Boring Stuff, ch. 10: Reading and writing files",
              detail: "Your first script that runs on your own machine and touches real files.",
              estimatedMinutes: 50,
              url: "https://automatetheboringstuff.com/3e/chapter10.html",
              type: "reading"
            }
          ]
        },
        {
          id: "pandas",
          name: "pandas",
          dayStart: 144,
          dayEnd: 153,
          skill: "Load, filter, group, merge and clean tabular data with pandas",
          tasks: [
            {
              id: "kaggle-pd-1",
              label: "Kaggle Pandas, lesson 1: Creating, reading and writing",
              detail: "A DataFrame is a sheet. This lesson is opening and saving one.",
              estimatedMinutes: 45,
              url: "https://www.kaggle.com/learn/pandas",
              type: "interactive"
            },
            {
              id: "kaggle-pd-2",
              label: "Kaggle Pandas, lesson 2: Indexing, selecting and assigning",
              detail: "Picking rows and columns — the pandas version of SELECT and WHERE.",
              estimatedMinutes: 50,
              url: "https://www.kaggle.com/learn/pandas",
              type: "interactive"
            },
            {
              id: "kaggle-pd-3",
              label: "Kaggle Pandas, lesson 3: Summary functions and maps",
              detail: "Describing a column and transforming every value in it.",
              estimatedMinutes: 45,
              url: "https://www.kaggle.com/learn/pandas",
              type: "interactive"
            },
            {
              id: "kaggle-pd-4",
              label: "Kaggle Pandas, lesson 4: Grouping and sorting",
              detail: "groupby is GROUP BY is a pivot table. You know this one three ways now.",
              estimatedMinutes: 45,
              url: "https://www.kaggle.com/learn/pandas",
              type: "interactive"
            },
            {
              id: "kaggle-pd-5",
              label: "Kaggle Pandas, lesson 5: Data types and missing values",
              detail: "Text that should be numbers, blanks that should be zero — familiar problems.",
              estimatedMinutes: 40,
              url: "https://www.kaggle.com/learn/pandas",
              type: "interactive"
            },
            {
              id: "kaggle-pd-6",
              label: "Kaggle Pandas, lesson 6: Renaming and combining",
              detail: "Joining DataFrames — your SQL JOINs again, in Python.",
              estimatedMinutes: 40,
              url: "https://www.kaggle.com/learn/pandas",
              type: "interactive"
            },
            {
              id: "wes-ch5",
              label: "Python for Data Analysis, ch. 5: Getting started with pandas",
              detail: "Written by the creator of pandas. Skim for a second explanation of anything that felt shaky on Kaggle.",
              estimatedMinutes: 50,
              url: "https://wesmckinney.com/book/pandas-basics",
              type: "reading"
            },
            {
              id: "pandas-pivot",
              label: "Rebuild a pivot table you know, in pandas",
              detail: "Pick a summary you regularly make in Excel. Recreate it with groupby on your machine and check the numbers match.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "pandas-merge",
              label: "Replace a VLOOKUP with a merge",
              detail: "Two files, one lookup. Then deliberately break a key and see what a left merge does with it.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "py-cleaning",
          name: "Cleaning and reshaping with pandas",
          dayStart: 154,
          dayEnd: 158,
          skill: "Load messy files, then clean, combine and reshape them with pandas",
          tasks: [
            {
              id: "wes-ch6",
              label: "Python for Data Analysis, ch. 6: Loading data",
              detail: "Reading CSV and Excel files with all their quirks — encodings, header rows, odd separators.",
              estimatedMinutes: 40,
              url: "https://wesmckinney.com/book/accessing-data",
              type: "reading"
            },
            {
              id: "wes-ch7",
              label: "Python for Data Analysis, ch. 7: Data cleaning and preparation",
              detail: "The most useful chapter for you. Missing data, duplicates, replacing values, string cleanup.",
              estimatedMinutes: 60,
              url: "https://wesmckinney.com/book/data-cleaning",
              type: "reading"
            },
            {
              id: "wes-ch8",
              label: "Python for Data Analysis, ch. 8: Join, combine and reshape",
              detail: "Merges and reshaping — pivot and melt (unpivot) in pandas.",
              estimatedMinutes: 60,
              url: "https://wesmckinney.com/book/data-wrangling",
              type: "reading"
            },
            {
              id: "wes-ch10",
              label: "Python for Data Analysis, ch. 10: Aggregation and group operations",
              detail: "groupby in depth. Read the first half; the rest is reference.",
              estimatedMinutes: 45,
              url: "https://wesmckinney.com/book/data-aggregation",
              type: "reading"
            }
          ]
        },
        {
          id: "py-automate",
          name: "Files, spreadsheets and CSV from Python",
          dayStart: 159,
          dayEnd: 163,
          skill: "Read and write files, Excel workbooks, Google Sheets and CSV/JSON from Python",
          tasks: [
            {
              id: "atbs-organize",
              label: "Automate the Boring Stuff, ch. 11: Organizing files",
              detail: "Finding, copying and renaming files with a script — the 'process every file in this folder' pattern.",
              estimatedMinutes: 45,
              url: "https://automatetheboringstuff.com/3e/chapter11.html",
              type: "reading"
            },
            {
              id: "atbs-excel",
              label: "Automate the Boring Stuff, ch. 14: Excel spreadsheets",
              detail: "Reading and writing .xlsx from Python. Compare it in your head with how you'd do it in VBA.",
              estimatedMinutes: 60,
              url: "https://automatetheboringstuff.com/3e/chapter14.html",
              type: "reading"
            },
            {
              id: "atbs-csv",
              label: "Automate the Boring Stuff, ch. 18: CSV, JSON and XML",
              detail: "The file formats most data actually arrives in.",
              estimatedMinutes: 45,
              url: "https://automatetheboringstuff.com/3e/chapter18.html",
              type: "reading"
            },
            {
              id: "atbs-sheets",
              label: "Automate the Boring Stuff, ch. 15: Google Sheets",
              detail: "Optional if time is short — but you know Apps Script, so this comparison is a good interview story.",
              estimatedMinutes: 45,
              url: "https://automatetheboringstuff.com/3e/chapter15.html",
              type: "reading"
            }
          ]
        },
        {
          id: "mailing",
          name: "Portfolio project: Mailing list cleaning pipeline",
          dayStart: 164,
          dayEnd: 176,
          skill: "Build a repeatable cleaning pipeline in Python: standardise, deduplicate, flag for review, load into SQLite and report",
          tasks: [
            {
              id: "mail-plan",
              label: "Mailing list pipeline: plan it",
              detail: "Ground rule for every portfolio project: you write the SQL, DAX and Python yourself. Claude only helps with the README layout. Write the steps in plain English: make the data, clean, standardise, find duplicates, flag rows for review, load into SQLite, write a summary. Two rules: fake data only, never client data; and never delete a row, flag it in a helper column instead.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            },
            {
              id: "mail-faker",
              label: "Make fake messy contact data with Faker",
              detail: "Install Faker and generate about 2,000 contacts. Then make them messy on purpose: mixed case, stray spaces, phone numbers in several formats, missing emails, the same person twice with small differences. Set a seed so you get the same file every run.",
              estimatedMinutes: 60,
              url: "https://faker.readthedocs.io/en/master/",
              type: "build"
            },
            {
              id: "mail-names-emails",
              label: "Clean and standardise names and emails",
              detail: "Trim, fix case, split or join name parts, lower-case emails. Put the cleaned value in a new column next to the original, so you can always see what changed.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "mail-phones-addresses",
              label: "Standardise phone numbers and addresses",
              detail: "One phone format, consistent address parts. Rows you can't fix get a reason in a helper column, not deleted.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "mail-dedupe",
              label: "Find duplicates and flag them",
              detail: "Exact duplicates first, then near-duplicates on cleaned name plus email or phone. Helper columns like duplicate_group and keep_this_row; every row stays.",
              estimatedMinutes: 60,
              url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html",
              type: "build"
            },
            {
              id: "mail-review",
              label: "Flag rows for review",
              detail: "A needs_review column and a review_reason column: bad email, no way to contact, a possible duplicate you weren't sure about. Count each reason.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            },
            {
              id: "mail-sqlite",
              label: "Load the result into SQLite",
              detail: "Write the cleaned table to a SQLite database with pandas, then query it with the SQL you know to check the counts match.",
              estimatedMinutes: 45,
              url: "https://docs.python.org/3/library/sqlite3.html",
              type: "build"
            },
            {
              id: "mail-report",
              label: "Write the summary report",
              detail: "The script writes a short report file: rows in, rows cleaned, duplicates found, rows needing review by reason. These numbers become your README's key findings.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "mail-run",
              label: "Make it run in one command",
              detail: "From fake data to report with one command and no editing of the code. Delete the outputs and run it again to prove it.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            },
            {
              id: "mail-publish",
              label: "Publish the project on GitHub",
              detail: "Push the code, a small sample of the fake input, and the report. Fake data only.",
              estimatedMinutes: 30,
              url: "https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories",
              type: "build"
            },
            {
              id: "mail-readme",
              label: "Write the README (Phase 3 deliverable)",
              detail: "In this order: the problem, the data, your approach, key findings with numbers, a screenshot, how to run it, and what you'd do next.",
              estimatedMinutes: 60,
              url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
              type: "build"
            }
          ]
        },
        {
          id: "career",
          name: "Portfolio review and CV",
          dayStart: 177,
          dayEnd: 180,
          skill: "Present technical work clearly in a public portfolio",
          tasks: [
            {
              id: "climb-on-pages",
              label: "Write a README for The Climb as a portfolio piece",
              detail: "The Climb already runs on GitHub Pages, with your progress synced through Supabase on every device. Write the README an employer would read: what it does, how it's built (static site, Supabase sign-in, a database that only lets you reach your own row), and a screenshot.",
              estimatedMinutes: 60,
              url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
              type: "build"
            },
            {
              id: "portfolio-review",
              label: "Review everything as a hiring manager would",
              detail: "Open your GitHub profile and your site in a private window. Five minutes per project: is it clear what it is and why it's good? Fix what isn't.",
              estimatedMinutes: 45,
              url: "",
              type: "practice"
            },
            {
              id: "update-cv",
              label: "Update your CV",
              detail: "Add your GitHub and site links, and pull lines from the Skills list on the Progress screen. You've earned every one of them.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            }
          ]
        }
      ]
    },

    // ───────────────────────────────────────────────────────────── PHASE 4
    // After day 180. The app counts its days on their own: "Phase 4 · Day 3 of 27".
    {
      id: "de",
      name: "Data Engineering",
      shortName: "Data eng.",
      dayStart: 181,
      dayEnd: 207,
      estimatedHours: 20,
      why: "Analytics engineers work on the pipelines too: warehouses, Docker, scheduling and dbt. All on the Mac.",
      deliverable: "A dbt layer on your telecom database: sources, staging and mart models with tests and docs, run locally with DuckDB.",
      deliverableName: "dbt layer on the telecom database",
      linkHint: "https://github.com/your-name/telecom-dbt",
      modules: [
        {
          id: "de-setup",
          name: "Set up the course on the Mac",
          dayStart: 181,
          dayEnd: 182,
          skill: "Run a data engineering stack on your own machine with Docker",
          tasks: [
            {
              id: "de-start",
              label: "Data Engineering 101: start here",
              detail: "Start Data Engineering's free course is Phase 4's main course. You'll skip its SQL and Python chapters (Phases 1 and 3 covered them) and its Kimball chapter (Phase 2 covered star schemas). Phase 4 is all on the Mac.",
              estimatedMinutes: 30,
              url: "https://courses.startdataengineering.com/learn/de101/index.html",
              type: "reading"
            },
            {
              id: "de-docker-setup",
              label: "Install Docker and start the course's code",
              detail: "On the Mac: install Docker Desktop, fork and clone the course's code repository, then run docker compose up -d and open Jupyter at localhost:8888. Expect a few hiccups; that's normal the first time.",
              estimatedMinutes: 60,
              url: "https://github.com/josephmachado/data_engineering_for_beginners_code",
              type: "setup",
              more: [
                { label: "Docker Desktop for Mac", url: "https://docs.docker.com/desktop/setup/install/mac-install/" }
              ]
            },
            {
              id: "de-hours-check",
              label: "Check whether Phase 4's hour estimates still hold",
              detail: "The Phase 4 hours were estimates made before you started. Compare the time you logged on the start-here and Docker set-up tasks (Progress → Session log) with their estimates. If setup took much longer, ask Claude Code to re-spread Phase 4's days.",
              estimatedMinutes: 15,
              url: "",
              type: "practice"
            }
          ]
        },
        {
          id: "de-warehouse",
          name: "Data warehouses and the multi-hop design",
          dayStart: 183,
          dayEnd: 186,
          skill: "Explain how a data warehouse and the multi-hop layers (raw, cleaned, business-ready) organise data",
          tasks: [
            {
              id: "de-dw",
              label: "Data Engineering 101: data warehouses",
              detail: "What a warehouse is for: history, and analysing how the business performs. Do the exercises in the notebooks.",
              estimatedMinutes: 60,
              url: "https://courses.startdataengineering.com/learn/de101/dw.html",
              type: "reading"
            },
            {
              id: "de-multihop",
              label: "Data Engineering 101: the multi-hop architecture",
              detail: "Raw data in, then cleaned, then business-ready: the layers most companies use.",
              estimatedMinutes: 45,
              url: "https://courses.startdataengineering.com/learn/de101/dw_data_flow.html",
              type: "reading"
            },
            {
              id: "de-multihop-telecom",
              label: "Sketch your telecom database as layers",
              detail: "On paper: which of your telecom tables would be raw, which cleaned, which business-ready? This sketch becomes your dbt project.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "de-docker",
          name: "Docker",
          dayStart: 187,
          dayEnd: 189,
          skill: "Package and run code the same way on any machine with Docker",
          tasks: [
            {
              id: "de-docker-1",
              label: "Data Engineering 101: Docker (part 1)",
              detail: "Images, containers and why 'it works on my machine' stops being a problem.",
              estimatedMinutes: 60,
              url: "https://courses.startdataengineering.com/learn/de101/docker.html",
              type: "reading"
            },
            {
              id: "de-docker-2",
              label: "Data Engineering 101: Docker (part 2)",
              detail: "Docker Compose: several services started together, the way the course's own setup works. Do the exercises.",
              estimatedMinutes: 60,
              url: "https://courses.startdataengineering.com/learn/de101/docker.html",
              type: "practice"
            }
          ]
        },
        {
          id: "de-engines",
          name: "Spark and DuckDB",
          dayStart: 190,
          dayEnd: 192,
          skill: "Process data with Spark and DuckDB from Python",
          tasks: [
            {
              id: "de-engines-1",
              label: "Data Engineering 101: processing engines (part 1)",
              detail: "Python telling Spark, DuckDB and Polars what to do. Read it and run the examples.",
              estimatedMinutes: 60,
              url: "https://courses.startdataengineering.com/learn/de101/py_transform.html",
              type: "reading"
            },
            {
              id: "de-engines-2",
              label: "Data Engineering 101: processing engines (part 2)",
              detail: "The exercises. Notice how close Spark SQL is to the SQL you already write.",
              estimatedMinutes: 60,
              url: "https://courses.startdataengineering.com/learn/de101/py_transform.html",
              type: "practice"
            },
            {
              id: "de-duckdb-telecom",
              label: "Query your telecom database with DuckDB",
              detail: "DuckDB can open a SQLite file directly. Run two of your telecom questions through it and compare the answers.",
              estimatedMinutes: 30,
              url: "https://duckdb.org/docs/stable/core_extensions/sqlite",
              type: "practice"
            }
          ]
        },
        {
          id: "de-airflow",
          name: "Scheduling with Airflow",
          dayStart: 193,
          dayEnd: 196,
          skill: "Schedule and orchestrate a pipeline with Airflow",
          tasks: [
            {
              id: "de-pipelines",
              label: "Data Engineering 101: schedulers and orchestrators",
              detail: "When a pipeline runs, and in what order its steps run.",
              estimatedMinutes: 30,
              url: "https://courses.startdataengineering.com/learn/de101/data_pipeline.html",
              type: "reading"
            },
            {
              id: "de-airflow-1",
              label: "Data Engineering 101: Airflow (part 1)",
              detail: "DAGs, tasks and the Airflow screen at localhost:8080.",
              estimatedMinutes: 60,
              url: "https://courses.startdataengineering.com/learn/de101/airflow.html",
              type: "reading"
            },
            {
              id: "de-airflow-2",
              label: "Data Engineering 101: Airflow (part 2)",
              detail: "Run the course's pipeline and do the exercises.",
              estimatedMinutes: 60,
              url: "https://courses.startdataengineering.com/learn/de101/airflow.html",
              type: "practice"
            },
            {
              id: "de-airflow-own",
              label: "Write a small DAG of your own",
              detail: "Two or three steps, e.g. run your mailing list pipeline and then a check on its report. Write it yourself.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "dbt-telecom",
          name: "Portfolio project: dbt layer on the telecom database",
          dayStart: 197,
          dayEnd: 207,
          skill: "Build tested, documented dbt models on your own data",
          tasks: [
            {
              id: "dbt-plan",
              label: "dbt layer on the telecom database: plan it",
              detail: "Ground rule for every portfolio project: you write the SQL, DAX and Python yourself. Claude only helps with the README layout. Using your layer sketch, list the staging models (one per source table) and two or three mart models that answer your best business questions.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            },
            {
              id: "de-dbt-1",
              label: "Data Engineering 101: dbt (part 1)",
              detail: "Models, sources and how dbt runs them in the right order.",
              estimatedMinutes: 60,
              url: "https://courses.startdataengineering.com/learn/de101/dbt.html",
              type: "reading"
            },
            {
              id: "de-dbt-2",
              label: "Data Engineering 101: dbt (part 2)",
              detail: "Tests, docs and the exercises.",
              estimatedMinutes: 60,
              url: "https://courses.startdataengineering.com/learn/de101/dbt.html",
              type: "practice"
            },
            {
              id: "dbt-setup",
              label: "Set up dbt with DuckDB on the Mac",
              detail: "Install dbt-core and dbt-duckdb, start a new dbt project, and point it at your telecom SQLite file through DuckDB. Free, and nothing expires.",
              estimatedMinutes: 45,
              url: "https://docs.getdbt.com/docs/local/connect-data-platform/duckdb-setup",
              type: "setup",
              more: [
                { label: "DuckDB: reading SQLite files", url: "https://duckdb.org/docs/stable/core_extensions/sqlite" }
              ]
            },
            {
              id: "dbt-staging",
              label: "Sources and staging models",
              detail: "Declare your tables as sources, then one staging model each: renamed columns, cleaned types.",
              estimatedMinutes: 60,
              url: "https://docs.getdbt.com/docs/build/sources",
              type: "build"
            },
            {
              id: "dbt-marts",
              label: "Mart models",
              detail: "Two or three business-ready models that answer your best questions, built on the staging models.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "dbt-tests",
              label: "Tests and docs",
              detail: "Tests for keys (unique, not null) and relationships, then dbt docs generate. Take a screenshot of the lineage graph for your README.",
              estimatedMinutes: 60,
              url: "https://docs.getdbt.com/docs/build/data-tests",
              type: "build",
              more: [
                { label: "dbt docs commands", url: "https://docs.getdbt.com/reference/commands/cmd-docs" }
              ]
            },
            {
              id: "dbt-publish",
              label: "Publish the dbt project on GitHub",
              detail: "Its own repository, or a dbt folder in the telecom repository, linked from the telecom README.",
              estimatedMinutes: 30,
              url: "https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories",
              type: "build"
            },
            {
              id: "dbt-readme",
              label: "Write the README (Phase 4 deliverable)",
              detail: "In this order: the problem, the data, your approach, key findings with numbers, a screenshot, how to run it, and what you'd do next.",
              estimatedMinutes: 60,
              url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
              type: "build"
            }
          ]
        }
      ]
    }
  ]
};
