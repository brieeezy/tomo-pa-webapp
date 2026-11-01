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
  Text,
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
const incomeTypes = ["Fixed Monthly", "Hourly", "Commission Based"];

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
      title={
        <div>
          <p className="font-display text-xl font-extrabold text-ink">
            {editing ? "Edit Client" : "Add Client"}
          </p>
          <p className="mt-1 text-sm font-normal text-slate-400">
            {editing
              ? "Update client and employment details."
              : "Add a client and their employment details."}
          </p>
        </div>
      }
      centered
      size="lg"
      radius="2xl"
      styles={{
        content: {
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100dvh - 2rem)",
          overflow: "hidden",
        },
        header: { flex: "0 0 auto" },
        body: {
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",
        },
      }}
    >
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap="md">
          <TextInput
            label="Client Name"
            {...form.getInputProps("clientName")}
          />
          <Divider label="Income" />
          <Stack gap="sm">
            <Stack gap={6}>
              <Text size="sm" fw={500}>
                Income Type
              </Text>
              <Group gap="xs" wrap="nowrap" role="group" aria-label="Income type">
                {incomeTypes.map((incomeType) => (
                  <Button
                    key={incomeType}
                    type="button"
                    size="xs"
                    radius="xl"
                    variant={
                      form.values.incomeType === incomeType
                        ? "filled"
                        : "default"
                    }
                    color={
                      form.values.incomeType === incomeType ? "orange" : "gray"
                    }
                    aria-pressed={form.values.incomeType === incomeType}
                    onClick={() => form.setFieldValue("incomeType", incomeType)}
                  >
                    {incomeType}
                  </Button>
                ))}
              </Group>
            </Stack>
            <Group grow align="flex-start">
              <NumberInput
                label="Income Amount"
                min={0}
                thousandSeparator=","
                {...form.getInputProps("amount")}
              />
              <TextInput
                label="Currency"
                placeholder="PHP"
                maxLength={3}
                w={90}
                style={{ flex: "0 0 65px" }}
                {...form.getInputProps("currency")}
              />
            </Group>
          </Stack>
          <Divider label="Job Information" />
          <Textarea
            label="Job Description"
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
