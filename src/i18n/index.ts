import de, { type Dictionary } from "./dictionaries/de";
import en from "./dictionaries/en";
import { type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { de, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/**
 * Fills `{name}` placeholders: t(d.live.questionOf, { current: 2, total: 10 }).
 */
export function t(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
export * from "./config";
