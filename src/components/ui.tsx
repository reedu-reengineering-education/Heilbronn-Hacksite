import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Small shared primitives. Every visual decision is a token from globals.css,
 * so re-skinning the site means editing that file rather than these.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------- structure */

/** `{ ` / ` }` (or `[ ` / ` ]`), framing a short label. Brace color defaults
 * to the accent lime — pass `braceClassName` to mute it (e.g. a footer tagline). */
export function Bracket({
  children,
  kind = "brace",
  className,
  braceClassName = "text-accent",
}: {
  children: ReactNode;
  kind?: "brace" | "square";
  className?: string;
  braceClassName?: string;
}) {
  const [open, close] = kind === "brace" ? ["{", "}"] : ["[", "]"];
  return (
    <span className={cx("font-mono", className)}>
      <span className={braceClassName}>{open} </span>
      {children}
      <span className={braceClassName}> {close}</span>
    </span>
  );
}

export function Section({
  title,
  lead,
  children,
  id,
  className,
}: {
  title?: string;
  lead?: string;
  children?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cx("py-12 sm:py-16", className)}>
      <div className="container-page">
        {title ? (
          <h2 className="font-mono text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
            <span className="text-accent">/ </span>
            {title}
          </h2>
        ) : null}
        {lead ? <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">{lead}</p> : null}
        {children ? <div className={title || lead ? "mt-8" : undefined}>{children}</div> : null}
      </div>
    </section>
  );
}

/** The one card look (outlined, brand border). Use `cardClass` for elements that
 * can't be a `<Card>` (e.g. the flip faces of `DataCard`). */
export const cardClass = "rounded-card border-4 border-brand bg-surface shadow-card";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return <Tag className={cx(cardClass, "p-5", className)}>{children}</Tag>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "positive" | "negative" }) {
  const tones = {
    neutral: "bg-surface-sunken text-ink-muted",
    brand: "bg-brand-soft text-brand-strong",
    positive: "bg-positive/15 text-positive",
    negative: "bg-negative/15 text-negative",
  } as const;
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- inputs */

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const buttonVariants = {
  primary: "bg-accent text-surface hover:bg-white",
  secondary: "border border-line bg-surface text-ink hover:border-accent hover:text-accent",
  ghost: "text-ink-muted hover:bg-surface-muted hover:text-ink",
  danger: "bg-negative text-white hover:opacity-90",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={cx(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={cx(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-ink-muted">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-ink placeholder:text-ink-muted/60";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cx(inputClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cx(inputClass, "min-h-32", className)} {...props} />;
}

/* --------------------------------------------------------------- notices */

export function Notice({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "error" | "success";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-line bg-surface-muted text-ink",
    error: "border-negative/40 bg-negative/10 text-negative",
    success: "border-positive/40 bg-positive/10 text-positive",
  } as const;
  return (
    <div
      className={cx("rounded-lg border px-4 py-3 text-sm", tones[tone], className)}
      role="status"
    >
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-line px-6 py-12 text-center text-ink-muted">
      {children}
    </div>
  );
}

export function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <summary className="cursor-pointer select-none font-mono text-xl font-semibold uppercase tracking-tight text-ink hover:text-accent sm:text-2xl">
        {title}
      </summary>
      <div className="mt-3 text-ink-muted">{children}</div>
    </details>
  );
}
