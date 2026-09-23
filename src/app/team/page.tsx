import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { dictionary as d } from "@/i18n";
import { getTeamSession } from "@/lib/session";
import { Section } from "@/components/ui";
import { SignInForm, SignUpForm } from "./TeamForms";

export const metadata: Metadata = { title: d.team.title };

export default async function TeamPage() {
  const team = await getTeamSession();

  // Already signed in teams get their status on /games, so there is nothing
  // left for this page to show them.
  if (team) redirect("/games");

  return (
    <Section title={d.team.title}>
      <div className="grid max-w-4xl gap-5 md:grid-cols-2">
        <SignUpForm d={d} />
        <SignInForm d={d} />
      </div>
    </Section>
  );
}
