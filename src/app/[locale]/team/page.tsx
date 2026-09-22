import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getTeamSession } from "@/lib/session";
import { Section } from "@/components/ui";
import { SignInForm, SignUpForm } from "./TeamForms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(isLocale(locale) ? locale : "de").team.title };
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "de") as Locale;
  const d = getDictionary(locale);
  const team = await getTeamSession();

  // Already signed in teams get their status on /games, so there is nothing
  // left for this page to show them.
  if (team) redirect(`/${locale}/games`);

  return (
    <Section title={d.team.title}>
      <div className="grid max-w-4xl gap-5 md:grid-cols-2">
        <SignUpForm locale={locale} d={d} />
        <SignInForm locale={locale} d={d} />
      </div>
    </Section>
  );
}
