import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getTeamSession, getTeamToken } from "@/lib/session";
import { LivePlayer } from "@/components/live/LivePlayer";

export const dynamic = "force-dynamic";

export default async function LiveGamePage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale: raw, code } = await params;
  const locale = (isLocale(raw) ? raw : "de") as Locale;
  const d = getDictionary(locale);

  const [team, token] = await Promise.all([getTeamSession(), getTeamToken()]);
  if (!team || !token) redirect(`/${locale}/team`);

  return (
    <div className="container-page py-8 sm:py-12">
      <LivePlayer code={code.toUpperCase()} token={token} locale={locale} d={d} />
    </div>
  );
}
