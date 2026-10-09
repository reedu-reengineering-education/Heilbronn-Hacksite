/**
 * Content of the bike data guide (/resources/bike-data). Strings may use
 * `code` and **bold**, which the page renders as inline markup.
 */

export const BIKE_API_URL = "https://api.atrai.bike";

export const bikeGuide = {
  title: "senseBox:bike campaign data",
  intro: [
    "The **senseBox:bike** is a bike mounted sensorbox. While cycling, the box records **GPS position**, **speed**, **fine dust** (PM1–PM10), **temperature & humidity**, how close **cars overtake** (distance sensor + AI detection) and what kind of **road surface** they ride on (AI classification ofasphalt, paving, compacted, sett, standing).",
    "Data collection campaigns with the senseBox:bike have been run in different cities.",
    "As part of the ATRAI project the ATRAI data platform was developed to process and analyze the collected data. Several ready-made datasets are available on the platform, which can be accessed through its API. You can also explore the data in map view here: [data.atrai.bike](https://data.atrai.bike/).",
  ],
  links: [
    { label: "Dataset documentation", url: "https://data.atrai.bike/docs/built-in-datasets" },
    { label: "Source code", url: "https://github.com/reedu-reengineering-education/atrai-bikes-ingestor" },
  ],

  /** Shown as a table right after the second intro paragraph. */
  campaigns: [
    { tag: "heilbronn", city: "Heilbronn, Germany" },
    { tag: "muenster", city: "Münster, Germany" },
    { tag: "arnsberg", city: "Arnsberg, Germany" },
    { tag: "lauds_26", city: "Nancy, France" },
    { tag: "saopaulo", city: "São Paulo, Brazil" },
  ],

  apiTitle: "The API at a glance",
  endpoints: [
    { path: "GET /collections", what: "The names of all available datasets (\"collections\")" },
    {
      path: "GET /collections/{name}/items?limit=…&offset=…",
      what: "The data of one collection as **GeoJSON** (a `FeatureCollection`)",
    },
    { path: "GET /campaigns", what: "Summary numbers for every city campaign (rides, km, riders, time span)" },
    { path: "GET /campaigns/{city}", what: "The same summary for one city, e.g. `/campaigns/heilbronn`" },
  ],
  paramsTitle: "Parameters of /collections/{name}/items",
  params: [
    {
      name: "limit",
      default: "100",
      meaning:
        "Maximum number of features to return. `limit=0` returns **everything**. Be careful: some collections have over a million rows.",
    },
    {
      name: "offset",
      default: "0",
      meaning: "Skip this many features. Combine with `limit` to page through large collections.",
    },
    {
      name: "campaign",
      default: "–",
      meaning:
        "Exists, but **has no effect yet**. To get data for one city, use the city-specific collection (e.g. `bumpy_roads_heilbronn`).",
    },
  ],
  examplesTitle: "Example requests",
  /** Paths relative to BIKE_API_URL; each is linked so it opens in the browser. */
  examples: [
    { path: "/collections", what: "List all available collections." },
    { path: "/campaigns/heilbronn", what: "Key numbers of the Heilbronn campaign." },
    {
      path: "/collections/bumpy_roads_heilbronn/items?limit=0",
      what: "All street segments in Heilbronn with their road roughness (~9,400 features).",
    },
    {
      path: "/collections/danger_zones_heilbronn/items?limit=0",
      what: "All overtaking danger points in Heilbronn (~6,500 features).",
    },
    {
      path: "/collections/overtaking_distance_heilbronn/items?limit=0",
      what: "Overtaking distances per street segment in Heilbronn (~1,300 features).",
    },
    {
      path: "/collections/tracks/items?limit=500&offset=500",
      what: "Rides 501–1000 of all cities. Increase `offset` to page through the rest.",
    },
  ],

  datasetsTitle: "ready-made Datasets",
  datasetsLead:
    "The analysis datasets are all built from the raw sensor measurements of the bikes. Most of them are **matched to street segments** from OpenStreetMap: every measurement is assigned to the nearest street (max. 20 m away), and then the values are averaged per segment.",
  datasets: [
    {
      name: "bumpy_roads_<city>",
      geometry: "LineString",
      row: "street segment",
      fields: ["Roughness", "Normalized Roughness", "Number of Boxes", "name"],
      how: "The box's AI estimates the probability of each surface type. Each measurement gets a score = weighted sum of these probabilities with **asphalt = 1, paving = 2, compacted = 3, sett (cobblestones) = 4**, then the scores are averaged per segment. Higher = bumpier. `Normalized Roughness` is the same value on a ×10 scale.",
    },
    {
      name: "danger_zones_<city>",
      geometry: "Point",
      row: "measurement",
      fields: ["Risk Index Overtaking", "lat", "lng"],
      how: "Only points where an overtaking manoeuvre was detected (>5 % confidence). Risk = **0.3 × manoeuvre confidence + 0.7 × (1 − distance / 400 cm)**. Range 0–1, higher = more dangerous.",
    },
    {
      name: "danger_zones_PM_<city>",
      geometry: "Point",
      row: "measurement",
      fields: ["Risk Index", "lat", "lng"],
      how: "Combines traffic **and** air quality: 0.15 × manoeuvre + 0.35 × closeness + 0.2 × PM1 + 0.15 × PM2.5 + 0.1 × PM4 + 0.05 × PM10 (PM values divided by their maximum; humid readings > 75 % and outliers removed). Range 0–1.",
    },
    {
      name: "overtaking_distance_<city>",
      geometry: "LineString",
      row: "street segment",
      fields: ["Average Overtaking Distance cm", "Overtaking Distance Counts", "Number of Points"],
      how: "Only clearly detected overtakings (>50 % confidence, distance >25 cm). `Overtaking Distance Counts` is a histogram: how many overtakings were **0–50, 50–100, 100–150, 150–200 and >200 cm** away. (In Germany cars must keep **150 cm** in towns.)",
    },
    {
      name: "speed_map_<city>",
      geometry: "LineString",
      row: "street segment",
      fields: ["avg_speed[km/h]", "points_in_segment"],
      how: "Average cycling speed on the segment.",
    },
    {
      name: "traffic_flow_<city>",
      geometry: "LineString",
      row: "street segment",
      fields: ["avg_traffic_flow", "points_in_segment"],
      how: "**normalized speed × (1 − standing²)**, from 0 to 1. Near 1 = cyclists roll freely; near 0 = slow or stop-and-go (traffic lights, congestion). Start and end of each ride are ignored.",
    },
    {
      name: "road_network_<city>",
      geometry: "LineString",
      row: "OSM street segment",
      fields: ["osmid", "name", "surface", "cycleway", "oneway"],
      how: "Bike-relevant streets and paths from OpenStreetMap (via OSMnx). The basis that the other datasets are matched to.",
    },
    {
      name: "bike_road_network_<city>",
      geometry: "LineString",
      row: "OSM street segment",
      fields: ["osmid", "name", "cycleway", "oneway"],
      how: "A slimmer version of `road_network` (no `surface`).",
    },
    {
      name: "tracks",
      geometry: "LineString",
      row: "ride",
      fields: ["boxId", "groupTags", "startTime", "distance_meters", "avg_speed_ms", "avg_pm25", "avg_overtaking_distance", "…"],
      how: "One line per ride with summary values. **All cities**: filter by `groupTags` (contains the city).",
    },
    {
      name: "statistics",
      geometry: "Polygon",
      row: "city",
      fields: ["tag", "statistics"],
      how: "Pre-computed ride statistics per city: totals, plus weekly values. ⚠️ `statistics` is a text field (Python syntax, not JSON) that needs parsing.",
    },
    {
      name: "osem_bike_data",
      geometry: "Point",
      row: "raw measurement",
      fields: ["boxId", "groupTags", "createdAt", "Speed", "Finedust PM2.5", "Overtaking Distance", "Surface Asphalt", "…"],
      how: "The **raw** sensor data from openSenseMap, all cities. Very large (> 1 million rows), so only load it page by page.",
    }
  ],
};
