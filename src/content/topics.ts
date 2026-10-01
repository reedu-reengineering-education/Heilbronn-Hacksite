import type { Dictionary } from "@/i18n";

export type TopicId = keyof Dictionary["topics"]["items"];

/**
 * Display order follows the ring layout: the top row of four, then the
 * bottom row of three. Colours are the ring palette (readable on navy).
 */
export const topics: Array<{ id: TopicId; color: string }> = [
  { id: "waste", color: "#b07fd6" },
  { id: "water", color: "#8fbfd8" },
  { id: "noise", color: "#eda55d" },
  { id: "air", color: "#8b9be6" },
  { id: "biodiversity", color: "#b4d65a" },
  { id: "protection", color: "#d6829f" },
  { id: "adaptation", color: "#6fba8a" },
];
