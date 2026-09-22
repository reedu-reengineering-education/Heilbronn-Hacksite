import type { Locale } from "@/i18n/config";

/**
 * Everything factual about the event lives here so that changing a room number
 * or a start time never means touching a component. Every user-facing string is
 * `{ de, en }`.
 */

export type Localised = Record<Locale, string>;

export const event = {
  /** Shown in the hero and the <title>. */
  name: {
    de: "Green City Hackathon",
    en: "Green City Hackathon",
  } satisfies Localised,

  tagline: {
    de: "Daten für das Heilbronn von morgen.",
    en: "Data for the Heilbronn of Tomorrow.",
  } satisfies Localised,

  /** External registration form (Invitario). */
  registrationUrl:
    "https://live.invitario.com/en/green-city-hackathon-data-for-the-heilbronn-of-tomorrow-ages-16/registration",

  /** Free-text answer to "what is this?" — a short paragraph or two. */
  about: {
    de: "Der Green City Hackathon ist Teil von „Green City Heilbronn“, einem Gemeinschaftsprojekt von Arkadia, re:edu und aim. Gemeinsam mit den Einwohnern vor Ort werden Umweltdaten gesammelt, visualisiert und zur Mitgestaltung der Stadt genutzt. Beim Hackathon knüpfst du an diese Arbeit an und entwickelst deine eigenen Ideen auf der Grundlage realer Daten aus Heilbronn. Drei Tage lang wirst du analysieren, programmieren, visualisieren und diskutieren. Nach einer gemeinsamen Einführung geht es direkt los: Ihr entwickelt Fragestellungen, arbeitet im Team mit Datensätzen zu Themen wie Temperatur, Feinstaub oder Stadtbegrünung und setzt eure Ideen Schritt für Schritt in einen Prototyp um. Ob ihr interaktive Karten, Dashboards oder fantasievolle Anwendungen erstellt – eurer Kreativität sind keine Grenzen gesetzt. Erfahrene Mentoren unterstützen euch dabei und helfen euch bei Fragen, technischen Aspekten und der Umsetzung. Für Verpflegung und Erfrischungen ist während der gesamten Veranstaltung gesorgt. Die beim Hackathon entwickelten Ideen und Prototypen werden mehr sein als einmalige Ergebnisse. Sie fließen in die laufende Arbeit der Initiative „Green City Heilbronn“ ein und tragen dazu bei, Umweltdaten langfristig sichtbar und nutzbar zu machen. Damit werden Sie Teil eines Projekts, das Umweltdaten auf anschauliche Weise präsentiert und der breiten Öffentlichkeit zugänglich macht. Einen ersten Überblick über die Umweltdaten finden Sie unter greencity.hn.",
    en: "The Green City Hackathon is part of the Green City Heilbronn, a collaborative project by Arkadia, re:edu and aim. Together with local residents, environmental data is collected, visualised and used to help shape the city. At the hackathon, you will build on this work and develop your own ideas based on real data from Heilbronn. Over three days, you will analyse, programme, visualise and discuss. After a joint introduction, you will get started straight away: developing questions, working in a team with datasets on topics such as temperature, particulate matter or urban greening, and turning your ideas step by step into a prototype. Whether you create interactive maps, dashboards or imaginative applications, there are no limits to your creativity. Experienced mentors will support you throughout, helping with questions, technology and implementation. Food and refreshments will be provided for the entire event. The ideas and prototypes developed at the hackathon will be more than one-off results. They will feed into the ongoing work of the Green City Heilbronn initiative and help make environmental data visible and useful in the long term. This means you will become part of a project that presents environmental data in an accessible way and makes it available to the wider community. You can find an initial overview of the environmental data at greencity.hn.",
  } satisfies Localised,

  /** Human-readable date range, plus a machine-readable ISO start for <time>. */
  dates: {
    de: "Dienstag, 27. – Donnerstag, 29. Oktober 2026",
    en: "Tuesday 27 – Thursday 29 October 2026",
  } satisfies Localised,
  startIso: "2026-10-27T11:00:00+02:00",
  endIso: "2026-10-29T18:00:00+02:00",

  venue: {
    name: {
      de: "Open Space Heilbronn",
      en: "Open Space Heilbronn",
    } satisfies Localised,
    address: {
      de: "Weipertstraße 8-10, Heilbronn",
      en: "Weipertstraße 8-10, Heilbronn",
    } satisfies Localised,
    /** Any maps link; used for the "getting there" button. */
    mapsUrl: "https://www.openstreetmap.org/search?query=Heilbronn",
    travel: {
      de: "Vom Hauptbahnhof Heilbronn mit der Stadtbahn, Haltestelle folgt. Parkplätze sind begrenzt — kommt am besten mit Bahn oder Rad.",
      en: "Take the tram from Heilbronn main station; the stop will be announced. Parking is limited — the train or a bike is your best bet.",
    } satisfies Localised,
  },

  contact: {
    email: "hallo@example.org",
    /** Optional chat link (Matrix, Discord, …). Leave empty to hide. */
    chatUrl: "",
    chatLabel: {
      de: "Team-Chat",
      en: "Team chat",
    } satisfies Localised,
  },

  /** Footer links. Add or remove freely. */
  legal: {
    organisation: "reedu GmbH & Co. KG",
  },
} as const;

