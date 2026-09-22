import type { Localised } from "./event";

/**
 * The reading list. Each entry is a card with an optional set of documentation
 * links. Placeholders below are sensible starting points — replace them with
 * whatever you actually put on the tables.
 */

export type ResourceLink = {
  label: Localised;
  url: string;
};

export type ResourceItem = {
  name: string;
  summary: Localised;
  /** Shown as a small badge, e.g. a quantity or a category. */
  badge?: Localised;
  links: ResourceLink[];
};

const docs = (de: string, en = de): Localised => ({ de, en });

export const hardware: ResourceItem[] = [
  {
    name: "senseBox MCU-S2",
    summary: docs(
      "Mikrocontroller-Board mit ESP32-S2, für Sensorik und WLAN-Projekte.",
      "ESP32-S3 based Microcontroller board, for sensor and Wi-Fi projects.",
    ),
    badge: docs("Mikrocontroller", "Microcontroller"),
    links: [
      { label: docs("Dokumentation", "Documentation"), url: "https://docs.sensebox.de/docs/boards/mcus2/mcu-s2-overview?board=edus2" },
      { label: docs("Blockly-Editor", "Blockly editor"), url: "https://blockly.sensebox.de/" },
    ],
  },
  {
    name: "senseBox MCU Eye",
    summary: docs(
      "Mikrocontroller-Board mit ESP32-S3 und Kamera.",
      "ESP32-S3 based Microcontroller board with a camera.",
    ),
    badge: docs("Mikrocontroller", "Microcontroller"),
    links: [
      { label: docs("Dokumentation", "Documentation"), url: "https://docs.sensebox.de/docs/boards/eye/eye-overview?board=eye" },
      { label: docs("Blockly-Editor", "Blockly editor"), url: "https://blockly.sensebox.de/" },
    ],
  }
];

export const software: ResourceItem[] = [
  {
    name: "openSenseMap",
    summary: docs(
      "Offene Plattform für Umweltmessdaten. Daten hochladen, abrufen und visualisieren.",
      "Open platform for environmental measurements. Upload, query and visualise data.",
    ),
    badge: docs("Plattform & API", "Platform & API"),
    links: [
      { label: docs("Website", "Website"), url: "https://opensensemap.org/" },
      { label: docs("API-Doku", "API docs"), url: "https://docs.opensensemap.org/" },
    ],
  },
  {
    name: "Kepler.gl",
    summary: docs(
      "Open-Source-Geodatenvisualisierungstool.",
      "Open-source geodata visualisation tool.",
    ),
    badge: docs("Werkzeug", "Tooling"),
    links: [
      { label: docs("Website", "Website"), url: "https://kepler.gl/" },
    ],
  },
  {
    name: docs("Karten & Geodaten", "Maps & geodata").de,
    summary: docs(
      "OpenStreetMap, Leaflet und MapLibre für alles Kartenbasierte.",
      "OpenStreetMap, Leaflet and MapLibre for anything map-based.",
    ),
    badge: docs("Bibliotheken", "Libraries"),
    links: [
      { label: docs("Leaflet", "Leaflet"), url: "https://leafletjs.com/" },
      { label: docs("MapLibre", "MapLibre"), url: "https://maplibre.org/" },
      { label: docs("Overpass Turbo", "Overpass Turbo"), url: "https://overpass-turbo.eu/" },
    ],
  },
  {
    name: docs("Offene Datenquellen", "Open data sources").de,
    summary: docs(
      "Wetter, Verkehr, Verwaltung — gute Startpunkte für datengetriebene Projekte.",
      "Weather, transport, public administration — good starting points for data projects.",
    ),
    badge: docs("Daten", "Data"),
    links: [
      { label: docs("GovData", "GovData"), url: "https://www.govdata.de/" },
      { label: docs("DWD Open Data", "DWD Open Data"), url: "https://opendata.dwd.de/" },
      { label: docs("Open-Meteo", "Open-Meteo"), url: "https://open-meteo.com/" },
    ],
  },
];

/** A flat list of "read this if you have ten minutes" links. */
export const furtherReading: ResourceLink[] = [
  { label: docs("Git in 15 Minuten", "Git in 15 minutes"), url: "https://rogerdudler.github.io/git-guide/" },
  { label: docs("Wie man ein Projekt pitcht", "How to pitch a project"), url: "https://www.ted.com/" },
];
