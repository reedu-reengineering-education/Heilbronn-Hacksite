/**
 * Placeholder mark. Drop the real logo into `public/logo.svg` and this
 * component will pick it up — or replace the whole file with an <Image>.
 *
 * `currentColor` keeps it readable in both themes until the brand asset lands.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" className="fill-brand" />
      <path
        d="M10 9v14M22 9v14M10 16h12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
