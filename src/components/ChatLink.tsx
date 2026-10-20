"use client";

import type { ReactNode } from "react";
import { Button, cx, type ButtonVariant } from "@/components/ui";

/**
 * Opens an invite link that is only decoded on click, so the plain URL never
 * appears in the HTML and simple scrapers can't harvest it.
 * `encoded` is the base64-encoded URL, see `encodedChatUrl` in content/event.
 * Without a `variant` it renders unstyled, for use as a text link.
 */
export function ChatLink({
  encoded,
  variant,
  className,
  children,
}: {
  encoded: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  const open = () => window.open(atob(encoded), "_blank", "noopener,noreferrer");

  if (variant) {
    return (
      <Button type="button" variant={variant} className={cx("cursor-pointer", className)} onClick={open}>
        {children}
      </Button>
    );
  }
  return (
    <button type="button" className={cx("cursor-pointer uppercase", className)} onClick={open}>
      {children}
    </button>
  );
}
