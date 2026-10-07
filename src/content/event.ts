/**
 * Everything factual about the event lives here so that changing a room number
 * or a start time never means touching a component.
 */

export const event = {
  /** Shown in the hero and the <title>. */
  name: "Green City Hackathon",

  tagline: "Data for the Heilbronn of Tomorrow.",

  /** External registration form (Invitario). */
  registrationUrl:
    "https://live.invitario.com/en/green-city-hackathon-data-for-the-heilbronn-of-tomorrow-ages-16/registration",

  /** Free-text answer to "what is this?" — a short paragraph or two. */
  about:
    "The Green City Hackathon is part of the Green City Heilbronn, a collaborative project by Arkadia, re:edu and aim. Together with local residents, environmental data is collected, visualised and used to help shape the city. At the hackathon, you will build on this work and develop your own ideas based on real data from Heilbronn. Over three days, you will analyse, programme, visualise and discuss. After a joint introduction, you will get started straight away: developing questions, working in a team with datasets on topics such as temperature, particulate matter or urban greening, and turning your ideas step by step into a prototype. Whether you create interactive maps, dashboards or imaginative applications, there are no limits to your creativity. Experienced mentors will support you throughout, helping with questions, technology and implementation. Food and refreshments will be provided for the entire event. The ideas and prototypes developed at the hackathon will be more than one-off results. They will feed into the ongoing work of the Green City Heilbronn initiative and help make environmental data visible and useful in the long term. This means you will become part of a project that presents environmental data in an accessible way and makes it available to the wider community. You can find an initial overview of the environmental data at greencity.hn.",

  /** Human-readable date range, plus a machine-readable ISO start for <time>. */
  dates: "Tuesday 27 – Thursday 29 October 2026",
  startIso: "2026-10-27T11:00:00+02:00",
  endIso: "2026-10-29T18:00:00+02:00",

  venue: {
    name: "Open Space Heilbronn",
    address: "Weipertstraße 8-10, Heilbronn",
    /** Any maps link; used for the "getting there" button. */
    mapsUrl: "https://www.openstreetmap.org/search?query=Heilbronn",
    travel:
      "Take the tram from Heilbronn main station; the stop will be announced. Parking is limited — the train or a bike is your best bet.",
  },

  contact: {
    email: "hallo@example.org",
    /** Optional chat link (Matrix, Discord, …). Leave empty to hide. */
    chatUrl: "",
    chatLabel: "Team chat",
  },

  /** Footer links. Add or remove freely. */
  legal: {
    organisation: "reedu GmbH & Co. KG",
  },
} as const;

/* -------------------------------------------------------------- schedule */

export type ScheduleEntry = {
  /** "HH:MM" */
  start: string;
  /** "HH:MM"; leave out for an open end. */
  end?: string;
  title: string;
  detail?: string;
  /** Breaks (meals etc.) are shown in the accent colour. */
  isBreak?: boolean;
};

export type ScheduleDay = {
  /** Short weekday, e.g. "Tue" */
  day: string;
  date: string;
  title: string;
  /** Shown on the front of the card; the entries are on the back. */
  summary: string;
  entries: ScheduleEntry[];
};

