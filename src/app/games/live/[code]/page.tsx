import { redirect } from "next/navigation";
import { dictionary as d } from "@/i18n";
import { getTeamSession, getTeamToken } from "@/lib/session";
import { LivePlayer } from "@/components/live/LivePlayer";

export const dynamic = "force-dynamic";

export default async function LiveGamePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const [team, token] = await Promise.all([getTeamSession(), getTeamToken()]);
  if (!team || !token) redirect("/team");

  return (
    <div className="container-page py-8 sm:py-12">
      <LivePlayer code={code.toUpperCase()} token={token} d={d} />
    </div>
  );
}
