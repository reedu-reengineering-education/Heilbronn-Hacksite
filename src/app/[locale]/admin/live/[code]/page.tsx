import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { getAdminToken, isAdmin } from "@/lib/session";
import { LiveHost } from "@/components/live/LiveHost";

export const dynamic = "force-dynamic";

export default async function HostConsolePage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale: raw, code } = await params;
  const locale = (isLocale(raw) ? raw : "de") as Locale;
  const d = getDictionary(locale);

  const [admin, adminToken] = await Promise.all([isAdmin(), getAdminToken()]);
  if (!admin || !adminToken) redirect(`/${locale}/admin`);

  return (
    <div className="container-page py-8">
      <LiveHost code={code.toUpperCase()} adminToken={adminToken} d={d} />
    </div>
  );
}
