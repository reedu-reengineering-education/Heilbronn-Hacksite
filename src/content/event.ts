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
  /** Day label, e.g. "Tue" */
  day: string;
  time: string;
  title: string;
  detail?: string;
  /** Highlighted entries get an accent border — use for the big moments. */
  highlight?: boolean;
};

export const schedule: ScheduleEntry[] = [
  {
    day: "Tue",
    time: "11:00 - 11:15",
    title: "Arrive & coffee",
    detail: "Check-in.",
  },
  {
    day: "Tue",
    time: "11:15 - 13:00",
    title: "Kickoff & ideas",
    detail: "Introductions, topics, forming teams.",
  },
  {
    day: "Tue",
    time: "14:00 - 18:00",
    title: "Hacking",
    highlight: true,
  },
  {
    day: "Wed",
    time: "09:00 - 09:30",
    title: "Stand-up",
    detail: "Presentation of the interim results.",
  },
  {
    day: "Wed",
    time: "09:30 - 18:00",
    title: "Hacking",
    highlight: true,
  },
  {
    day: "Thu",
    time: "09:00 - 09:30",
    title: "Stand-up",
    detail: "Presentation of the interim results.",
  },
  {
    day: "Thu",
    time: "09:30 - 15:00",
    title: "Hacking",
    highlight: true,
  },
  {
    day: "Fri",
    time: "15:00 - 17:00",
    title: "Final presentations",
  },
  {
    day: "Fri",
    time: "17:00 - 18:00",
    title: "Awards & wrap-up",
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
  {
    question: "What are the points and the leaderboard about?",
    answer:
      "There are small games between working sessions. Points from those count for your team — purely for fun, separate from how projects are judged.",
  },
];