export const schedule: ScheduleDay[] = [
  {
    day: "Tue",
    date: "27 Oct 2026",
    title: "Kick-off & orientation",
    summary:
      "Registration, welcome and an introduction to the data and sensors. Pitch your ideas, form teams and start hacking — with the first optional workshops in the afternoon.",
    entries: [
      {
        start: "10:00",
        end: "12:00",
        title: "Registration",
        detail: "Check in at the accreditation desk.",
      },
      {
        start: "11:00",
        end: "11:30",
        title: "Welcome & opening",
        detail: "Who are we? What are the goals for these three days? An overview of what's ahead.",
      },
      {
        start: "11:30",
        end: "12:00",
        title: "Input: what do we have?",
        detail:
          "An introduction to the available datasets (temperature, particulate matter, urban greening, traffic) and sensors (senseBox etc.). What can you do with them, and what sources of error should you watch out for?",
      },
      {
        start: "12:00",
        end: "12:30",
        title: "Inspiration round",
        detail: "30 minutes to explore freely: What interests me? What would I like to investigate or build?",
      },
      {
        start: "12:00",
        end: "13:00",
        title: "🍽️ Lunch break (pizza)",
        isBreak: true,
      },
      {
        start: "13:00",
        end: "13:30",
        title: "Activation training",
      },
      {
        start: "13:00",
        end: "13:30",
        title: "Pitch your ideas",
        detail:
          "Everyone submits their ideas through a shared online board and presents them on stage. Teams show whether they still have room or need people with particular skills.",
      },
      {
        start: "13:30",
        end: "14:00",
        title: "Team building",
        detail:
          "Ideas are clustered and teams form around them. Several teams can work on the same idea, and not every idea will be built.",
      },
      {
        start: "14:00",
        end: "15:00",
        title: "Work phase 1",
        detail:
          "The hacking begins: explore the data, ask your first questions and decide on your approach. Mentors are on hand.",
      },
      {
        start: "15:00",
        end: "15:30",
        title: "Workshop slot 1 (optional)",
        detail: "Pick a workshop that interests you.",
      },
      {
        start: "17:30",
        end: "18:00",
        title: "Daily check-in",
        detail: "A short stand-up: What did we do today? What's next tomorrow?",
      },
      {
        start: "18:00",
        end: "18:30",
        title: "🍽️ Dinner (catering)",
        isBreak: true,
      },
      {
        start: "18:30",
        title: "Open end",
      },
    ],
  },
  {
    day: "Wed",
    date: "28 Oct 2026",
    title: "Deep work",
    summary:
      "A full day to build: data analysis, visualisation and prototyping, with mentors rotating between teams and a second round of optional workshops.",
    entries: [
      {
        start: "10:00",
        end: "12:00",
        title: "Work phase 2",
        detail:
          "The main work phase. Teams go deeper: data analysis, visualisation, prototyping. Mentors rotate between teams.",
      },
      {
        start: "12:00",
        end: "13:00",
        title: "🍽️ Lunch break (catering)",
        isBreak: true,
      },
      {
        start: "13:00",
        end: "13:30",
        title: "Activation training",
      },
      {
        start: "13:00",
        end: "13:30",
        title: "Workshop slot 2 (optional)",
        detail: "Pick a workshop that interests you.",
      },
      {
        start: "13:30",
        end: "17:00",
        title: "Work phase 3",
        detail: "Focus on results: What will we show tomorrow? Start developing ideas for your presentation.",
      },
      {
        start: "17:30",
        end: "18:00",
        title: "Daily check-in",
        detail: "Stand-up: What's still left to do for tomorrow?",
      },
      {
        start: "18:00",
        end: "18:30",
        title: "🍽️ Dinner (pizza)",
        isBreak: true,
      },
      {
        start: "18:30",
        title: "Open end",
      },
    ],
  },
  {
    day: "Thu",
    date: "29 Oct 2026",
    title: "Wrap-up & pitch",
    summary:
      "Last work phases and the selection of the finalists, then the finale on stage, the jury's decision and the award ceremony.",
    entries: [
      {
        start: "10:00",
        end: "12:00",
        title: "Work phase 4",
      },
      {
        start: "12:00",
        end: "13:00",
        title: "🍽️ Lunch break (catering)",
        isBreak: true,
      },
      {
        start: "13:00",
        end: "14:00",
        title: "Final work phase",
      },
      {
        start: "14:00",
        end: "15:00",
        title: "Submission & selection of the finalists",
        detail:
          "Each team pitches its project to its mentor. This decides who presents on the big stage and has a chance at the podium.",
      },
      {
        start: "15:00",
        end: "16:00",
        title: "Final work phase",
        detail: "Last touches. We provide a slide template for your presentation.",
      },
      {
        start: "16:00",
        end: "17:00",
        title: "🏆 Finale",
        detail: "The finalist teams present their results on stage (about 5–10 minutes per team).",
      },
      {
        start: "17:00",
        end: "17:30",
        title: "Jury deliberation",
      },
      {
        start: "17:30",
        end: "18:00",
        title: "Award ceremony & certificates",
        detail: "Prizes for the winning teams and certificates of participation for everyone.",
      },
    ],
  },
];

/* ------------------------------------------------------------------- faq */

export type FaqEntry = { question: string; answer: string };

export const faq: FaqEntry[] = [
  {
    question: "Do I need prior experience?",
    answer:
      "No. It helps if someone on your team has programmed before, but we will support you with everything else.",
  },
  {
    question: "What should I bring?",
    answer: "A laptop and a charger. We provide hardware, tools and food.",
  },
  {
    question: "How large should a team be?",
    answer: "Three to five people works best. You can also team up on the day.",
  },
];

/* ---------------------------------------------------------- organisations */

export const organisations = [
  { name: "Arkadia", logo: "/organisations/arkadia.svg", link: "https://arkadia.hn/" },
  { name: "aim", logo: "/organisations/aim.png", link: "https://www.aim-akademie.org/" },
  { name: "re:edu", logo: "/organisations/reedu.png", link: "https://reedu.de/" },
] as const;
