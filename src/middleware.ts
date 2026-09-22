import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

/**
 * Sends every page request to a locale-prefixed URL (`/de/...`, `/en/...`).
 * A visitor's choice is remembered in a cookie; otherwise we guess from
 * Accept-Language and fall back to German.
 */

const LOCALE_COOKIE = "hacksite_locale";

const PASSTHROUGH = [
  "/api",
  "/ws",
  "/uploads",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/logo.svg",
];

function preferredLocale(request: NextRequest): string {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;

  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase() ?? "";
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PASSTHROUGH.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip anything with a file extension so static assets are untouched.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
