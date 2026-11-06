/*
  THE CLIMB — Spanish (minor)
  ===========================

  Same shape as curriculum.js, so the app treats it the same way:
    phases  → terms (Term 1, 2, 3)
      modules → weeks
        tasks   → one sitting each. Today shows the next undone one, in order.
                  Missing a day never puts you "behind": the next session is
                  simply the next task.

  A normal week is seven sittings: five weekday sessions (15–20 min), one
  longer listening session (30 min, meant for Saturday) and one review
  (20 min, meant for Sunday). That's about 2 hrs 20 min a week.

  Unlike curriculum.js, the weeks are written as short recipes at the bottom
  of this file, because 39 weeks of near-identical tasks would be ~3,000 lines
  of copy-paste. To change something every week (say, the review length),
  change it once in the recipe. To change one week, add a special case.

  Ids never change once a task is done (that's how the app remembers it):
    es-lt-01 … es-lt-90       Language Transfer tracks
    es-wNN-listen / -review   the week's listening and review
    es-wNN-dN                 Term 2–3 weekday sessions after Language Transfer
    es-t1-exam, es-t2-exam    the end-of-term exams
    es-partner                finding a language partner (before the Term 2 exam)

  Links (all checked 2026-10-20):
    Language Transfer: languagetransfer.org (free; 90 tracks; app, SoundCloud or YouTube)
    Duolingo:          duolingo.com
    Dreaming Spanish:  dreaming.com/spanish (was dreamingspanish.com) and its YouTube channel
    HelloTalk, Tandem: hellotalk.com, tandem.net
*/

