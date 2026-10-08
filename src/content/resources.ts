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
  /** Shown on the front of the flip card. */
  image?: string;
  summary: string;
  /** Shown as a small badge, e.g. a quantity or a category. */
  badge?: string;
  links: ResourceLink[];
};

const docs = (en: string): string => en;

export const hardware: ResourceItem[] = [
  {
    name: "senseBox MCU-S2",
    image: "/resources/senseBox-MCU-S2.jpg",
    summary: docs("ESP32-S2 based Microcontroller board, for sensor and Wi-Fi projects."),
    badge: docs("Microcontroller"),
    links: [
      { label: docs("Documentation"), url: "https://docs.sensebox.de/docs/boards/mcus2/mcu-s2-overview?board=edus2" },
      { label: docs("Example Scripts"), url: "https://github.com/sensebox/senseBox-MCU-S2-ESP32S2/tree/main/examples" },
    ],
  },
  {
    name: "senseBox MCU Eye",
    image: "/resources/senseBox-MCU-Eye.jpg",
    summary: docs("ESP32-S3 based Microcontroller board with a camera."),
    badge: docs("Microcontroller"),
    links: [
      { label: docs("Documentation"), url: "https://docs.sensebox.de/docs/boards/eye/eye-overview?board=eye" },
      { label: docs("Example Scripts"), url: "https://github.com/sensebox/senseBox_Eye/tree/main/examples" },
    ],
  },
  {
    name: "senseBox Sensors",
    image: "/resources/senseBox-Sensors.png",
    summary: docs("There exist many different sensors for the senseBox. Ask a Mentor which ones are available."),
    badge: docs("Sensors"),
    links: [
      { label: docs("Temperature+Humidity"), url: "https://docs.sensebox.de/en/docs/hardware/sensors/temperatur-luftfeuchte/?board=edus2" },
      { label: docs("Brightness+UV"), url: "https://docs.sensebox.de/en/docs/hardware/sensors/helligkeit-uv/?board=edus2" },
      { label: docs("Pressure+Temperature"), url: "https://docs.sensebox.de/en/docs/hardware/sensors/luftdruck-temperatur/?board=edus2" },
      { label: docs("Distance"), url: "https://docs.sensebox.de/en/docs/hardware/sensors/tof/?board=edus2" },
      { label: docs("Air Quality"), url: "https://docs.sensebox.de/en/docs/hardware/sensors/feinstaub-sps30?board=bike" },
    ],
  },
  {
    name: "senseBox Display & LED Matrix",
    image: "/resources/senseBox-Display-LED.png",
    summary: docs("On an OLED display, you can show text, images, and other information.\nThe LED Matrix can be used to display simple pixel graphics and animations."),
    badge: docs("Peripherals"),
    links: [
      { label: docs("Documentation"), url: "https://docs.sensebox.de/docs/boards/mcus2/mcu-s2-overview?board=edus2" },
    ],
  },
  {
    name: "senseBox Battery",
    image: "/resources/senseBox-Battery.jpg",
    summary: docs("For powering your senseBox without a USB cable, you can use a battery. The battery is rechargeable."),
    badge: docs("Peripherals"),
    links: [
      { label: docs("Documentation"), url: "https://docs.sensebox.de/docs/boards/mcus2/mcu-s2-overview?board=edus2" },
    ],
  },
  {
    name: "and more!",
    image: "/resources/more.png",
    summary: docs("senseBox MCUs and peripherals use standard connectors, so you can connect them with other boards (e.g. Arduino) or peripherals (e.g. Adafruit sensors)."),
    badge: docs("???"),
    links: [],
  }
];

export const software: ResourceItem[] = [
  {
    name: "openSenseMap",
    image: "/software/osem.png",
    summary: docs(
      "Open platform for environmental measurements. Upload, query and visualise data.  \n Please note that the current version is approaching its end-of-life and might occasionally be slow or unresponsive. The new experimental website will eventually replace it, but so far includes only a very limited dataset.",
    ),
    badge: docs("Platform & API"),
    links: [
      { label: docs("Website"), url: "https://opensensemap.org/" },
      { label: docs("New Experimental Website"), url: "https://staging.opensensemap.org/" },
      { label: docs("API docs"), url: "https://docs.opensensemap.org/" },
    ],
  },
  {
    name: "Kepler.gl",
    image: "/software/kepler-gl.png",
    summary: docs("Open-source geodata visualisation tool. Either integrate it into your own web app, or use their hosted demo to visualise your data."),
    badge: docs("Tooling"),
    links: [
      { label: docs("Website"), url: "https://kepler.gl/" },
    ],
  },
  {
    name: "Arduino IDE",
    image: "/software/arduino.png",
    summary: docs("The Arduino IDE is a cross-platform application that enables users to write code and upload it to the board (e.g. to senseBox MCUs)."),
    badge: docs("Tooling"),
    links: [
      { label: docs("Website"), url: "https://www.arduino.cc/en/software" },
    ],
  },
  {
    name: docs("and more!"),
    image: "/resources/more.png",
    summary: docs("For example use OpenStreetMap, Leaflet and MapLibre for anything map-based."),
    badge: docs("Libraries"),
    links: [
      { label: docs("Leaflet"), url: "https://leafletjs.com/" },
      { label: docs("MapLibre"), url: "https://maplibre.org/" },
      { label: docs("Overpass Turbo"), url: "https://overpass-turbo.eu/" },
    ],
  }
];

/** A flat list of "read this if you have ten minutes" links. */
export const furtherReading: ResourceLink[] = [
  { label: docs("Git in 15 minutes"), url: "https://rogerdudler.github.io/git-guide/" },
  { label: docs("How to pitch a project"), url: "https://www.ted.com/" },
];
