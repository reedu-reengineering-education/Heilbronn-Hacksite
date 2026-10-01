"use client";

import type { Dictionary } from "@/i18n";
import { Button, Card } from "@/components/ui";
import { deleteTeamAction } from "./actions";

export function DeleteTeamForm({ d }: { d: Dictionary }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">{d.team.deleteTitle}</h2>
      <p className="mt-2 text-sm text-ink-muted">{d.team.deleteBody}</p>
      <form
        action={deleteTeamAction}
        onSubmit={(event) => {
          if (!window.confirm(d.team.deleteConfirm)) event.preventDefault();
        }}
        className="mt-4"
      >
        <Button type="submit" variant="danger">
          {d.team.deleteButton}
        </Button>
      </form>
    </Card>
  );
}
