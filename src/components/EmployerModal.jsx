import { useEffect } from "react";
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
  jobTitle: "",
  jobDescription: "",
  shift: "",
  priority: "Medium",
  contactPerson: "",
  phoneNumber: "",
  emailAddress: "",
  incomeType: "Fixed Monthly",
  amount: 0,
  payoutSchedule: "Every 15th/30th",
  taxType: "Service Contractor 8%",
};
export default function EmployerModal({
  opened,
  onClose,
  onSave,
  initialValues,
}) {
  const form = useForm({
    initialValues: defaults,
    validate: {
      clientName: (v) => (v.trim() ? null : "Client name is required"),
      jobTitle: (v) => (v.trim() ? null : "Job title is required"),
      jobDescription: (v) => (v.trim() ? null : "Job description is required"),
      contactPerson: (v) => (v.trim() ? null : "Contact person is required"),
      emailAddress: (v) =>
        /^\S+@\S+\.\S+$/.test(v) ? null : "Enter a valid email address",
      amount: (v) => (v > 0 ? null : "Amount must be greater than zero"),
    },
  });
  useEffect(() => {
    if (opened) form.setValues({ ...defaults, ...initialValues });
  }, [opened, initialValues]);
  const submit = (values) => {
    onSave({ ...values, id: Date.now() });
    form.reset();
    onClose();
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Employment"
      centered
      size="lg"
    >
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap="md">
          <TextInput
            label="Client name"
            {...form.getInputProps("clientName")}
          />
          <TextInput label="Job title" {...form.getInputProps("jobTitle")} />
          <Textarea
            label="Job description"
            minRows={2}
            autosize
            {...form.getInputProps("jobDescription")}
          />
          <Group grow>
            <Select
              label="Shift"
              data={["Day Shift", "Night Shift", "Flexible"]}
              {...form.getInputProps("shift")}
            />
            <Select
              label="Priority"
              data={["Low", "Medium", "High", "Urgent"]}
              {...form.getInputProps("priority")}
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
              {...form.getInputProps("phoneNumber")}
            />
            <TextInput
              label="Email address"
              {...form.getInputProps("emailAddress")}
            />
          </Group>
          <Divider label="Income" />
          <Select
            label="Income type"
            data={[
              "Fixed Monthly",
              "Commission Based",
              "Fixed Monthly/Commission Based",
            ]}
            {...form.getInputProps("incomeType")}
          />
          <NumberInput
            label="Amount"
            min={0}
            thousandSeparator=","
            decimalScale={2}
            {...form.getInputProps("amount")}
          />
          <Group grow>
            <Select
              label="Payout schedule"
              data={[
                "Every 15th/30th",
                "Every 15th",
                "Every 30th",
                "Weekly",
                "Monthly",
              ]}
              {...form.getInputProps("payoutSchedule")}
            />
            <Select
              label="Tax type"
              data={[
                "Service Contractor 8%",
                "Service Contractor (Graduated)",
                "FTE (Tax Table)",
              ]}
              {...form.getInputProps("taxType")}
            />
          </Group>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Employment</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
