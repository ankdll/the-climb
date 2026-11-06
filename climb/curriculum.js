/*
  THE CLIMB — curriculum
  ======================

  This file is the plan. The app reads it; your progress is stored separately
  in the browser, so editing this file never wipes what you've done.

  Shape:
    phases  → the four big stages
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

  Tasks run top to bottom. To reorder, move a whole { ... } block up or down.
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
      dayEnd: 42,
      estimatedHours: 30,
      why: "SQL is the most-requested skill in every analytics job post and pays back fastest per hour spent.",
      deliverable: "Your own SQL cheat sheet: the 20 query patterns you'll actually reuse, each with a worked example, saved as a markdown file.",
      deliverableName: "SQL pattern library",
      linkHint: "https://github.com/your-name/sql-patterns",
      modules: [
        {
          id: "sql-basics",
          name: "SELECT, WHERE, ORDER BY, LIMIT",
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
          id: "sql-joins",
          name: "JOINs — INNER, LEFT, multi-table",
          dayStart: 11,
          dayEnd: 18,
          skill: "Write multi-table JOINs (INNER and LEFT) to combine related data",
          tasks: [
            {
              id: "sqlbolt-6",
              label: "SQLBolt lesson 6: Multi-table queries with JOINs",
              detail: "INNER JOIN — like a VLOOKUP that only keeps rows where a match exists on both sides.",
              estimatedMinutes: 40,
              url: "https://sqlbolt.com/lesson/select_queries_with_joins",
              type: "interactive"
            },
            {
              id: "sqlbolt-7",
              label: "SQLBolt lesson 7: OUTER JOINs",
              detail: "LEFT JOIN keeps every row from the first table even when there's no match — the VLOOKUP that returns #N/A instead of dropping the row.",
              estimatedMinutes: 40,
              url: "https://sqlbolt.com/lesson/select_queries_with_outer_joins",
              type: "interactive"
            },
            {
              id: "sqlbolt-8",
              label: "SQLBolt lesson 8: A short note on NULLs",
              detail: "What 'empty' means in SQL, and why it trips up filters after a LEFT JOIN.",
              estimatedMinutes: 25,
              url: "https://sqlbolt.com/lesson/select_queries_with_nulls",
              type: "interactive"
            },
            {
              id: "sqlzoo-join",
              label: "SQLZoo: The JOIN operation",
              detail: "Football match data across two tables. The core JOIN tutorial from the plan.",
              estimatedMinutes: 60,
              url: "https://sqlzoo.net/wiki/The_JOIN_operation",
              type: "practice"
            },
            {
              id: "sqlzoo-more-join",
              label: "SQLZoo: More JOIN operations",
              detail: "Three tables at once (movies, actors, casting). This is where joins start to feel like real work.",
              estimatedMinutes: 60,
              url: "https://sqlzoo.net/wiki/More_JOIN_operations",
              type: "practice"
            },
            {
              id: "sqlzoo-null",
              label: "SQLZoo: Using NULL",
              detail: "LEFT and RIGHT joins in practice, plus COALESCE — SQL's IFERROR/IFBLANK.",
              estimatedMinutes: 45,
              url: "https://sqlzoo.net/wiki/Using_Null",
              type: "practice"
            },
            {
              id: "pgex-joins",
              label: "PostgreSQL Exercises: Joins and subqueries",
              detail: "Back to the country club. Do the join questions; leave any that use subqueries for later if they lose you.",
              estimatedMinutes: 60,
              url: "https://pgexercises.com/questions/joins/",
              type: "practice"
            },
            {
              id: "cheatsheet-joins",
              label: "Add JOIN patterns to your cheat sheet",
              detail: "Add 3 patterns: inner join, left join, and 'find rows with no match' (LEFT JOIN … WHERE key IS NULL). That last one is a reconciliation classic.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "sql-aggregates",
          name: "GROUP BY, aggregates and HAVING",
          dayStart: 19,
          dayEnd: 26,
          skill: "Summarise data with GROUP BY, aggregate functions and HAVING",
          tasks: [
            {
              id: "sqlbolt-9",
              label: "SQLBolt lesson 9: Queries with expressions",
              detail: "Calculated columns and aliases — the SQL version of adding a formula column.",
              estimatedMinutes: 30,
              url: "https://sqlbolt.com/lesson/select_queries_with_expressions",
              type: "interactive"
            },
            {
              id: "sqlbolt-10-11",
              label: "SQLBolt lessons 10–11: Queries with aggregates",
              detail: "COUNT, SUM, AVG and GROUP BY — a pivot table written as a sentence. Lesson 11 adds HAVING.",
              estimatedMinutes: 45,
              url: "https://sqlbolt.com/lesson/select_queries_with_aggregates",
              type: "interactive"
            },
            {
              id: "ts-aggregates",
              label: "SQL Tutorial (Intermediate): Aggregate functions",
              detail: "The intermediate section of the Mode/ThoughtSpot tutorial. Read the aggregates overview, then COUNT, SUM, MIN/MAX and AVG from the sidebar.",
              estimatedMinutes: 50,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-aggregate-functions",
              type: "reading"
            },
            {
              id: "ts-group-by",
              label: "SQL Tutorial (Intermediate): GROUP BY",
              detail: "Grouping by one and several columns, on real Apple stock price data.",
              estimatedMinutes: 40,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-group-by",
              type: "reading"
            },
            {
              id: "ts-having",
              label: "SQL Tutorial (Intermediate): HAVING",
              detail: "Filtering after grouping — 'only show months where total sales > X'. WHERE filters rows, HAVING filters groups.",
              estimatedMinutes: 30,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-having",
              type: "reading"
            },
            {
              id: "ts-case",
              label: "SQL Tutorial (Intermediate): CASE",
              detail: "SQL's IF/IFS. Pay attention to the part about CASE inside aggregates — it's how you build a pivot-style summary.",
              estimatedMinutes: 40,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-case",
              type: "reading"
            },
            {
              id: "ts-distinct",
              label: "SQL Tutorial (Intermediate): DISTINCT",
              detail: "Counting unique values — COUNT(DISTINCT …) is one you'll use constantly.",
              estimatedMinutes: 25,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-distinct",
              type: "reading"
            },
            {
              id: "sqlzoo-sum-count",
              label: "SQLZoo: SUM and COUNT",
              detail: "Practice set for everything in this module.",
              estimatedMinutes: 45,
              url: "https://sqlzoo.net/wiki/SUM_and_COUNT",
              type: "practice"
            },
            {
              id: "pgex-aggregates",
              label: "PostgreSQL Exercises: Aggregation",
              detail: "Do the first 10 or so. Later ones use window functions — you'll come back to those on day 35.",
              estimatedMinutes: 45,
              url: "https://pgexercises.com/questions/aggregates/",
              type: "practice"
            },
            {
              id: "cheatsheet-aggregates",
              label: "Add grouping patterns to your cheat sheet",
              detail: "Add 4 patterns: group and count, group and sum, HAVING filter, and CASE inside SUM for a pivot-style summary.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "sql-ctes",
          name: "Subqueries and CTEs",
          dayStart: 27,
          dayEnd: 34,
          skill: "Break complex questions into readable steps with subqueries and CTEs",
          tasks: [
            {
              id: "sqlbolt-12",
              label: "SQLBolt lesson 12: Order of execution",
              detail: "The order SQL actually runs a query in. Short, but it explains most 'why doesn't this work?' moments.",
              estimatedMinutes: 25,
              url: "https://sqlbolt.com/lesson/select_queries_order_of_execution",
              type: "interactive"
            },
            {
              id: "ts-subquery",
              label: "SQL Tutorial (Advanced): Writing subqueries",
              detail: "A query inside a query. Like using a helper column, then referring to it.",
              estimatedMinutes: 50,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-subquery",
              type: "reading"
            },
            {
              id: "sqlzoo-select-within",
              label: "SQLZoo: SELECT within SELECT",
              detail: "Subquery practice. Questions 5 onward are tough — it's fine to take two sittings.",
              estimatedMinutes: 60,
              url: "https://sqlzoo.net/wiki/SELECT_within_SELECT_Tutorial",
              type: "practice"
            },
            {
              id: "ts-union",
              label: "SQL Tutorial (Intermediate): UNION",
              detail: "Stacking two result sets on top of each other — appending sheets.",
              estimatedMinutes: 30,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-union",
              type: "reading"
            },
            {
              id: "dl-cte",
              label: "DataLemur: CTE vs. subquery",
              detail: "CTEs (WITH …) let you name each step of a query. This is the style analytics engineers write in every day.",
              estimatedMinutes: 40,
              url: "https://datalemur.com/sql-tutorial/sql-cte-subquery",
              type: "reading"
            },
            {
              id: "pg-docs-with",
              label: "PostgreSQL docs: WITH queries (first section only)",
              detail: "Skim section 7.8.1 for a second explanation of CTEs. Stop before 'recursive' — not needed yet.",
              estimatedMinutes: 25,
              url: "https://www.postgresql.org/docs/current/queries-with.html",
              type: "reading"
            },
            {
              id: "ts-pivot",
              label: "SQL Tutorial (Advanced): Pivoting data",
              detail: "Rows to columns and back — the SQL version of something you've done in Excel a thousand times.",
              estimatedMinutes: 40,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-pivot-table",
              type: "reading"
            },
            {
              id: "pgex-date",
              label: "PostgreSQL Exercises: Working with timestamps",
              detail: "Dates in SQL. Try rewriting one answer as a CTE once you've solved it.",
              estimatedMinutes: 45,
              url: "https://pgexercises.com/questions/date/",
              type: "practice"
            },
            {
              id: "cheatsheet-ctes",
              label: "Add subquery and CTE patterns to your cheat sheet",
              detail: "Add 4 patterns: filter by a subquery, a multi-step CTE, UNION, and a pivot with CASE. Rewrite one of your earlier patterns as a CTE.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "sql-practice",
          name: "Practice and window functions",
          dayStart: 35,
          dayEnd: 42,
          skill: "Rank and compare rows over time with window functions (ROW_NUMBER, RANK, LAG)",
          tasks: [
            {
              id: "ts-window",
              label: "SQL Tutorial (Advanced): Window functions",
              detail: "Running totals and rankings without collapsing rows — the bit GROUP BY can't do.",
              estimatedMinutes: 50,
              url: "https://www.thoughtspot.com/sql-tutorial/sql-window-functions",
              type: "reading"
            },
            {
              id: "dl-window-aggregates",
              label: "DataLemur: Aggregate window functions",
              detail: "SUM() OVER and friends — running totals and share-of-total.",
              estimatedMinutes: 40,
              url: "https://datalemur.com/sql-tutorial/sql-aggregate-window-functions",
              type: "reading"
            },
            {
              id: "dl-window-ranking",
              label: "DataLemur: Ranking with window functions",
              detail: "ROW_NUMBER, RANK and DENSE_RANK — and the classic 'top 3 per category' question.",
              estimatedMinutes: 40,
              url: "https://datalemur.com/sql-tutorial/sql-rank-dense_rank-row_number-window-function",
              type: "reading"
            },
            {
              id: "dl-window-lag",
              label: "DataLemur: LEAD and LAG",
              detail: "Comparing a row with the one before it — month-on-month change.",
              estimatedMinutes: 40,
              url: "https://datalemur.com/sql-tutorial/sql-time-series-window-function-lead-lag",
              type: "reading"
            },
            {
              id: "dl-questions-1",
              label: "DataLemur: 3 easy interview questions",
              detail: "Filter the question list to Easy and pick any three. These are real interview questions from real companies.",
              estimatedMinutes: 45,
              url: "https://datalemur.com/questions?category=SQL",
              type: "practice"
            },
            {
              id: "dl-questions-2",
              label: "DataLemur: 3 more, one of them Medium",
              detail: "Two Easy and one Medium. If the Medium beats you, read the solution and write down the pattern it used.",
              estimatedMinutes: 45,
              url: "https://datalemur.com/questions?category=SQL",
              type: "practice"
            },
            {
              id: "cheatsheet-finish",
              label: "Finish your SQL cheat sheet (Phase 1 deliverable)",
              detail: "Add window function patterns (running total, top N per group, change vs previous row) to reach 20. Read it top to bottom and fix anything you wouldn't understand in six months.",
              estimatedMinutes: 90,
              url: "",
              type: "build"
            }
          ]
        }
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
      dayStart: 43,
      dayEnd: 98,
      estimatedHours: 40,
      why: "Power BI is in most analyst job posts, and Power Query is the closest thing to what you already do every day.",
      deliverable: "One finished Power BI report: messy CSV in, cleaned in Power Query, modelled as a star schema, 3–4 visuals out. The thing you screen-share in interviews.",
      deliverableName: "Power BI report",
      linkHint: "A Google Drive or OneDrive link to the .pbix and screenshots",
      modules: [
        {
          id: "pq-excel",
          name: "Power Query inside Excel",
          dayStart: 43,
          dayEnd: 52,
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
          dayStart: 53,
          dayEnd: 62,
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
              label: "Choose the dataset for your final report",
              detail: "Browse Kaggle for something messy with dates, categories and amounts (sales, orders, bookings). Pick one you're curious about — you'll live with it for a month.",
              estimatedMinutes: 30,
              url: "https://www.kaggle.com/datasets?search=sales",
              type: "practice"
            }
          ]
        },
        {
          id: "pbi-modeling",
          name: "Data modeling — star schema",
          dayStart: 63,
          dayEnd: 74,
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
          dayStart: 75,
          dayEnd: 86,
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
          id: "pbi-report",
          name: "Build one complete report",
          dayStart: 87,
          dayEnd: 98,
          skill: "Build an end-to-end Power BI report, from raw CSV to finished visuals",
          tasks: [
            {
              id: "report-questions",
              label: "Write the 3 questions your report answers",
              detail: "Business questions, not chart names — 'Which regions are growing?' not 'bar chart of regions'. Every visual you build should answer one of these.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            },
            {
              id: "report-clean-1",
              label: "Report: load and clean (part 1)",
              detail: "Start a fresh .pbix from the raw CSV. Rebuilding from scratch is the point — it proves you can do it without the earlier sketch.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "report-clean-2",
              label: "Report: load and clean (part 2)",
              detail: "Finish cleaning. Rename every applied step so someone else could read your query.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "report-model",
              label: "Report: build the star schema",
              detail: "Fact, dimensions, date table, relationships. Use your sketch.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "report-measures",
              label: "Report: write the measures",
              detail: "Only the measures your 3 questions need. Put them in a dedicated measures table.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "report-visuals-1",
              label: "Report: build the visuals",
              detail: "3–4 visuals, one page. A title on each that states the answer, not just the topic.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "report-visuals-2",
              label: "Report: polish the page",
              detail: "Alignment, consistent colours, remove anything that doesn't answer a question. Revisit the 'Design effective reports' path if you're unsure.",
              estimatedMinutes: 60,
              url: "https://learn.microsoft.com/en-us/training/paths/power-bi-effective/",
              type: "build"
            },
            {
              id: "report-writeup",
              label: "Write up the report (Phase 2 deliverable)",
              detail: "Screenshots, your model paragraph, and a short note: the data, the questions, what you found, what you'd do next. Save the .pbix alongside it.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            },
            {
              id: "report-rehearse",
              label: "Rehearse the 3-minute walkthrough",
              detail: "Talk through the report out loud as if screen-sharing in an interview: problem, data, model, one insight. Record yourself once if you can bear it.",
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
      dayStart: 99,
      dayEnd: 140,
      estimatedHours: 30,
      why: "The goal isn't to become a software engineer — it's to read, modify and debug a data script, and write a straightforward one from scratch.",
      deliverable: "A Python script that turns a messy file into a clean one — ideally rebuilding one of your Excel/VBA tools, so you can compare both approaches.",
      deliverableName: "Python cleaning script",
      linkHint: "https://github.com/your-name/…",
      modules: [
        {
          id: "py-basics",
          name: "Python basics",
          dayStart: 99,
          dayEnd: 108,
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
          dayStart: 109,
          dayEnd: 120,
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
          name: "Real cleaning on a messy dataset",
          dayStart: 121,
          dayEnd: 130,
          skill: "Clean a messy real-world dataset in Python, with every step documented",
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
            },
            {
              id: "pick-messy-data",
              label: "Find a genuinely messy dataset",
              detail: "data.gov is full of them. You want inconsistent dates, duplicate rows, and categories spelled three ways. You'll reuse it for your dbt project later.",
              estimatedMinutes: 30,
              url: "https://catalog.data.gov/",
              type: "practice"
            },
            {
              id: "clean-profile",
              label: "Load and profile the dataset",
              detail: "Shape, column types, blanks per column, a few value counts. Write down every problem you find before fixing any.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "clean-fix",
              label: "Fix the problems",
              detail: "Types, duplicates, missing values, inconsistent categories — one at a time, checking the row count after each step.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "clean-log",
              label: "Write a cleaning log",
              detail: "A short markdown file: each problem, how you fixed it, and how many rows it affected. This is exactly what a reviewer wants to see.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "py-automate",
          name: "Automating a repetitive task end to end",
          dayStart: 131,
          dayEnd: 140,
          skill: "Automate a repetitive spreadsheet task end to end with Python",
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
            },
            {
              id: "auto-pick",
              label: "Pick the Excel/VBA tool to rebuild",
              detail: "Choose one you've built that takes a messy file and produces a clean one. Write its steps in plain English — that's your spec.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            },
            {
              id: "auto-build-1",
              label: "Rebuild it in Python (part 1)",
              detail: "Read the input and get the first half of the steps working. Check against your Excel output as you go.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "auto-build-2",
              label: "Rebuild it in Python (part 2)",
              detail: "Remaining steps and writing the clean output.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "auto-build-3",
              label: "Make it run on next month's file",
              detail: "No editing the code to run it: the file path comes in as an argument or from a folder. Test it on a second file.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "auto-compare",
              label: "Write the VBA vs Python comparison (Phase 3 deliverable)",
              detail: "Half a page: what was easier in each, what was harder, which you'd pick for what. This is the paragraph you'll draw on in interviews.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            }
          ]
        }
      ]
    },

    // ───────────────────────────────────────────────────────────── PHASE 4
    {
      id: "portfolio",
      name: "Git, dbt & Portfolio",
      shortName: "Git & dbt",
      dayStart: 141,
      dayEnd: 180,
      estimatedHours: 30,
      why: "A public GitHub with three real projects changes what you can apply for.",
      deliverable: "A public GitHub profile with 3 repos — the SQL pattern library, the Python cleaning script, and a small dbt project — each with a README covering the problem, the approach, and what you'd do differently.",
      deliverableName: "GitHub portfolio",
      linkHint: "https://github.com/your-name",
      modules: [
        {
          id: "git",
          name: "Git and GitHub fundamentals",
          dayStart: 141,
          dayEnd: 150,
          skill: "Version-control work with Git and share it on GitHub",
          tasks: [
            {
              id: "git-what",
              label: "Read: What is Git?",
              detail: "The short official explanation. Git is a save history for a folder — every version kept, any one recoverable.",
              estimatedMinutes: 20,
              url: "https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F",
              type: "reading"
            },
            {
              id: "lgb-intro",
              label: "Learn Git Branching: Introduction sequence",
              detail: "A visual game. Do the four Introduction levels — commits, branches, merging, rebasing.",
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
              detail: "Switch to the Remote tab. Push, pull and fetch — how your machine talks to GitHub.",
              estimatedMinutes: 45,
              url: "https://learngitbranching.js.org/?locale=en_US",
              type: "interactive"
            },
            {
              id: "git-install",
              label: "Install Git and create your GitHub account",
              detail: "Git for Windows from the official site, then sign up at github.com. Pick a username you'd be happy to put on a CV.",
              estimatedMinutes: 30,
              url: "https://git-scm.com/downloads/win",
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
              detail: "How READMEs are written. You'll write four of these by the end.",
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
            },
            {
              id: "repo-sql",
              label: "Publish your SQL pattern library",
              detail: "Create a public repo called sql-patterns and push your cheat sheet to it. Your first real repo.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "dbt",
          name: "dbt Fundamentals",
          dayStart: 151,
          dayEnd: 166,
          skill: "Build tested, documented data models with dbt",
          tasks: [
            {
              id: "dbt-fund-1",
              label: "dbt Fundamentals: Welcome and setup",
              detail: "The official free course. Create a free dbt account and follow the setup — the course provides a trial warehouse, which is fine for learning.",
              estimatedMinutes: 60,
              url: "https://learn.getdbt.com/courses/dbt-fundamentals",
              type: "interactive"
            },
            {
              id: "dbt-fund-2",
              label: "dbt Fundamentals: Models",
              detail: "A model is a SELECT statement saved as a file — your CTE skills, organised.",
              estimatedMinutes: 60,
              url: "https://learn.getdbt.com/courses/dbt-fundamentals",
              type: "interactive"
            },
            {
              id: "dbt-fund-3",
              label: "dbt Fundamentals: Sources",
              detail: "Declaring where raw data comes from, so dbt can trace every model back to it.",
              estimatedMinutes: 60,
              url: "https://learn.getdbt.com/courses/dbt-fundamentals",
              type: "interactive"
            },
            {
              id: "dbt-fund-4",
              label: "dbt Fundamentals: Tests",
              detail: "Automated checks — unique, not null, accepted values. Reconciliation, built in.",
              estimatedMinutes: 60,
              url: "https://learn.getdbt.com/courses/dbt-fundamentals",
              type: "interactive"
            },
            {
              id: "dbt-fund-5",
              label: "dbt Fundamentals: Documentation and deployment",
              detail: "Finish the course. The documentation site dbt generates is one of the nicest things to show in an interview.",
              estimatedMinutes: 60,
              url: "https://learn.getdbt.com/courses/dbt-fundamentals",
              type: "interactive"
            },
            {
              id: "dbt-local-setup",
              label: "Set up dbt on your own machine (free, no expiry)",
              detail: "Install dbt with the DuckDB adapter so your portfolio project doesn't depend on a trial. Claude Code can walk you through the commands.",
              estimatedMinutes: 60,
              url: "https://github.com/duckdb/dbt-duckdb",
              type: "setup"
            },
            {
              id: "dbt-jaffle",
              label: "Run the jaffle_shop example locally",
              detail: "dbt's official sample project, already set up for DuckDB. Get it running end to end before building your own.",
              estimatedMinutes: 45,
              url: "https://github.com/dbt-labs/jaffle_shop_duckdb",
              type: "practice"
            },
            {
              id: "dbt-own-staging",
              label: "Your dbt project: sources and staging models",
              detail: "Use the messy dataset from Phase 3. One staging model per raw table: rename, cast types, nothing clever.",
              estimatedMinutes: 60,
              url: "https://docs.getdbt.com/docs/build/sources",
              type: "build"
            },
            {
              id: "dbt-own-mart",
              label: "Your dbt project: a mart model",
              detail: "One model that answers a real question — the dbt version of your Power BI fact table.",
              estimatedMinutes: 60,
              url: "",
              type: "build"
            },
            {
              id: "dbt-own-tests",
              label: "Your dbt project: tests and docs",
              detail: "Add tests to every key column and a description to every model. Generate the docs site and look at it.",
              estimatedMinutes: 60,
              url: "https://docs.getdbt.com/docs/build/data-tests",
              type: "build"
            },
            {
              id: "repo-dbt",
              label: "Publish your dbt project",
              detail: "Push it to a public repo. Leave the README for the portfolio module.",
              estimatedMinutes: 30,
              url: "",
              type: "build"
            }
          ]
        },
        {
          id: "portfolio-build",
          name: "Portfolio assembly and write-ups",
          dayStart: 167,
          dayEnd: 180,
          skill: "Present technical work clearly in a public portfolio",
          tasks: [
            {
              id: "repo-python",
              label: "Publish your Python cleaning script",
              detail: "Push the script, a small sample input file, and your cleaning log. Don't upload anything confidential from work.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            },
            {
              id: "readme-sql",
              label: "README: SQL pattern library",
              detail: "Three sections: the problem, the approach, what you'd do differently. Short beats thorough.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            },
            {
              id: "readme-python",
              label: "README: Python cleaning script",
              detail: "Include the VBA vs Python comparison — it's the most interesting part.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            },
            {
              id: "readme-dbt",
              label: "README: dbt project",
              detail: "Include a screenshot of the lineage graph from the docs site.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            },
            {
              id: "profile-readme",
              label: "Write your GitHub profile README",
              detail: "The page people see first. Two lines about you, links to the three repos, and a line about the Power BI report.",
              estimatedMinutes: 45,
              url: "https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme",
              type: "build"
            },
            {
              id: "pbi-showcase",
              label: "Add your Power BI report to the portfolio",
              detail: "Screenshots and the write-up from Phase 2, in a repo or on your profile. The .pbix itself can live in Drive.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            },
            {
              id: "gh-skills-pages",
              label: "GitHub Skills: GitHub Pages",
              detail: "How to publish a website straight from a repo. The Climb itself runs this way.",
              estimatedMinutes: 45,
              url: "https://github.com/skills/github-pages",
              type: "interactive"
            },
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
              detail: "Open your profile in a private window. Five minutes per repo: is it clear what this is and why it's good? Fix what isn't.",
              estimatedMinutes: 45,
              url: "",
              type: "practice"
            },
            {
              id: "update-cv",
              label: "Update your CV (Phase 4 deliverable)",
              detail: "Add your GitHub link and pull lines from the Skills list on the Progress screen. You've earned every one of them.",
              estimatedMinutes: 45,
              url: "",
              type: "build"
            }
          ]
        }
      ]
    }
  ]
};
