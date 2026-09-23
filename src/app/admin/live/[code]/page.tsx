import { redirect } from "next/navigation";
import { dictionary as d } from "@/i18n";
import { getAdminToken, isAdmin } from "@/lib/session";
import { LiveHost } from "@/components/live/LiveHost";

export const dynamic = "force-dynamic";

export default async function HostConsolePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const [admin, adminToken] = await Promise.all([isAdmin(), getAdminToken()]);
  if (!admin || !adminToken) redirect("/admin");

  return (
    <div className="container-page py-8">
      <LiveHost code={code.toUpperCase()} adminToken={adminToken} d={d} />
    </div>
  );
}
