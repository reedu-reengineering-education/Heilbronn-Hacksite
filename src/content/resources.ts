/**
 * The reading list. Each entry is a card with an optional set of documentation
 * links. Placeholders below are sensible starting points — replace them with
 * whatever you actually put on the tables.
 */

export type ResourceLink = {
  label: string;
  url: string;
};

export type ResourceItem = {
  name: string;
  summary: string;
  /** Shown as a small badge, e.g. a quantity or a category. */
  badge?: string;
  links: ResourceLink[];
};

const docs = (en: string): string => en;

export const hardware: ResourceItem[] = [
  {
    name: "senseBox MCU-S2",
    summary: docs("ESP32-S3 based Microcontroller board, for sensor and Wi-Fi projects."),
    badge: docs("Microcontroller"),
    links: [
      { label: docs("Documentation"), url: "https://docs.sensebox.de/docs/boards/mcus2/mcu-s2-overview?board=edus2" },
      { label: docs("Blockly editor"), url: "https://blockly.sensebox.de/" },
    ],
  },
  {
    name: "senseBox MCU Eye",
    summary: docs("ESP32-S3 based Microcontroller board with a camera."),
    badge: docs("Microcontroller"),
    links: [
      { label: docs("Documentation"), url: "https://docs.sensebox.de/docs/boards/eye/eye-overview?board=eye" },
      { label: docs("Blockly editor"), url: "https://blockly.sensebox.de/" },
    ],
  }
];

export const software: ResourceItem[] = [
  {
    name: "openSenseMap",
    summary: docs(
      "Open platform for environmental measurements. Upload, query and visualise data.",
    ),
    badge: docs("Platform & API"),
    links: [
      { label: docs("Website"), url: "https://opensensemap.org/" },
      { label: docs("API docs"), url: "https://docs.opensensemap.org/" },
    ],
  },
  {
    name: "Kepler.gl",
    summary: docs("Open-source geodata visualisation tool."),
    badge: docs("Tooling"),
    links: [
      { label: docs("Website"), url: "https://kepler.gl/" },
    ],
  },
  {
    name: docs("Maps & geodata"),
    summary: docs("OpenStreetMap, Leaflet and MapLibre for anything map-based."),
    badge: docs("Libraries"),
    links: [
      { label: docs("Leaflet"), url: "https://leafletjs.com/" },
      { label: docs("MapLibre"), url: "https://maplibre.org/" },
      { label: docs("Overpass Turbo"), url: "https://overpass-turbo.eu/" },
    ],
  },
  {
    name: docs("Open data sources"),
    summary: docs(
      "Weather, transport, public administration — good starting points for data projects.",
    ),
    badge: docs("Data"),
    links: [
      { label: docs("GovData"), url: "https://www.govdata.de/" },
      { label: docs("DWD Open Data"), url: "https://opendata.dwd.de/" },
      { label: docs("Open-Meteo"), url: "https://open-meteo.com/" },
    ],
  },
];

/** A flat list of "read this if you have ten minutes" links. */
export const furtherReading: ResourceLink[] = [
  { label: docs("Git in 15 minutes"), url: "https://rogerdudler.github.io/git-guide/" },
  { label: docs("How to pitch a project"), url: "https://www.ted.com/" },
];
