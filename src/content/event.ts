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
    time: "10:30",
    title: "Registration, Introduction & Kick-Off",
    detail: "Check-In, opening-ceremony, who are we, what are the goals, some input from our side, presentation of the usable data ",
  },
  {
    day: "Tue",
    time: "14:00",
    title: "The Hacking Begins",
    detail: "Start brainstorming, experimenting, building, exchanging and discussing",
  },
  {
    day: "Tue",
    time: "15:00",
    title: "Workshops",
    detail: "One hour after the official start of the Hackathon, we will offer a variety of optional Workshops for sport, hardware assistance, 3D-printing, guidance by mentors and much more! This will be offered on both main hacking days.",
  },
  {
    day: "Wed",
    time: "",
    title: "Hacking, workshops & meals",
    detail: "A full day to build. Workshops run again, mentors are on site",
  },
  {
    day: "Thu",
    time: "14:00",
    title: "Submission & selection of the finalists",
    detail: "Each team will pitch their project to their mentor. This will decide who gets to present their project on the big stage and a potential place on the podium",
  },
  {
    day: "Thu",
    time: "16:00",
    title: "Finale & award ceremony",
    detail: "The selected finalists will pitch their project to the jury and the participants. Afterwards a jury will decide the winners who get their prizes in the following Award Ceremony.",
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
