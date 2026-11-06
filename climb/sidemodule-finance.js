/*
  THE CLIMB — Data side module: Finance & SAP Reporting Basics
  =============================================================

  A short extra on finance reporting basics: about 6.5 hours, meant
  for the next 2–3 weeks. It sits beside the Data plan, not inside it:
    - Data's day count and the 180-day plan don't change.
    - Today shows it as its own group under Data until every task is done,
      then it leaves Today. It stays at the bottom of Data's Map.
    - Time logged here counts toward Data's hours, streak and the bad-week
      minimum (it's Data study, just off the main path).
    - Its practice task has its own Portfolio card, "Variance report",
      separate from the four phase deliverables.

  Same task shape as curriculum.js. `more` is optional: extra links shown
  under the task on Today. Ids start with "fin-" and never change once a task
  is done (that's how the app remembers it).

  Links (all checked 2026-10-22):
    CFI (Corporate Finance Institute) free articles: corporatefinanceinstitute.com/resources
    SAP Learning (free lessons; a free SAP account unlocks quizzes): learning.sap.com
    IBM Think, Microsoft Learn, Microsoft Support, Xero guides
    Sample data: Microsoft's IT Spend Analysis sample (obviEnce ©), on GitHub
*/

const SIDE_FINANCE = {
  id: "fin",
  name: "Finance & SAP Reporting Basics",
  shortName: "Finance & SAP",
  why: "The finance words and the SAP reporting tools finance reporting teams use every day, so you can talk about them with confidence.",
  timeframe: "2–3 weeks",
  skill: "Finance reporting basics: P&L, cost centres, budget vs. actual variance analysis and month-end close; OLAP cubes, SAP BW/4HANA and Analysis for Office; built a variance report in Excel from a Data Model",

  // The extra Portfolio card. Its link is saved like the phase links, under this id.
  portfolio: {
    id: "fin-variance",
    name: "Variance report",
    taskId: "fin-variance-report",
    deliverable: "A budget vs. actual variance report in Excel: variance and variance % by area, the big gaps flagged, and three lines of commentary.",
    linkHint: "Paste a OneDrive or GitHub link to the workbook"
  },

  modules: [
    {
      id: "fin-basics",
      name: "Finance basics",
      tasks: [
        {
          id: "fin-pnl",
          label: "The P&L (income statement): what's in it",
          detail: "Read it top to bottom: revenue, cost of goods sold, gross profit, operating expenses, operating income, interest and tax, net income. Then write a five-line P&L from memory.",
          estimatedMinutes: 30,
          url: "https://corporatefinanceinstitute.com/resources/accounting/income-statement/",
          type: "reading"
        },
        {
          id: "fin-cost-centers",
          label: "Cost centres and cost allocation",
          detail: "A cost centre is a place costs are collected, like the IT or HR department, that doesn't earn money itself. Start with SAP's short lesson for the SAP words (controlling area, company code), then CFI on how shared costs such as rent get spread across cost centres. Be ready to say what an allocation base is (headcount, floor space…).",
          estimatedMinutes: 30,
          url: "https://learning.sap.com/courses/explaining-cost-center-accounting/outlining-cost-center-accounting-processes_d3a269cd-2b9d-4773-9e6b-d68b6865de92",
          more: [
            { label: "CFI: Cost allocation", url: "https://corporatefinanceinstitute.com/resources/accounting/cost-allocation/" }
          ],
          type: "reading"
        },
        {
          id: "fin-variance",
          label: "Budget vs. actual and variance analysis",
          detail: "Variance is the gap between actual and budget; variance % is that gap divided by budget. Learn favourable vs. unfavourable: spending under budget is good, revenue under budget is bad. Teams pick one sign convention, so in an interview say which one you'd use.",
          estimatedMinutes: 45,
          url: "https://corporatefinanceinstitute.com/resources/accounting/variance-analysis/",
          more: [
            { label: "CFI: Budget variance (types and causes)", url: "https://corporatefinanceinstitute.com/resources/fpa/budget-variance/" }
          ],
          type: "reading"
        },
        {
          id: "fin-close",
          label: "Month-end close: the steps, and where reporting fits",
          detail: "The eight steps from collecting documents to financial statements. Reporting comes last: only once the books are closed and reconciled do the monthly reports go out, budget vs. actual included. Note what a reporting analyst waits for, and what goes wrong if you report before the close is done.",
          estimatedMinutes: 30,
          url: "https://www.xero.com/uk/guides/month-end-close-process/",
          type: "reading"
        },
        {
          id: "fin-kpis",
          label: "Common finance KPIs: gross margin, OPEX, EBIT",
          detail: "Gross margin % = gross profit ÷ revenue. OPEX = running costs that aren't cost of goods sold (salaries, rent, marketing). EBIT = gross profit − OPEX, also called operating profit. Read the three pages and write each formula on one line.",
          estimatedMinutes: 30,
          url: "https://corporatefinanceinstitute.com/resources/accounting/gross-margin-ratio/",
          more: [
            { label: "CFI: Operating expenses", url: "https://corporatefinanceinstitute.com/resources/accounting/operating-expenses/" },
            { label: "CFI: EBIT", url: "https://corporatefinanceinstitute.com/resources/valuation/ebit/" }
          ],
          type: "reading"
        }
      ]
    },
    {
      id: "fin-cubes",
      name: "Cube-based reporting",
      tasks: [
        {
          id: "fin-olap",
          label: "What an OLAP cube is: dimensions, measures, slicing",
          detail: "Dimensions are what you sort and filter by (cost centre, account, month, actual or plan); measures are the numbers (amount). Slicing fixes one dimension, drilling down goes from year to month. A finance cube is just amount by account × cost centre × month × version.",
          estimatedMinutes: 30,
          url: "https://www.ibm.com/think/topics/olap",
          more: [
            { label: "Microsoft Learn: Online analytical processing", url: "https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/online-analytical-processing" }
          ],
          type: "reading"
        },
        {
          id: "fin-bw",
          label: "SAP BW/4HANA overview",
          detail: "SAP's own course, lesson one, then carry on into the next lessons until the 30 minutes are up. Words to come away with: InfoObject (a field, like Cost Center), InfoProvider (where the data sits) and the BW query, which is what Analysis for Office opens.",
          estimatedMinutes: 30,
          url: "https://learning.sap.com/courses/getting-started-building-an-on-premise-data-warehouse-using-sap-bw-4hana/outlining-the-role-of-a-data-warehouse_cdc78beb-5393-4f61-babf-d20bef9f4491",
          type: "interactive"
        },
        {
          id: "fin-afo",
          label: "SAP Analysis for Office (the Excel add-in): what it is and what it looks like",
          detail: "You can't try it without an SAP system, so the aim is to recognise it: the Analysis tab in Excel's ribbon, the design panel (rows, columns and filters, like a PivotTable field list) and the prompts that ask for a period when a workbook opens. Two short SAP lessons with screenshots.",
          estimatedMinutes: 30,
          url: "https://learning.sap.com/courses/discovering-sap-analysis-for-microsoft-office/launching-analysis-for-excel_b3850c0a-a1df-48af-8cc9-0bec3b1601fc",
          more: [
            { label: "SAP Learning: Inserting a data source", url: "https://learning.sap.com/courses/discovering-sap-analysis-for-microsoft-office/inserting-a-data-source_a178df44-661d-4cca-9a1b-a9b6c8a2b452" }
          ],
          type: "interactive"
        },
        {
          id: "fin-datamodel",
          label: "Hands-on: Excel Data Model + PivotTable as a mini cube",
          detail: "On your Windows machine: Excel for Mac can't build a Data Model. Work through Microsoft's tutorial: load tables into the Data Model, relate them, and build a PivotTable across them. The tables are the cube's dimensions and facts; the PivotTable is you slicing it.",
          estimatedMinutes: 45,
          url: "https://support.microsoft.com/en-us/office/tutorial-import-data-into-excel-and-create-a-data-model-4b4e5ab4-60ee-465e-8195-09ebba060bf0",
          type: "practice"
        }
      ]
    },
    {
      id: "fin-practice",
      name: "Practice",
      tasks: [
        {
          id: "fin-variance-report",
          label: "Build a budget vs. actual variance report in Excel",
          detail: "On Windows. Download “IT Spend Analysis Sample-no-PV.xlsx” (Microsoft's free sample: an IT department's actual vs. plan). The data is in its Data Model, so Insert → PivotTable → From Data Model. Rows: IT Area; columns: Scenario; values: Amount. Add Variance and Variance %, colour gaps over ±5%, and write three lines on the biggest ones. Save it to OneDrive or GitHub (the sample's terms ask you to credit “obviEnce ©” on it) and paste the link on Portfolio → Variance report.",
          estimatedMinutes: 90,
          url: "https://github.com/microsoft/powerbi-desktop-samples/blob/main/powerbi-service-samples/IT%20Spend%20Analysis%20Sample-no-PV.xlsx",
          more: [
            { label: "Microsoft Learn: what's in the sample", url: "https://learn.microsoft.com/en-us/power-bi/create-reports/sample-it-spend" }
          ],
          type: "build"
        }
      ]
    }
  ]
};
