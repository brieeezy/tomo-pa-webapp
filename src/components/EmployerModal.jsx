import { useEffect, useState } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Button,
  Group,
  Divider,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
const defaults = {
  clientName: "",
  incomeType: "",
  amount: "",
  currency: "PHP",
  shift: "",
  priority: 2,
  jobDesc: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
};
export default function EmployerModal({
  opened,
  onClose,
  onSave,
  initialValues,
  editing = false,
}) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const form = useForm({
    initialValues: defaults,
    validate: {
      clientName: (v) => (v.trim() ? null : "Client name is required"),
      jobDesc: (v) => (v.trim() ? null : "Job description is required"),
      shift: (v) => (v.trim() ? null : "Shift is required"),
      contactPerson: (v) => (v.trim() ? null : "Contact person is required"),
      contactPhone: (v) => (v.trim() ? null : "Phone number is required"),
      contactEmail: (v) =>
        /^\S+@\S+\.\S+$/.test(v) ? null : "Enter a valid email address",
      priority: (v) =>
        Number.isInteger(v) && v >= 1 && v <= 3
          ? null
          : "Choose High, Medium, or Low",
    },
  });
  useEffect(() => {
    if (opened) {
      form.setValues({ ...defaults, ...initialValues });
      setSaveError("");
    }
  }, [opened, initialValues]);
  const submit = async (values) => {
    setSaving(true);
    setSaveError("");
    try {
      await onSave(values);
      form.reset();
      onClose();
    } catch {
      setSaveError("The employer could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editing ? "Edit client" : "Add client"}
      centered
      size="lg"
    >
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap="md">
          <TextInput
            label="Client name"
            {...form.getInputProps("clientName")}
          />
          <Divider label="Income" />
          <Group grow>
            <TextInput
              label="Income type"
              placeholder="Fixed monthly, hourly, commission..."
              {...form.getInputProps("incomeType")}
            />
            <NumberInput
              label="Income amount"
              min={0}
              thousandSeparator="," 
              {...form.getInputProps("amount")}
            />
            <TextInput
              label="Currency"
              placeholder="PHP"
              maxLength={3}
              {...form.getInputProps("currency")}
            />
          </Group>
          <Textarea
            label="Job description"
            minRows={2}
            autosize
            {...form.getInputProps("jobDesc")}
          />
          <Group grow>
            <TextInput label="Shift" placeholder="Day, night, flexible..." {...form.getInputProps("shift")} />
            <Select
              label="Priority"
              data={[
                { value: "3", label: "High" },
                { value: "2", label: "Medium" },
                { value: "1", label: "Low" },
              ]}
              value={String(form.values.priority)}
              onChange={(value) =>
                form.setFieldValue("priority", Number(value))
              }
              error={form.errors.priority}
            />
          </Group>
          <Divider label="Contact information" />
          <TextInput
            label="Contact person"
            {...form.getInputProps("contactPerson")}
          />
          <Group grow>
            <TextInput
              label="Phone number"
              {...form.getInputProps("contactPhone")}
            />
            <TextInput
              label="Email address"
              {...form.getInputProps("contactEmail")}
            />
          </Group>
          {saveError && <p role="alert" className="text-sm text-red-600">{saveError}</p>}
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>{editing ? "Save changes" : "Save client"}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
