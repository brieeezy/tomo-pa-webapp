import { useMemo } from "react";
import {
  Modal,
  Select,
  NumberInput,
  Button,
  Group,
  Divider,
  Stack,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { formatMoney } from "../utils/formatters";

const TAX_TYPES = [
  "Service Contractor 8%",
  "Service Contractor (Graduated)",
  "FTE (Tax Table)",
];

const INVOICE_STATUSES = ["Pending", "Paid", "Void", "Unpaid"];

const formatDate = (date) => {
  if (!date) return null;

  const value = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) return null;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const calculateTax = (netIncome, taxType) => {
  if (taxType === "Service Contractor 8%") {
    return netIncome * 0.08;
  }

  // Replace with your tax table / graduated tax calculation.
  return 0;
};

const calculateDeductibles = (netIncome, taxType) => {
  // Add SSS, PhilHealth, Pag-IBIG, or other deduction logic here.
  return 0;
};

export default function InvoiceModal({
  opened,
  onClose,
  employers = [],
  onSave,
}) {
  const form = useForm({
    initialValues: {
      employerId: "",
      invoiceId: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(
        -4,
      )}`,
      postedDate: new Date(),
      status: "Pending",
      taxType: "",
      netIncome: 0,
    },

    validate: {
      employerId: (value) => (value ? null : "Choose an employer"),

      postedDate: (value) => (value ? null : "Posted date is required"),

      netIncome: (value) =>
        Number(value) > 0 ? null : "Net income must be greater than zero",
    },
  });

  const selectedEmployer = useMemo(
    () =>
      employers.find(
        (employer) => String(employer.id) === String(form.values.employerId),
      ),
    [employers, form.values.employerId],
  );

  const taxType = form.values.taxType || selectedEmployer?.taxType || "";

  const netIncome = Number(form.values.netIncome) || 0;

  const tax = calculateTax(netIncome, taxType);

  const deductibles = calculateDeductibles(netIncome, taxType);

  const grossIncome = netIncome + tax + deductibles;

  const handleEmployerChange = (employerId) => {
    const employer = employers.find(
      (item) => String(item.id) === String(employerId),
    );

    form.setFieldValue("employerId", employerId);
    form.setFieldValue("netIncome", employer?.amount ?? 0);
    form.setFieldValue("taxType", employer?.taxType ?? "");
  };

  const submit = (values) => {
    onSave({
      ...values,
      employerId: String(values.employerId),
      postedDate: formatDate(values.postedDate),
      netIncome: Number(values.netIncome),
      taxType,
      tax,
      deductibles,
      grossIncome,
      id: values.invoiceId,
    });

    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <p className="font-display text-xl font-extrabold text-ink">
            Invoice Modal
          </p>

          <p className="mt-1 text-sm font-normal text-slate-400">
            Create an invoice for your employment.
          </p>
        </div>
      }
      centered
      size="lg"
      radius="2xl"
    >
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap="md">
          {/* Invoice ID */}
          <div className="rounded-2xl bg-slate-50 p-4">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              Invoice ID
            </Text>

            <Text mt={4} fw={700} className="text-ink">
              {form.values.invoiceId}
            </Text>
          </div>

          {/* Client */}
          <Select
            label="Client"
            placeholder="Select employer"
            data={employers.map((employer) => ({
              value: String(employer.id),
              label: employer.clientName || employer.name,
            }))}
            searchable
            {...form.getInputProps("employerId")}
            onChange={handleEmployerChange}
          />

          {/* Net Income */}
          <NumberInput
            label="Net Income"
            placeholder="Enter net income"
            min={0}
            thousandSeparator=","
            decimalScale={2}
            {...form.getInputProps("netIncome")}
          />

          {/* Posted Date */}
          <DateInput
            label="Posted Date"
            placeholder="Select or type date"
            valueFormat="MMM D, YYYY"
            clearable
            {...form.getInputProps("postedDate")}
          />

          {/* Status */}
          <Select
            label="Status"
            data={INVOICE_STATUSES}
            {...form.getInputProps("status")}
          />

          {/* Tax Type */}
          <Select
            label="Tax Type"
            data={TAX_TYPES}
            placeholder="Select tax type"
            value={taxType}
            onChange={(value) => form.setFieldValue("taxType", value || "")}
          />

          {/* Income Summary */}
          <Divider label="Income Summary" labelPosition="left" />

          {/* Tax */}
          <div className="flex items-center justify-between">
            <Text size="sm" c="dimmed">
              Tax
            </Text>

            <Text fw={600}>{formatMoney(tax)}</Text>
          </div>

          {/* Deductibles */}
          <div className="flex items-center justify-between">
            <Text size="sm" c="dimmed">
              Deductibles
            </Text>

            <Text fw={600}>{formatMoney(deductibles)}</Text>
          </div>

          {/* Gross Income */}
          <div className="rounded-2xl bg-indigo-50/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              Gross Income
            </p>

            <p className="mt-1 font-display text-2xl font-extrabold text-indigo-700">
              {formatMoney(grossIncome)}
            </p>
          </div>

          {/* Actions */}
          <Group justify="flex-end" mt="md">
            <Button variant="default" radius="xl" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              radius="xl"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Save Invoice
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
