/*
  THE CLIMB — Data side module: Portfolio site
  ============================================

  Your own portfolio site at your-username.github.io, built by hand as a
  learning project: about 28 hours, plus about 6 for the two stretch steps.
  It sits beside the Data plan, like the Finance & SAP module:
    - Data's day count and the 180 days don't change.
    - It's locked until the Telecom complaints database is finished (its
      README task, tel-readme). Untick that and it locks again.
    - Then it shows on Today as its own group under Data. Every task is an
      hour or less, so it suits a lighter week.
    - The two "add this card" reminders for the Power BI and Python projects
      wait until those projects are finished (each task's `unlockedBy`).
    - The stretch steps (8 and 9) are optional: on the Map, never on Today.
    - Its own Portfolio card, "Portfolio site".

  Same task shape as curriculum.js, plus:
    unlockedBy  (optional) a Data task id: this task stays off Today until it's done
  Ids start with "site-" (or the course: odin-, mdn-, kp-, sqljs-) and never
  change once a task is done.

  Resources are free only: The Odin Project Foundations, MDN Learn Web
  Development, Kevin Powell on YouTube, GitHub's docs, and sql.js.
  All links checked 2026-11-12.
*/

const SIDE_SITE = {
  id: "site",
  name: "Portfolio site",
  shortName: "Portfolio site",
  why: "A site you built yourself, line by line, that shows your projects and how you think. Building it teaches the web basics behind every dashboard and tool you'll use.",
  timeframe: "alongside Phases 2 and 3",
  skill: "Built and published a responsive personal website by hand: HTML, CSS (flexbox, custom properties), JavaScript and the DOM, on GitHub Pages",

  // Locked until this Data task is done.
  unlockedBy: { taskId: "tel-readme", text: "Unlocks when you finish the Telecom complaints database (its README task)." },

  // The extra Portfolio card. Its link is saved like the phase links, under this id.
  portfolio: {
    id: "site",
    name: "Portfolio site",
    taskId: "site-toggle",
    deliverable: "Your own portfolio site, written by hand: About, Experience tabs, a Projects carousel with a card for each project, and a dark/light toggle. Works on your phone.",
    linkHint: "https://your-username.github.io"
  },

  modules: [
    {
      id: "site-brief",
      name: "Step 0 · Content and design brief (no code)",
      tasks: [
        {
          id: "site-rules",
          label: "Portfolio site: the rules, then study your inspiration",
          detail: "Ground rule: you write all the code yourself. AI only explains error messages, and reviews your code after you've written it. gazijarin.com is inspiration only: its code has no licence, so copy nothing. Note what you like: the layout, the sections, how it moves.",
          estimatedMinutes: 30,
          url: "https://gazijarin.com/",
          type: "reading"
        },
        {
          id: "site-words",
          label: "Write your hero line and bio",
          detail: "One line that says who you are and what you do, then a short bio of 3 or 4 sentences. Plain words, in your own voice.",
          estimatedMinutes: 45,
          url: "",
          type: "build"
        },
        {
          id: "site-experience-copy",
          label: "Write your experience bullets",
          detail: "Three roles: telecom, e-commerce operations and automation consulting. Two or three bullets each, with numbers where you can. No client names.",
          estimatedMinutes: 45,
          url: "",
          type: "build"
        },
        {
          id: "site-sketch",
          label: "Pick 2 colours and sketch the layout on paper",
          detail: "One main colour and one accent. Sketch each section on paper: top menu, hero, About, Experience, Projects. This sketch is your plan for every step after.",
          estimatedMinutes: 45,
          url: "",
          type: "build"
        }
      ]
    },
    {
      id: "site-html",
      name: "Step 1 · HTML basics → your About section",
      tasks: [
        {
          id: "site-editor",
          label: "Set up VS Code and a folder for your site",
          detail: "Install VS Code (free) and make a folder for the site. Open it in VS Code: that's where all your code will live.",
          estimatedMinutes: 30,
          url: "https://www.theodinproject.com/lessons/foundations-text-editors",
          type: "setup"
        },
        {
          id: "odin-html-1",
          label: "The Odin Project: HTML, elements and the boilerplate",
          detail: "Three short lessons. Type every example yourself rather than copying it.",
          estimatedMinutes: 60,
          url: "https://www.theodinproject.com/lessons/foundations-introduction-to-html-and-css",
          type: "reading",
          more: [
            { label: "Elements and tags", url: "https://www.theodinproject.com/lessons/foundations-elements-and-tags" },
            { label: "HTML boilerplate", url: "https://www.theodinproject.com/lessons/foundations-html-boilerplate" }
          ]
        },
        {
          id: "odin-html-2",
          label: "The Odin Project: text, lists, links and images",
          detail: "Everything your About section needs.",
          estimatedMinutes: 60,
          url: "https://www.theodinproject.com/lessons/foundations-working-with-text",
          type: "reading",
          more: [
            { label: "Lists", url: "https://www.theodinproject.com/lessons/foundations-lists" },
            { label: "Links and images", url: "https://www.theodinproject.com/lessons/foundations-links-and-images" }
          ]
        },
        {
          id: "site-about",
          label: "Build your About section (unstyled)",
          detail: "Your hero line and bio as real HTML: headings, paragraphs, a photo or not. No CSS yet; it should look plain.",
          estimatedMinutes: 60,
          url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
          type: "build"
        }
      ]
    },
    {
      id: "site-css",
      name: "Step 2 · CSS and flexbox → styling and a sticky top menu",
      tasks: [
        {
          id: "odin-css-1",
          label: "The Odin Project: intro to CSS and the cascade",
          detail: "How styles reach an element, and why one rule beats another.",
          estimatedMinutes: 60,
          url: "https://www.theodinproject.com/lessons/foundations-intro-to-css",
          type: "reading",
          more: [
            { label: "The cascade", url: "https://www.theodinproject.com/lessons/foundations-the-cascade" }
          ]
        },
        {
          id: "odin-css-2",
          label: "The Odin Project: inspecting, and the box model",
          detail: "The browser's inspector is your best friend from here on. The box model explains most spacing surprises.",
          estimatedMinutes: 45,
          url: "https://www.theodinproject.com/lessons/foundations-inspecting-html-and-css",
          type: "reading",
          more: [
            { label: "The box model", url: "https://www.theodinproject.com/lessons/foundations-the-box-model" },
            { label: "Block and inline", url: "https://www.theodinproject.com/lessons/foundations-block-and-inline" }
          ]
        },
        {
          id: "odin-flex-1",
          label: "The Odin Project: flexbox, part 1",
          detail: "Laying things out in a row or a column, and how items grow and shrink.",
          estimatedMinutes: 60,
          url: "https://www.theodinproject.com/lessons/foundations-introduction-to-flexbox",
          type: "reading",
          more: [
            { label: "Growing and shrinking", url: "https://www.theodinproject.com/lessons/foundations-growing-and-shrinking" }
          ]
        },
        {
          id: "odin-flex-2",
          label: "The Odin Project: flexbox, part 2",
          detail: "Axes and alignment: centring things, finally.",
          estimatedMinutes: 45,
          url: "https://www.theodinproject.com/lessons/foundations-axes",
          type: "reading",
          more: [
            { label: "Alignment", url: "https://www.theodinproject.com/lessons/foundations-alignment" },
            { label: "Kevin Powell on flexbox", url: "https://www.youtube.com/@KevinPowell/search?query=flexbox" }
          ]
        },
        {
          id: "site-style",
          label: "Style your page with your 2 colours",
          detail: "Fonts, spacing and your colours, following your sketch.",
          estimatedMinutes: 60,
          url: "",
          type: "build"
        },
        {
          id: "site-nav",
          label: "Build the sticky top menu",
          detail: "A menu that stays at the top as you scroll, with links to each section.",
          estimatedMinutes: 45,
          url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Positioning",
          type: "build",
          more: [
            { label: "Kevin Powell on position: sticky", url: "https://www.youtube.com/@KevinPowell/search?query=position%20sticky" }
          ]
        }
      ]
    },
    {
      id: "site-responsive",
      name: "Step 3 · Responsive design → works on your iPhone",
      tasks: [
        {
          id: "mdn-responsive",
          label: "MDN: Responsive design and media queries",
          detail: "How one page fits a phone and a big screen.",
          estimatedMinutes: 45,
          url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design",
          type: "reading",
          more: [
            { label: "Media queries", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries" }
          ]
        },
        {
          id: "kp-responsive",
          label: "Kevin Powell: a responsive layout video",
          detail: "Pick one of his responsive-layout videos and watch it all the way through.",
          estimatedMinutes: 30,
          url: "https://www.youtube.com/@KevinPowell/search?query=responsive",
          type: "video"
        },
        {
          id: "site-mobile",
          label: "Make your page work at phone width",
          detail: "Use the browser's device mode at iPhone size. Nothing may scroll sideways. You'll check it on the real phone once it's live.",
          estimatedMinutes: 60,
          url: "",
          type: "build"
        }
      ]
    },
    {
      id: "site-pages",
      name: "Step 4 · Git and GitHub Pages → v0 live",
      tasks: [
        {
          id: "site-repo",
          label: "Put your site on GitHub Pages",
          detail: "A repository named exactly your-username.github.io becomes your site's home address. Push your code and turn on Pages.",
          estimatedMinutes: 45,
          url: "https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site",
          type: "setup"
        },
        {
          id: "site-live",
          label: "Check v0 on your iPhone, and that The Climb still works",
          detail: "Open your site on the phone: no sideways scroll. Then open /the-climb: it must still load and sign you in. The Climb has its own repository, so it keeps its address as long as your site never has a folder called the-climb.",
          estimatedMinutes: 30,
          url: "",
          type: "practice"
        }
      ]
    },
    {
      id: "site-js",
      name: "Step 5 · JavaScript basics → Experience tabs",
      tasks: [
        {
          id: "odin-js-1",
          label: "The Odin Project: variables and operators",
          detail: "Your first JavaScript. Run the examples in the browser's console.",
          estimatedMinutes: 60,
          url: "https://www.theodinproject.com/lessons/foundations-variables-and-operators",
          type: "reading",
          more: [
            { label: "JavaScript developer tools", url: "https://www.theodinproject.com/lessons/foundations-javascript-developer-tools" }
          ]
        },
        {
          id: "odin-js-2",
          label: "The Odin Project: data types and conditionals",
          detail: "Text, numbers, true/false, and if/else.",
          estimatedMinutes: 60,
          url: "https://www.theodinproject.com/lessons/foundations-data-types-and-conditionals",
          type: "reading"
        },
        {
          id: "odin-js-3",
          label: "The Odin Project: functions and problem solving",
          detail: "Functions, and how to break a problem into steps before writing code.",
          estimatedMinutes: 60,
          url: "https://www.theodinproject.com/lessons/foundations-function-basics",
          type: "reading",
          more: [
            { label: "Problem solving", url: "https://www.theodinproject.com/lessons/foundations-problem-solving" }
          ]
        },
        {
          id: "odin-js-4",
          label: "The Odin Project: arrays and loops",
          detail: "Lists of things, and doing something to each one.",
          estimatedMinutes: 60,
          url: "https://www.theodinproject.com/lessons/foundations-arrays-and-loops",
          type: "reading"
        },
        {
          id: "site-tabs",
          label: "Build the Experience tabs",
          detail: "One tab per role; clicking a tab shows that role's bullets. Make sure it works with the keyboard too.",
          estimatedMinutes: 60,
          url: "",
          type: "build"
        }
      ]
    },
    {
      id: "site-dom",
      name: "Step 6 · DOM scripting → Projects carousel",
      tasks: [
        {
          id: "odin-dom",
          label: "The Odin Project: DOM manipulation and events",
          detail: "How JavaScript changes the page when someone clicks.",
          estimatedMinutes: 60,
          url: "https://www.theodinproject.com/lessons/foundations-dom-manipulation-and-events",
          type: "reading"
        },
        {
          id: "mdn-events",
          label: "MDN: Introduction to events",
          detail: "A second explanation of events, with more examples.",
          estimatedMinutes: 45,
          url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events",
          type: "reading",
          more: [
            { label: "MDN: DOM scripting", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting" }
          ]
        },
        {
          id: "site-carousel-1",
          label: "Build the Projects carousel (part 1)",
          detail: "Cards in a row with next and previous buttons.",
          estimatedMinutes: 60,
          url: "",
          type: "build"
        },
        {
          id: "site-carousel-2",
          label: "Build the Projects carousel (part 2)",
          detail: "Make it work on the phone and with the keyboard, and stop at the first and last card.",
          estimatedMinutes: 45,
          url: "",
          type: "build"
        },
        {
          id: "site-card-sql",
          label: "Add the Telecom complaints database card to your site",
          detail: "Add this project's card to your site: one line on what it is, one key finding, and links to the repository.",
          estimatedMinutes: 30,
          url: "",
          type: "build"
        }
      ]
    },
    {
      id: "site-theme",
      name: "Step 7 · CSS variables → dark/light toggle",
      tasks: [
        {
          id: "mdn-custom-props",
          label: "MDN: Using CSS custom properties",
          detail: "Variables in CSS: define your 2 colours once and use them everywhere.",
          estimatedMinutes: 30,
          url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties",
          type: "reading"
        },
        {
          id: "kp-custom-props",
          label: "Kevin Powell: custom properties video",
          detail: "Pick one of his videos on custom properties and watch it all the way through.",
          estimatedMinutes: 30,
          url: "https://www.youtube.com/@KevinPowell/search?query=custom%20properties",
          type: "video"
        },
        {
          id: "site-toggle",
          label: "Build the dark/light toggle",
          detail: "Swap the colour variables with one button. Start in the phone's own setting, and remember the choice.",
          estimatedMinutes: 60,
          url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia",
          type: "build"
        }
      ]
    },
    {
      id: "site-cards",
      name: "Keep it current: new project cards",
      tasks: [
        {
          id: "site-card-pbi",
          label: "Add the Budget vs actual dashboard card to your site",
          detail: "Add this project's card to your site, with a screenshot and a link to the repository.",
          estimatedMinutes: 30,
          url: "",
          type: "build",
          unlockedBy: "bva-readme"
        },
        {
          id: "site-card-py",
          label: "Add the Mailing list pipeline card to your site",
          detail: "Add this project's card to your site, with the summary numbers and a link to the repository.",
          estimatedMinutes: 30,
          url: "",
          type: "build",
          unlockedBy: "mail-readme"
        }
      ]
    },
    {
      id: "site-stretch",
      name: "Stretch (optional) · Query mode and a spreadsheet portrait",
      tasks: [
        {
          id: "sqljs-read",
          label: "Step 8 · Query mode: read the sql.js docs",
          detail: "sql.js runs SQLite inside the browser. Read how to load it and run a query.",
          estimatedMinutes: 45,
          url: "https://sql.js.org/documentation/",
          type: "reading",
          optional: true
        },
        {
          id: "site-query-1",
          label: "Step 8 · Query mode: a table about you",
          detail: "Create a small table about you (roles, skills, projects) and run a fixed query against it.",
          estimatedMinutes: 60,
          url: "https://github.com/sql-js/sql.js",
          type: "build",
          optional: true
        },
        {
          id: "site-query-2",
          label: "Step 8 · Query mode: the SQL box",
          detail: "A box where visitors type SQL and see the results, with a friendly message when the SQL is wrong.",
          estimatedMinutes: 60,
          url: "",
          type: "build",
          optional: true
        },
        {
          id: "mdn-grid",
          label: "Step 9 · Portrait: MDN CSS grid",
          detail: "Grids of rows and columns, like a spreadsheet.",
          estimatedMinutes: 45,
          url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids",
          type: "reading",
          optional: true,
          more: [
            { label: "Kevin Powell on CSS grid", url: "https://www.youtube.com/@KevinPowell/search?query=css%20grid" }
          ]
        },
        {
          id: "site-portrait-1",
          label: "Step 9 · Portrait: plan the cells",
          detail: "Turn a photo into a small grid of coloured cells, like a zoomed-out spreadsheet.",
          estimatedMinutes: 60,
          url: "",
          type: "build",
          optional: true
        },
        {
          id: "site-portrait-2",
          label: "Step 9 · Portrait: build it",
          detail: "Draw it with CSS Grid, one cell per square.",
          estimatedMinutes: 60,
          url: "",
          type: "build",
          optional: true
        }
      ]
    },
    {
      id: "site-finish",
      name: "Last task",
      tasks: [
        {
          id: "site-profile-readme",
          label: "Write a GitHub profile README and pin your best repos",
          detail: "A repository named exactly like your username shows its README on your profile. Two lines about you, a link to your site, then pin your best repositories.",
          estimatedMinutes: 45,
          url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme",
          type: "build",
          more: [
            { label: "Pinning repositories", url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/pinning-items-to-your-profile" }
          ]
        }
      ]
    }

  ]
};
