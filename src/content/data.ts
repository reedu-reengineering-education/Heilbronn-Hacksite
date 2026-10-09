/**
 * The datasets available during the hackathon week. Each entry gets a
 * flip card: the front shows an image, a short description and the kinds of
 * measurements; the back lists the data endpoints and the documentation links.
 *
 * Images are placeholders — drop a real one at the same path under
 * `public/data/` (any image format works, just update `image` below if you
 * change the filename) and it replaces the placeholder automatically.
 */

import type { ResourceLink } from "./resources";

export type DataEndpoint = {
  label: string;
  url: string;
  description: string;
};

export type DataSource = {
  name: string;
  /** Path under /public, e.g. "/data/sensebox-bike.jpg". */
  image: string;
  summary: string;
  /** Kinds of data that were measured, e.g. "Temperature". */
  measurements: string[];
  /** Where to get the data, each with a brief description. */
  endpoints: DataEndpoint[];
  /** Documentation and further info, shown at the bottom of the back. */
  docs: ResourceLink[];
  /** Internal path of a detail page explaining the data, linked on the back. */
  guide?: string;
};

export const dataSources: DataSource[] = [
  {
    name: "senseBox:bike",
    image: "/data/sensebox-bike.jpg",
    summary:
      "Bike-mounted sensor box that logs environmental data, street surface type and overtaking cars while riding through the city.",
    measurements: [
      "Air quality (PM)",
      "Temperature",
      "Humidity",
      "Street surface type",
      "Overtaking likelihood",
      "Overtaking distance",
      "GPS tracks",
    ],
    endpoints: [],
    docs: [
      { label: "map with data", url: "https://data.atrai.bike/" },
      { label: "About the device", url: "https://sensebox.de/de/products-bike" },
    ],
    guide: "/resources/bike-data",
  },
  {
    name: "Mobile Datalogger",
    image: "/data/hitzeinsel-logger.png",
    summary:
      "Mobile temperature and humidity sensor, to be carried around while walking through the city.",
    measurements: ["Temperature", "Humidity"],
    endpoints: [
      {
        label: "Heat-Island-Summerschool 2026",
        url: "https://cloud.reedu.de/s/X9x2XE9a9xCxLm8",
        description: "Logged walks from the Heat-Island Summerschool 2026.",
      },
    ],
    docs: [{ label: "About the device", url: "https://sensebox.de/de/products-datalogger" }],
  },
  {
    name: "senseBox:home",
    image: "/data/sensebox-home.png",
    summary:
      "Stationary weather stations run by residents and schools, measuring around the clock.",
    measurements: ["Temperature", "Humidity", "Air pressure", "Air quality (PM)"],
    endpoints: [
      {
        label: "senseBox:home data",
        url: "https://api.atrai.bike/collections/osem_home_data_heilbronn/items?f=json&limit=1000000",
        description: "Data of all registered senseBoxes in Heilbronn.",
      },
    ],
    docs: [{ label: "Hardware Documentation", url: "https://docs.sensebox.de/docs/products/home/home-overview?board=home" }],
  },
  {
    name: "Smart Birdhouses",
    image: "/data/smarte-vogelhaeuser.jpeg",
    summary:
      "Smart bird houses all over Heilbronn that log visits and conditions, giving a window into how urban wildlife responds to the changing climate.",
    measurements: ["Bird pictures", "Visits", "Temperature", "Humidity"],
    endpoints: [
      { label: "Starter notebook (Colab)", url: "https://colab.research.google.com/github/reedu-reengineering-education/Heilbronn-Hacksite/blob/main/public/birdiary_starter.ipynb", description: "Python notebook that that gives a brief overview over usage of the Birdiary API." },
      { label: "Starter notebook (Github)", url: "https://github.com/reedu-reengineering-education/Heilbronn-Hacksite/blob/main/public/birdiary_starter.ipynb", description: "Alternative link to that same notebook." },
    ],
    docs: [
      { label: "Project Page", url: "https://wiediversistmeingarten.org/" },
      { label: "Map of all stations", url: "https://wiediversistmeingarten.org/view/" },
      { label: "Code", url: "https://github.com/Birdiary" },
      { label: "Green City Dashboard", url: "https://greencity.hn/sammlung/biodiversitt" }],
  },
  {
    name: "Smart Beehive",
    image: "/data/smart-beehive.jpg",
    summary:
      "Sensor-equipped beehive at the OpenSpace, plus experimental entrance videos with labelled bee activity for machine learning.",
    measurements: ["Temperature", "Humidity", "Entrance videos", "Bee activity labels"],
    endpoints: [
      { label: "Sensor data", url: "https://beehive-grafana-production.up.railway.app/goto/XqTJWzrDR?orgId=1", description: "Environmental data inside and outside of three beehives around the OpenSpace." },
      { label: "Labelled entrance videos", url: "https://cloud.reedu.de/s/YkHckREGAM89z9m", description: "Beehive entrance videos recorded with the senseBox MCU Eye. Potentially useful for machine learning." },
    ],
    docs: [],
  },
  {
    name: "and more!",
    image: "/resources/more.png",
    summary:
      "Public datasets that complement the sensor data above, for Heilbronn and beyond.",
    measurements: ["Weather", "Transport", "Administrative data", "..."],
    endpoints: [
      { label: "GovData", url: "https://www.govdata.de/", description: "German open government data portal." },
      { label: "DWD Open Data", url: "https://opendata.dwd.de/", description: "Weather service observations and forecasts." },
      { label: "Open-Meteo", url: "https://open-meteo.com/", description: "Free weather API with historic data." },
    ],
    docs: [],
  },
];
