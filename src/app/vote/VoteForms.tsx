"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Dictionary } from "@/i18n";
import { Button, Card, Field, Input, Notice } from "@/components/ui";
import { castVoteAction, type VoteFormState } from "./actions";

const initialState: VoteFormState = { error: null };

function errorText(d: Dictionary, key: string | null): string | null {
  if (!key) return null;
  const errors = d.vote.errors as Record<string, string>;
  return errors[key] ?? d.vote.errors.generic;
}

function SubmitButton({
  label,
  className,
  disabled,
}: {
  label: string;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} className={className}>
      {label}
    </Button>
  );
}

/** Shared by /vote and /results; only the action and intro differ. */
export function PassphraseGate({
  d,
  intro,
  action: serverAction,
}: {
  d: Dictionary;
  intro: string;
  action: (prev: VoteFormState, formData: FormData) => Promise<VoteFormState>;
}) {
  const [state, action] = useActionState(serverAction, initialState);
  const message = errorText(d, state.error);

  return (
    <Card className="max-w-md">
      <p className="text-ink-muted">{intro}</p>
      <form action={action} className="mt-5 space-y-4">
        <Field label={d.vote.passphraseLabel}>
          <Input name="passphrase" type="password" required autoComplete="off" />
        </Field>
        {message ? <Notice tone="error">{message}</Notice> : null}
        <SubmitButton label={d.vote.enterButton} className="w-full" />
      </form>
    </Card>
  );
}

export function VoteButton({
  d,
  teamId,
  disabled,
}: {
  d: Dictionary;
  teamId: number;
  disabled?: boolean;
}) {
  const [state, action] = useActionState(castVoteAction, initialState);
  const message = errorText(d, state.error);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="teamId" value={teamId} />
      <SubmitButton label={d.vote.voteButton} className="w-full" disabled={disabled} />
      {message ? <Notice tone="error">{message}</Notice> : null}
    </form>
  );
}