/* -------------------------------------------------------------- schedule */

export type ScheduleEntry = {
  /** Day label, e.g. "Mo 13.10." */
  day: Localised;
  time: string;
  title: Localised;
  detail?: Localised;
  /** Highlighted entries get an accent border — use for the big moments. */
  highlight?: boolean;
};

export const schedule: ScheduleEntry[] = [
  {
    day: { de: "Di", en: "Tue" },
    time: "11:00 - 11:15",
    title: { de: "Ankommen & Kaffee", en: "Arrive & coffee" },
    detail: {
      de: "Anmeldung.",
      en: "Check-in.",
    },
  },
  {
    day: { de: "Di", en: "Tue" },
    time: "11:15 - 13:00",
    title: { de: "Kick-off & Ideen", en: "Kickoff & ideas" },
    detail: {
      de: "Vorstellung, Themen, Teambildung.",
      en: "Introductions, topics, forming teams.",
    },
  },
  {
    day: { de: "Di", en: "Tue" },
    time: "14:00 - 18:00",
    title: { de: "Hacking", en: "Hacking" },
    highlight: true,
  },
  {
    day: { de: "Mi", en: "Wed" },
    time: "09:00 - 09:30",
    title: { de: "Stand-up", en: "Stand-up" },
    detail: {
      de: "Vorstellung des Zwischenstands.",
      en: "Presentation of the interim results.",
    },
  },
  {
    day: { de: "Mi", en: "Wed" },
    time: "09:30 - 18:00",
    title: { de: "Hacking", en: "Hacking" },
    highlight: true,
  },
  {
    day: { de: "Do", en: "Thu" },
    time: "09:00 - 09:30",
    title: { de: "Stand-up", en: "Stand-up" },
    detail: {
      de: "Vorstellung des Zwischenstands.",
      en: "Presentation of the interim results.",
    },
  },
  {
    day: { de: "Do", en: "Thu" },
    time: "09:30 - 15:00",
    title: { de: "Hacking", en: "Hacking" },
    highlight: true,
  },
  {
    day: { de: "Fr", en: "Fri" },
    time: "15:00 - 17:00",
    title: { de: "Abschlusspräsentationen", en: "Final presentations" },
  },
  {
    day: { de: "Fr", en: "Fri" },
    time: "17:00 - 18:00",
    title: { de: "Siegerehrung & Ausklang", en: "Awards & wrap-up" },
  },
];

/* ------------------------------------------------------------------- faq */

export type FaqEntry = { question: Localised; answer: Localised };

export const faq: FaqEntry[] = [
  {
    question: {
      de: "Brauche ich Vorkenntnisse?",
      en: "Do I need prior experience?",
    },
    answer: {
      de: "Nein. Es hilft, wenn im Team jemand schon einmal programmiert hat, aber wir unterstützen euch bei allem Weiteren.",
      en: "No. It helps if someone on your team has programmed before, but we will support you with everything else.",
    },
  },
  {
    question: {
      de: "Was soll ich mitbringen?",
      en: "What should I bring?",
    },
    answer: {
      de: "Einen Laptop und ein Ladegerät. Hardware, Werkzeug und Verpflegung stellen wir.",
      en: "A laptop and a charger. We provide hardware, tools and food.",
    },
  },
  {
    question: {
      de: "Wie groß sollte ein Team sein?",
      en: "How large should a team be?",
    },
    answer: {
      de: "Drei bis fünf Personen funktionieren am besten. Ihr könnt euch auch vor Ort zusammenfinden.",
      en: "Three to five people works best. You can also team up on the day.",
    },
  },
  {
    question: {
      de: "Was ist mit den Punkten und der Bestenliste?",
      en: "What are the points and the leaderboard about?",
    },
    answer: {
      de: "Zwischen den Arbeitsphasen gibt es kleine Spiele. Punkte daraus zählen für euer Team — reiner Spaß, unabhängig von der Projektbewertung.",
      en: "There are small games between working sessions. Points from those count for your team — purely for fun, separate from how projects are judged.",
    },
  },
];
