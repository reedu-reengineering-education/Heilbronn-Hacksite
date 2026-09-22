"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Dictionary } from "@/i18n";
import { Button, Field, Input, Notice, Textarea } from "@/components/ui";
import { submitEntryAction, type JudgeState } from "./actions";

const initialState: JudgeState = { error: null, ok: false };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {label}
    </Button>
  );
}

export function SubmitForm({
  slug,
  kind,
  d,
  hasExisting,
  existingBody,
}: {
  slug: string;
  kind: string;
  d: Dictionary;
  hasExisting: boolean;
  existingBody: string;
}) {
  const [state, action] = useActionState(submitEntryAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      {kind === "image" ? (
        <Field label={d.judge.submitImageLabel}>
          <Input type="file" name="image" accept="image/png,image/jpeg,image/webp,image/gif" />
        </Field>
      ) : null}

      <Field label={d.judge.submitLabel}>
        <Textarea name="body" defaultValue={existingBody} maxLength={2000} />
      </Field>

      {state.error ? <Notice tone="error">{d.team.errors.generic}</Notice> : null}
      {state.ok ? <Notice tone="success">{d.judge.submitted}</Notice> : null}

      <SubmitButton label={hasExisting ? d.judge.updateButton : d.judge.submitButton} />
    </form>
  );
}
