/*
  THE CLIMB — German (elective)
  =============================

  Locked until the Spanish Term 2 exam (es-t2-exam) is marked done.
  Course: DW's Nicos Weg (free, A1 to B1), 1–2 hours a week.

  Only the structure for now: one starter task so the subject works once it
  unlocks. The weekly tasks get written when it's nearly time. Same shape as
  curriculum.js; ids start with "de-".

  Link checked 2026-10-20: learngerman.dw.com/en/nicos-weg/c-36519789
*/

const GERMAN = {
  totalDays: 1,
  unit: "week",

  phases: [
    {
      id: "de-a1",
      name: "Nicos Weg A1",
      shortName: "A1",
      dayStart: 1,
      dayEnd: 1,
      estimatedHours: 1,
      why: "A free video course that follows one story from your first German words to B1.",
      deliverable: "Not planned yet: the tasks are written once German unlocks.",
      modules: [
        {
          id: "de-start",
          name: "Getting started",
          dayStart: 1,
          dayEnd: 1,
          tasks: [
            {
              id: "de-nicos-1",
              label: "Nicos Weg A1: watch the first episode and do its exercises",
              detail: "Make a free DW account so it remembers where you are. Ask Claude Code to write out the next weeks once you've seen how the course is laid out.",
              estimatedMinutes: 45,
              url: "https://learngerman.dw.com/en/nicos-weg/c-36519789",
              type: "video"
            }
          ]
        }
      ]
    }
  ]
};
