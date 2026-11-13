/*
  THE CLIMB — Data side module: ETL Basics
  ========================================

  The ideas behind ETL pipelines, and the words interviewers use for them:
  about 3 hours, available now. It sits beside the Data plan, like the
  Finance & SAP module:
    - Data's day count and the 180 days don't change.
    - It shows on Today as its own group under Data until every task is done.
      Every task is 40 minutes or less, so it suits a lighter week.
    - No Portfolio card: the hands-on part is the Phase 3 mailing list
      pipeline, which uses everything here.

  Ground rule, as with the projects: any code you try here, you write yourself.

  Same task shape as curriculum.js. Ids start with "etl-" and never change
  once a task is done.

  Resources are free only: IBM Think, AWS, Microsoft Learn, SQLite's docs,
  Start Data Engineering and Python's docs. All links checked 2026-11-13.
*/

const SIDE_ETL = {
  id: "etl",
  name: "ETL Basics",
  shortName: "ETL Basics",
  why: "What ETL is, how pipelines load only what's new, and why a rerun must never create duplicates: the ideas you'll build into the Phase 3 mailing list pipeline, and an answer ready for 'tell me about your ETL experience'. Ground rule: any code you try, you write yourself.",
  timeframe: "fits a lighter week",
  skill: "ETL vs ELT, full vs incremental loads with watermarks, idempotent pipelines, data quality checks and logging; a ready answer on ETL done in Excel/VBA",

  modules: [
    {
      id: "etl-concepts",
      name: "How ETL works",
      tasks: [
        {
          id: "etl-what",
          label: "What ETL is, and ETL vs ELT",
          detail: "Ground rule: any code you try in this module, you write yourself. Extract pulls data from where it lives, Transform cleans and reshapes it, Load writes it to where it's used. ELT loads the raw data first and transforms it inside the warehouse. Read IBM for the basics, then AWS for why warehouses moved to ELT: cloud storage got cheap and warehouses got the power to do the transforming themselves, so you keep the raw data and can transform it again later. Be ready to say which one dbt (Phase 4) is.",
          estimatedMinutes: 40,
          url: "https://www.ibm.com/think/topics/etl",
          more: [
            { label: "AWS: ETL vs ELT, and why ELT took over", url: "https://aws.amazon.com/compare/the-difference-between-etl-and-elt/" }
          ],
          type: "reading"
        },
        {
          id: "etl-incremental",
          label: "Full load vs incremental load, watermarks, key-based dedupe",
          detail: "A full load reloads everything every time; an incremental load takes only what's new or changed since last time. A watermark is how a pipeline remembers where it got to: the last updated timestamp or the highest id it loaded. Key-based dedupe means each row has a key (an id, or cleaned email + name), and a row whose key is already there isn't added again. Microsoft explains watermarks in its short overview (skip the Azure set-up); SQLite's UPSERT page shows ON CONFLICT DO NOTHING, which you'll want in the mailing list project.",
          estimatedMinutes: 40,
          url: "https://learn.microsoft.com/en-us/azure/data-factory/tutorial-incremental-copy-overview",
          more: [
            { label: "SQLite: UPSERT (ON CONFLICT)", url: "https://sqlite.org/lang_upsert.html" }
          ],
          type: "reading"
        },
        {
          id: "etl-idempotent",
          label: "Idempotent pipelines: why a rerun must not create duplicates",
          detail: "Pipelines get rerun: after a failure, a fix, or by mistake. Idempotent means running it twice gives the same result as running it once, with no doubled rows. Start Data Engineering's piece covers delete-then-write and overwrite. Note how each one is safe to rerun, and which one you'd use when you only add new rows.",
          estimatedMinutes: 35,
          url: "https://www.startdataengineering.com/post/why-how-idempotent-data-pipeline/",
          type: "reading"
        },
        {
          id: "etl-quality-logging",
          label: "Data quality checks and logging: what to check, what to log",
          detail: "What to check: required fields present, values valid (an email looks like an email), keys unique, row counts as expected in and out. What to log: when each step started and ended, rows in and out, how many failed each check, and any error. Read Start Data Engineering's types of checks, then the Basic Logging Tutorial in Python's logging HOWTO: logging to a file, and adding the date and time to each line (stop at 'Advanced Logging Tutorial').",
          estimatedMinutes: 35,
          url: "https://www.startdataengineering.com/post/types-of-dq-checks/",
          more: [
            { label: "Python: Logging HOWTO", url: "https://docs.python.org/3/howto/logging.html" }
          ],
          type: "reading"
        }
      ]
    },
    {
      id: "etl-interview",
      name: "For interviews",
      tasks: [
        {
          id: "etl-vba-answer",
          label: "Write your 5-line answer: how I've done ETL in Excel/VBA",
          detail: "In your own words, five lines: where the data came from (extract), what you cleaned and reshaped (transform), where it went (load), how you checked it, and how you made it safe to run again. Use the words from this module. Keep it with your interview notes.",
          estimatedMinutes: 30,
          url: "",
          type: "practice"
        }
      ]
    }
  ]
};
