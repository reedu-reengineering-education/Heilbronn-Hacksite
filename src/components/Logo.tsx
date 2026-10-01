import Image from "next/image";
import logo from "../../public/Logo.jpg";

/**
 * The lockup already carries the full wordmark ("Green City {Hacka}{Thon_}"),
 * so anywhere this appears, skip an adjacent text title — it would repeat.
 * Its background is the same navy as `--color-surface`, so it blends into
 * the page rather than sitting in a box.
 */
export function Logo({ className }: { className?: string }) {
  return <Image src={logo} alt="Green City Hackathon" className={className} priority />;
}
