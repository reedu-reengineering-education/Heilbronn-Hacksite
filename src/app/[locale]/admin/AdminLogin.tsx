"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { Button, Card, Field, Input, Notice } from "@/components/ui";
import { adminLoginAction, type AdminState } from "./actions";

const initialState: AdminState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {label}
    </Button>
  );
}

export function AdminLogin({ locale, d }: { locale: Locale; d: Dictionary }) {
  const [state, action] = useActionState(adminLoginAction, initialState);

  return (
    <Card className="max-w-sm">
      <h2 className="text-lg font-semibold text-ink">{d.admin.logInTitle}</h2>
      <form action={action} className="mt-4 space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <Field label={d.admin.passphraseLabel}>
          <Input name="passphrase" type="password" required autoComplete="current-password" />
        </Field>
        {state.error ? (
          <Notice tone="error">
            {state.error === "notConfigured"
              ? "ADMIN_PASSPHRASE is not set on the server."
              : d.admin.badPassphrase}
          </Notice>
        ) : null}
        <SubmitButton label={d.admin.logIn} />
      </form>
    </Card>
  );
}
