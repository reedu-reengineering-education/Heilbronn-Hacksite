"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { t, type Dictionary } from "@/i18n";
import { Button, Card, Field, Input, Notice, Textarea } from "@/components/ui";
import { TEAM_EMOJIS } from "@/content/team-emojis";
import {
  signInAction,
  signUpAction,
  updateTeamAction,
  type TeamFormState,
} from "./actions";

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

function EmojiPicker({ d, current }: { d: Dictionary; current?: string }) {
  const [selected, setSelected] = useState(
    current && TEAM_EMOJIS.includes(current) ? current : TEAM_EMOJIS[0],
  );
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setOpen(false);
      } else if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <span className="mb-1.5 block text-sm font-medium text-ink">{d.team.emojiLabel}</span>
      <input type="hidden" name="emoji" value={selected} />

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={d.team.emojiChange}
        className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-surface text-3xl transition-colors hover:border-accent"
      >
        {selected}
        <span
          aria-hidden
          className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface-muted text-ink-muted"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-20 mt-3 w-80 max-w-[calc(100vw-3rem)] rounded-card border border-line bg-surface p-2 shadow-lg">
          <div className="grid max-h-64 grid-cols-7 gap-1 overflow-y-auto">
            {TEAM_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setSelected(emoji);
                  setOpen(false);
                }}
                aria-pressed={emoji === selected}
                className={`flex h-10 items-center justify-center rounded-lg text-xl hover:bg-surface-muted ${
                  emoji === selected ? "bg-brand-soft" : ""
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const MAX_MEMBERS = 6;
const MAX_MEMBER_NAME_LENGTH = 60;

function MembersEditor({
  d,
  members,
  setMembers,
}: {
  d: Dictionary;
  members: string[];
  setMembers: (members: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const name = draft.trim().replace(/\s+/g, " ");
  const duplicate = members.some((member) => member.toLowerCase() === name.toLowerCase());
  const full = members.length >= MAX_MEMBERS;

  function add() {
    if (!name || duplicate || full) return;
    setMembers([...members, name]);
    setDraft("");
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{d.team.membersLabel}</span>
      {/* The server reads one name per line. */}
      <input type="hidden" name="members" value={members.join("\n")} />

      {members.length > 0 ? (
        <ul className="mb-3 flex flex-wrap gap-2">
          {members.map((member) => (
            <li
              key={member}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken py-1 pl-3 pr-1.5 text-sm text-ink"
            >
              {member}
              <button
                type="button"
                onClick={() => setMembers(members.filter((other) => other !== member))}
                aria-label={t(d.team.removeMember, { name: member })}
                className="flex h-5 w-5 items-center justify-center rounded-full text-ink-muted hover:bg-negative/15 hover:text-negative"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {full ? null : (
        <>
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                // Enter adds the name instead of submitting the whole form.
                if (event.key === "Enter") {
                  event.preventDefault();
                  add();
                }
              }}
              maxLength={MAX_MEMBER_NAME_LENGTH}
              placeholder={d.team.memberPlaceholder}
              autoComplete="off"
              aria-label={d.team.memberPlaceholder}
            />
            <Button type="button" variant="secondary" onClick={add} disabled={!name || duplicate}>
              {d.team.addMember}
            </Button>
          </div>
          <span className="mt-1.5 block text-xs text-ink-muted">{d.team.membersHint}</span>
        </>
      )}
    </div>
  );
}

export function SignUpForm({ d }: { d: Dictionary }) {
  const [state, action] = useActionState(signUpAction, initialState);
  const message = errorText(d, state.error);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">{d.team.signUpTitle}</h2>
      <p className="mt-2 text-sm text-ink-muted">{d.team.signUpIntro}</p>

      <form action={action} className="mt-5 space-y-4">
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

        <EmojiPicker d={d} />

        {message ? <Notice tone="error">{message}</Notice> : null}
        <SubmitButton label={d.team.signUpButton} />
      </form>
    </Card>
  );
}

export function SignInForm({ d, teamName }: { d: Dictionary; teamName?: string }) {
  const [state, action] = useActionState(signInAction, initialState);
  const message = errorText(d, state.error);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">{d.team.logInTitle}</h2>
      <p className="mt-2 text-sm text-ink-muted">{d.team.logInIntro}</p>

      <form action={action} className="mt-5 space-y-4">
        <Field label={d.team.nameLabel}>
          <Input name="name" required autoComplete="off" defaultValue={teamName} />
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

export function EditTeamForm({
  d,
  team,
}: {
  d: Dictionary;
  team: {
    name: string;
    emoji: string;
    idea: string;
    members: string[];
    lookingForMembers: boolean;
  };
}) {
  const [state, action] = useActionState(updateTeamAction, initialState);
  const [members, setMembers] = useState(team.members);
  const full = members.length >= MAX_MEMBERS;
  const message = errorText(d, state.error);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">{d.team.editTitle}</h2>

      <form action={action} className="mt-5 space-y-4">
        <Field label={d.team.nameLabel}>
          <Input
            name="name"
            required
            minLength={2}
            maxLength={40}
            autoComplete="off"
            defaultValue={team.name}
          />
        </Field>

        <EmojiPicker d={d} current={team.emoji} />

        <Field label={d.team.ideaLabel} hint={d.team.ideaHint}>
          <Textarea name="idea" maxLength={2000} rows={6} defaultValue={team.idea} />
        </Field>

        <MembersEditor d={d} members={members} setMembers={setMembers} />

        {full ? null : (
          <label className="flex items-center gap-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              name="lookingForMembers"
              defaultChecked={team.lookingForMembers}
              className="h-4 w-4 accent-brand"
            />
            {d.team.lookingLabel}
          </label>
        )}

        <Field label={d.team.newPassphraseLabel} hint={d.team.newPassphraseHint}>
          <Input name="newPassphrase" type="password" minLength={6} autoComplete="new-password" />
        </Field>

        {message ? <Notice tone="error">{message}</Notice> : null}
        {state.saved ? <Notice tone="success">{d.team.saved}</Notice> : null}
        <SubmitButton label={d.team.saveButton} />
      </form>
    </Card>
  );
}
