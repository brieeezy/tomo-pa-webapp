import { useRef, useState } from "react";
import { Text, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

export default function EditableCell({
  value,
  type = "text",
  onSave,
  displayValue,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const saveLock = useRef(false);

  const startEditing = () => {
    setDraft(value ?? "");
    setSaveError("");
    setEditing(true);
  };

  const save = async () => {
    if (saveLock.current) return;

    if (draft === value) {
      setEditing(false);
      return;
    }

    saveLock.current = true;
    setSaving(true);
    setSaveError("");
    try {
      await onSave(draft);
      setEditing(false);
    } catch (error) {
      setSaveError(error?.message || "Could not save this value. Please try again.");
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div
        onClick={startEditing}
        className="w-full cursor-pointer truncate rounded px-2 py-1 hover:bg-slate-100"
      >
        {displayValue ?? (value || "—")}
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className="w-full min-w-0">
        <DateInput
          autoFocus
          w="100%"
          value={draft ? new Date(draft) : null}
          valueFormat="YYYY-MM-DD"
          onChange={async (date) => {
            if (!date) {
              setEditing(false);
              return;
            }

            const nextValue =
              date instanceof Date ? date.toISOString().slice(0, 10) : date;
            if (saveLock.current) return;
            saveLock.current = true;
            setSaving(true);
            setSaveError("");
            try {
              await onSave(nextValue);
              setEditing(false);
            } catch (error) {
              setSaveError(error?.message || "Could not save this value. Please try again.");
            } finally {
              saveLock.current = false;
              setSaving(false);
            }
          }}
          onBlur={() => {
            if (!saving && !saveError) setEditing(false);
          }}
          size="xs"
          clearable
          disabled={saving}
        />
        {saveError && <Text size="xs" c="red" mt={4}>{saveError}</Text>}
      </div>
    );
  }

  return (
    <div>
      <TextInput
        autoFocus
        w="100%"
        type={type === "number" ? "number" : "text"}
        value={draft}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === "Enter") save();
          if (event.key === "Escape" && !saving) {
            setSaveError("");
            setEditing(false);
          }
        }}
        size="xs"
        disabled={saving}
      />
      {saveError && <Text size="xs" c="red" mt={4}>{saveError}</Text>}
    </div>
  );
}
