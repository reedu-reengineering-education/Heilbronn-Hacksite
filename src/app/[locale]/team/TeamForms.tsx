"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { Button, Card, Field, Input, Notice } from "@/components/ui";
import { signInAction, signUpAction, type TeamFormState } from "./actions";

const EMOJI_CHOICES = ["🐝", "🦊", "🐙", "🦉", "🐢", "🦖", "🌱", "⚡", "🛰️", "🔭", "🧭", "🍄"];

const initialState: TeamFormState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {label}
    </Button>
  );
}

function errorText(d: Dictionary, key: string | null): string | null {
  if (!key) return null;
  const errors = d.team.errors as Record<string, string>;
  return errors[key] ?? d.team.errors.generic;
}

export function SignUpForm({
  locale,
  d,
  redirectTo,
}: {
  locale: Locale;
  d: Dictionary;
  /** Where to send the team once sign-up succeeds; defaults to the team dashboard. */
  redirectTo?: string;
}) {
  const [state, action] = useActionState(signUpAction, initialState);
  const message = errorText(d, state.error);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">{d.team.signUpTitle}</h2>
      <p className="mt-2 text-sm text-ink-muted">{d.team.signUpIntro}</p>

      <form action={action} className="mt-5 space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="next" value={redirectTo ?? `/${locale}/team`} />

        <Field label={d.team.nameLabel}>
          <Input name="name" required minLength={2} maxLength={40} autoComplete="off" />
        </Field>

        <Field label={d.team.passphraseLabel} hint={d.team.passphraseHint}>
          <Input
            name="passphrase"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </Field>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-ink">{d.team.emojiLabel}</legend>
          <div className="flex flex-wrap gap-1.5">
            {EMOJI_CHOICES.map((emoji, index) => (
              <label key={emoji} className="cursor-pointer">
                <input
                  type="radio"
                  name="emoji"
                  value={emoji}
                  defaultChecked={index === 0}
                  className="peer sr-only"
                />
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-xl peer-checked:border-brand peer-checked:bg-brand-soft">
                  {emoji}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {message ? <Notice tone="error">{message}</Notice> : null}
        <SubmitButton label={d.team.signUpButton} />
      </form>
    </Card>
  );
}

export function SignInForm({
  locale,
  d,
  redirectTo,
}: {
  locale: Locale;
  d: Dictionary;
  /** Where to send the team once sign-in succeeds; defaults to the team dashboard. */
  redirectTo?: string;
}) {
  const [state, action] = useActionState(signInAction, initialState);
  const message = errorText(d, state.error);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">{d.team.logInTitle}</h2>
      <p className="mt-2 text-sm text-ink-muted">{d.team.logInIntro}</p>

      <form action={action} className="mt-5 space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="next" value={redirectTo ?? `/${locale}/team`} />

        <Field label={d.team.nameLabel}>
          <Input name="name" required autoComplete="off" />
        </Field>

        <Field label={d.team.passphraseLabel}>
          <Input name="passphrase" type="password" required autoComplete="current-password" />
        </Field>

        {message ? <Notice tone="error">{message}</Notice> : null}
        <SubmitButton label={d.team.logInButton} />
      </form>
    </Card>
  );
}
