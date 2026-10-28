import { useState } from "react";
import { TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

export default function EditableCell({ value, type = "text", onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const startEditing = () => {
    setDraft(value ?? "");
    setEditing(true);
  };

  const save = () => {
    if (draft !== value) {
      onSave(draft);
    }

    setEditing(false);
  };

  if (!editing) {
    return (
      <div
        onClick={startEditing}
        className="cursor-pointer rounded px-2 py-1 hover:bg-slate-100"
      >
        {value || "—"}
      </div>
    );
  }

  if (type === "date") {
    return (
      <DateInput
        autoFocus
        value={draft ? new Date(draft) : null}
        valueFormat="YYYY-MM-DD"
        onChange={(date) => {
          if (date) {
            onSave(
              date instanceof Date ? date.toISOString().slice(0, 10) : date,
            );
          }

          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
        size="xs"
        clearable
      />
    );
  }

  return (
    <TextInput
      autoFocus
      type={type === "number" ? "number" : "text"}
      value={draft}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={save}
      onKeyDown={(event) => {
        if (event.key === "Enter") save();
        if (event.key === "Escape") setEditing(false);
      }}
      size="xs"
    />
  );
}