const SPANISH = (function () {
  const LT = "https://www.languagetransfer.org/complete-spanish";
  const DUO = "https://www.duolingo.com/course/es/en/Learn-Spanish";
  const DS_SUPERBEGINNER = "https://www.youtube.com/@DreamingSpanish/search?query=superbeginner";
  const DS_BEGINNER = "https://www.youtube.com/@DreamingSpanish/search?query=beginner";
  const DS_INTERMEDIATE = "https://www.youtube.com/@DreamingSpanish/search?query=intermediate";
  const DS_SITE = "https://www.dreaming.com/spanish";
  const HELLOTALK = "https://www.hellotalk.com/";
  const TANDEM = "https://www.tandem.net/";

  const TRACKS = 90; // Language Transfer "Complete Spanish"
  const pad = (n) => String(n).padStart(2, "0");

  // ─── One sitting of each kind ──────────────────────────────────────────

  function track(n) {
    return {
      id: `es-lt-${pad(n)}`,
      label: `Language Transfer track ${n}, then one Duolingo lesson`,
      detail: n === 1
        ? "Pause whenever the teacher asks you something and answer out loud before he does. That's the whole method. Then do one Duolingo lesson to see the words written down."
        : "Answer out loud before the student on the recording does. Then one Duolingo lesson.",
      estimatedMinutes: 18,
      url: LT,
      type: "listening"
    };
  }

  function listening(week, url, what) {
    return {
      id: `es-w${pad(week)}-listen`,
      label: `Listening: 30 minutes of ${what}`,
      detail: "Pick anything that looks interesting and understand what you can. Don't pause to look words up; it's meant to feel easy.",
      estimatedMinutes: 30,
      url,
      type: "listening"
    };
  }

  function review(week, what) {
    return {
      id: `es-w${pad(week)}-review`,
      label: "Review the week",
      detail: what,
      estimatedMinutes: 20,
      url: DUO,
      type: "practice"
    };
  }

  function weekdayInput(week, day, url, level) {
    return {
      id: `es-w${pad(week)}-d${day}`,
      label: `One Dreaming Spanish ${level} video, then one Duolingo lesson`,
      detail: "About 15 minutes of video at a level where you follow most of it, then a Duolingo lesson.",
      estimatedMinutes: 18,
      url,
      type: "listening"
    };
  }

  // ─── The weeks ─────────────────────────────────────────────────────────

  let nextTrack = 1;
  let day = 1;

  function week(n, tasks, extra = {}) {
    const mod = {
      id: `es-week-${pad(n)}`,
      name: extra.name || `Week ${n}`,
      dayStart: day,
      dayEnd: day + 6,
      tasks,
      ...(extra.skill ? { skill: extra.skill } : {})
    };
    day += 7;
    return mod;
  }

  // Weekdays: the next Language Transfer track while any are left,
  // otherwise a Dreaming Spanish video.
  function weekdays(n, dsUrl, level) {
    const out = [];
    for (let d = 1; d <= 5; d++) {
      out.push(nextTrack <= TRACKS ? track(nextTrack++) : weekdayInput(n, d, dsUrl, level));
    }
    return out;
  }

  // Term 1 — weeks 1–13: Beginner A1.
  const term1 = [];
  for (let n = 1; n <= 13; n++) {
    const last = n === 13;
    term1.push(week(n, [
      ...weekdays(n),
      listening(n, DS_SUPERBEGINNER, "Dreaming Spanish Superbeginner videos"),
      last
        ? {
            id: "es-t1-exam",
            label: "Term 1 exam: record a 2-minute introduction, no notes",
            detail: "Say who you are, where you live, what you do and why you're learning Spanish. Record it on your phone in one take without notes, then listen back once. Keep the recording: it's your before-picture.",
            estimatedMinutes: 30,
            url: "",
            type: "exam"
          }
        : review(n, "Replay the track you found hardest this week, answering out loud, then do a Duolingo practice session.")
    ], last ? { skill: "Introduce yourself in Spanish for two minutes without notes (A1)" } : {}));
  }

  // Term 2 — weeks 14–26: A1 → A2. Language Transfer finishes (tracks 66–90)
  // in the first five weeks, then weekdays switch to Dreaming Spanish.
  const term2 = [];
  for (let n = 14; n <= 26; n++) {
    const tasks = [
      ...weekdays(n, DS_BEGINNER, "Beginner"),
      listening(n, DS_BEGINNER, "Dreaming Spanish Beginner videos")
    ];
    if (n === 22) {
      tasks.push({
        id: "es-partner",
        label: "Find a language partner on HelloTalk or Tandem",
        detail: "Sign up for one of the two, set Spanish as the language you're learning, and message a few people. You're looking for one person happy to do a 15-minute call in the next few weeks.",
        estimatedMinutes: 30,
        url: HELLOTALK,
        type: "setup"
      });
    } else if (n === 26) {
      tasks.push({
        id: "es-t2-exam",
        label: "Term 2 exam: a 15-minute conversation with your language partner",
        detail: "Fifteen minutes, in Spanish, on a call with your HelloTalk or Tandem partner. Getting stuck and finding another way to say it is the point. Marking this done unlocks German.",
        estimatedMinutes: 30,
        url: TANDEM,
        type: "exam"
      });
    } else {
      tasks.push(review(n, nextTrack <= TRACKS
        ? "Replay the track you found hardest this week, answering out loud, then do a Duolingo practice session."
        : "Retell one video from this week out loud in your own words, then do a Duolingo practice session."));
    }
    term2.push(week(n, tasks, n === 26 ? { skill: "Hold a 15-minute conversation in Spanish (A2)" } : {}));
  }

  // Term 3 — weeks 27–39: A2 → B1. Mostly listening, with a weekly conversation.
  const term3 = [];
  for (let n = 27; n <= 39; n++) {
    term3.push(week(n, [
      ...weekdays(n, DS_INTERMEDIATE, "Intermediate"),
      listening(n, DS_INTERMEDIATE, "Dreaming Spanish Intermediate videos"),
      {
        id: `es-w${pad(n)}-review`,
        label: "Conversation: 20 minutes with your language partner",
        detail: "A call or voice messages on HelloTalk or Tandem. If no one's free, record yourself retelling a video from this week instead.",
        estimatedMinutes: 20,
        url: HELLOTALK,
        type: "practice"
      }
    ], n === 39 ? { skill: "Follow everyday spoken Spanish and talk about familiar topics (towards B1)" } : {}));
  }

  return {
    totalDays: day - 1,
    unit: "week", // the app says "Week 3" here, where Data says "Day 3"

    phases: [
      {
        id: "es-term-1",
        name: "Term 1: Beginner A1",
        shortName: "Term 1",
        dayStart: 1,
        dayEnd: 91,
        estimatedHours: 30,
        why: "Language Transfer builds the sentence-making muscles first; Duolingo puts the words in front of your eyes.",
        deliverableLabel: "Term exam",
        deliverable: "A 2-minute recording of you introducing yourself in Spanish, no notes.",
        modules: term1
      },
      {
        id: "es-term-2",
        name: "Term 2: A1 → A2",
        shortName: "Term 2",
        dayStart: 92,
        dayEnd: 182,
        estimatedHours: 30,
        why: "Lots of easy listening is what turns rules into understanding. Language Transfer finishes in the first five weeks.",
        deliverableLabel: "Term exam",
        deliverable: "One 15-minute conversation with a language partner on HelloTalk or Tandem. Unlocks German.",
        modules: term2
      },
      {
        id: "es-term-3",
        name: "Term 3: A2 → B1",
        shortName: "Term 3",
        dayStart: 183,
        dayEnd: 273,
        estimatedHours: 30,
        why: "Longer, faster listening and a weekly conversation. Keep going past week 39 at the same rhythm.",
        deliverableLabel: "By the end",
        deliverable: "Following everyday Spanish on video without subtitles, and a weekly conversation habit.",
        extras: [
          { label: "Dreaming Spanish", url: DS_SITE, detail: "The full library, sorted by level, if you outgrow YouTube." }
        ],
        modules: term3
      }
    ]
  };
})();
