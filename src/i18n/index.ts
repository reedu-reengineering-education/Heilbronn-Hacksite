import dictionary, { type Dictionary } from "./dictionaries/en";

export { dictionary };

/**
 * Fills `{name}` placeholders: t(d.live.questionOf, { current: 2, total: 10 }).
 */
export function t(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
