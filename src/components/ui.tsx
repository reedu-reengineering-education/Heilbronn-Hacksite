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
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
        ) : null}
        {lead ? <p className="mt-3 max-w-2xl text-ink-muted">{lead}</p> : null}
        {children ? <div className={title || lead ? "mt-8" : undefined}>{children}</div> : null}
      </div>
    </section>
  );
}

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      className={cx(
        "rounded-card border border-line bg-surface-muted p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </Tag>
  );
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- inputs */

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const buttonVariants = {
  primary: "bg-brand text-white hover:bg-brand-strong",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-muted",
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
      <summary className="cursor-pointer select-none text-2xl font-semibold text-ink hover:text-brand-strong">
        {title}
      </summary>
      <div className="mt-3 text-ink-muted">{children}</div>
    </details>
  );
}
