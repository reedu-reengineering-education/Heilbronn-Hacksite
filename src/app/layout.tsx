import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { dictionary as d } from "@/i18n";

const spaceGrotesk = localFont({
  src: "../../public/fonts/space-grotesk/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    { path: "../../public/fonts/ibm-plex-mono/IBMPlexMono-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/ibm-plex-mono/IBMPlexMono-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/ibm-plex-mono/IBMPlexMono-Bold.ttf", weight: "700" },
  ],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: d.meta.title, template: `%s · ${d.meta.title}` },
  description: d.meta.description,
  icons: { icon: "/Logo.jpg", apple: "/Logo.jpg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col font-sans" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          {d.nav.skipToContent}
        </a>
        <SiteHeader d={d} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter d={d} />
      </body>
    </html>
  );
}
