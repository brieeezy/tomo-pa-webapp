import { useEffect, useMemo, useState } from "react";
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
import { calculateInvoiceTax, formatMoney } from "../utils/formatters";

const TAX_TYPES = [
  "Service Contractor 8%",
  "Service Contractor (Graduated)",
  "FTE (Tax Table)",
];

const INVOICE_STATUSES = ["Pending", "Paid", "Overdue", "Unpaid", "Void"];

const createInvoiceId = () =>
  `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

const formatDate = (date) => {
  if (!date) return null;

  const value = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) return null;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSaveErrorMessage = (error) => {
  const status = error?.response?.status;
  const responseMessage = error?.response?.data?.message;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (status === 401 || status === 403) {
    return "The invoice service rejected your credentials or access. Please sign in again or contact your administrator.";
  }
  if (status === 400 || status === 422) {
    return "The invoice service rejected some invoice details. Check the fields and try again.";
  }
  if (status) {
    return `The invoice could not be saved (server error ${status}). Please try again.`;
  }
  if (error?.request) {
    return "Could not reach the invoice service. Check your connection and try again.";
  }

  return "The invoice could not be saved. Please try again.";
};

export default function InvoiceModal({
  opened,
  onClose,
  employers = [],
  onSave,
}) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const form = useForm({
    initialValues: {
      employmentId: "",
      invoiceId: createInvoiceId(),
      postedDate: new Date(),
      status: "Pending",
      taxType: "",
      netIncome: 0,
      deductibles: 0,
    },

    validate: {
      employmentId: (value) => (value ? null : "Choose an employer"),

      postedDate: (value) => (value ? null : "Posted date is required"),

      netIncome: (value) =>
        Number(value) > 0 ? null : "Net income must be greater than zero",
    },
  });

  useEffect(() => {
    if (!opened) return;
    form.setValues({
      employmentId: "",
      invoiceId: createInvoiceId(),
      postedDate: new Date(),
      status: "Pending",
      taxType: "",
      netIncome: 0,
      deductibles: 0,
    });
    setSaveError("");
  }, [opened]);

  const selectedEmployer = useMemo(
    () =>
      employers.find(
        (employer) =>
          String(employer.id) === String(form.values.employmentId),
      ),
    [employers, form.values.employmentId],
  );

  const taxType = form.values.taxType || selectedEmployer?.taxType || "";

  const netIncome = Number(form.values.netIncome) || 0;

  const tax = calculateInvoiceTax(netIncome, taxType);

  const deductibles = Number(form.values.deductibles) || 0;

  const grossIncome = netIncome - tax - deductibles;

  const handleEmployerChange = (employerId) => {
    const employer = employers.find(
      (item) => String(item.id) === String(employerId),
    );

    form.setFieldValue("employmentId", employerId);
    form.setFieldValue("netIncome", employer?.amount ?? 0);
    form.setFieldValue("taxType", employer?.taxType ?? "");
  };

  const submit = async (values) => {
    setSaving(true);
    setSaveError("");
    try {
      await onSave({
        invoiceId: values.invoiceId,
        employmentId: Number(values.employmentId),
        postedDate: formatDate(values.postedDate),
        netIncome: Number(values.netIncome),
        status: values.status,
        taxType,
        tax,
        deductibles: Number(values.deductibles) || 0,
        grossIncome,
      });
      form.reset();
      onClose();
    } catch (error) {
      setSaveError(getSaveErrorMessage(error));
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
            Create Invoice
          </p>

          <p className="mt-1 text-sm font-normal text-slate-400">
            Create an invoice for your employment.
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
            {...form.getInputProps("employmentId")}
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
          <div>
            <Text size="sm" fw={500} mb={6}>
              Payment Status
            </Text>
            <Group gap="xs">
              {INVOICE_STATUSES.map((status) => {
                const selected = form.values.status === status;

                return (
                  <Button
                    key={status}
                    type="button"
                    size="xs"
                    radius="xl"
                    variant={selected ? "filled" : "light"}
                    color={selected ? "orange" : "gray"}
                    aria-pressed={selected}
                    onClick={() => form.setFieldValue("status", status)}
                  >
                    {status}
                  </Button>
                );
              })}
            </Group>
          </div>

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

          <div className="grid grid-cols-2 items-end gap-4">
            {/* Tax */}
            <div className="pb-2">
              <Text size="sm" c="dimmed">
                Tax
              </Text>
              <Text mt={4} fw={600}>{formatMoney(tax)}</Text>
            </div>

            {/* Deductibles */}
            <NumberInput
              label="Deductibles"
              placeholder="Enter deductibles"
              min={0}
              thousandSeparator=","
              decimalScale={2}
              {...form.getInputProps("deductibles")}
            />
          </div>

          {/* Gross Income */}
          <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-[#fff1e3] p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand">
              Gross Income
            </p>
            <p className="mt-2 font-display text-4xl font-extrabold tracking-tight text-[#c96300]">
              {formatMoney(grossIncome)}
            </p>
          </div>

          {saveError && <Text size="sm" c="red" role="alert">{saveError}</Text>}

          {/* Actions */}
          <Group justify="flex-end" mt="md">
            <Button variant="default" radius="xl" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              radius="xl"
              className="bg-brand hover:bg-[#c96300]"
              loading={saving}
            >
              Save Invoice
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
