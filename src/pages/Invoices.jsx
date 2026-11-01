import { useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Modal,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";

import {
  IconPlus,
  IconSearch,
  IconReceipt,
  IconTrash,
} from "@tabler/icons-react";

import EditableCell from "../components/EditableCell";

import { calculateInvoiceTax, formatMoney } from "../utils/formatters";

const STATUS_OPTIONS = ["Pending", "Paid", "Overdue", "Unpaid", "Void"];

export default function Invoices({
  invoices,
  employers,
  onCreate,
  onUpdate,
  onDelete,
  error,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const clientName = (employmentId) =>
    employers.find((employer) => String(employer.id) === String(employmentId))?.clientName ||
    "Unknown client";

  const filtered = useMemo(
    () =>
      invoices.filter((invoice) => {
        const matchesStatus = status === "All" || invoice.status === status;

        const matchesSearch = [
          invoice.invoiceId,
          clientName(invoice.employmentId),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
      }),
    [invoices, search, status, employers],
  );

  const updateField = async (invoice, field, value) => {
    const changes = { [field]: value };
    if (field === "netIncome") {
      changes.tax = calculateInvoiceTax(value, invoice.taxType);
    }

    if (["netIncome", "tax", "deductibles"].includes(field)) {
      const netIncome =
        Number(field === "netIncome" ? value : invoice.netIncome) || 0;
      const tax =
        Number(field === "tax" ? value : changes.tax ?? invoice.tax) || 0;
      const deductibles = Number(
        field === "deductibles" ? value : invoice.deductibles,
      ) || 0;
      changes.grossIncome = netIncome - tax - deductibles;
    }

    return onUpdate(invoice.id, changes);
  };

  const formatAmount = (value, currency) =>
    value == null || value === "" ? "—" : formatMoney(value, currency || "PHP");

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError("");
    try {
      await onDelete(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      setDeleteError("Could not delete this invoice. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Billing workspace</p>

          <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
            Invoices
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create, organize, and track client invoices.
          </p>
        </div>

        <Button
          onClick={onCreate}
          leftSection={<IconPlus size={17} />}
          radius="xl"
          className="bg-brand hover:bg-[#c96300]"
        >
          Create Invoice
        </Button>
      </div>
      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

      {/* Search */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-white p-5">
          <TextInput
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            placeholder="Search invoices..."
            className="min-w-[220px] flex-1"
          />

          <Select
            value={status}
            onChange={setStatus}
            data={["All", ...STATUS_OPTIONS]}
            w={150}
          />
        </div>

        {filtered.length ? (
          <Table.ScrollContainer minWidth={1207}>
            <Table
              highlightOnHover
              horizontalSpacing="md"
              verticalSpacing="md"
              style={{ tableLayout: "fixed", minWidth: 1207, width: "100%" }}
              className="text-sm [&_tbody_tr:last-child_td]:border-b-0 [&_tbody_tr:hover]:bg-orange-50/40"
            >
              <colgroup>
                <col style={{ width: 130 }} />
                <col style={{ width: 140 }} />
                <col style={{ width: 135 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 145 }} />
                <col style={{ width: 135 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 56 }} />
              </colgroup>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Invoice</Table.Th>
                  <Table.Th>Client</Table.Th>
                  <Table.Th className="text-right">Net income</Table.Th>
                  <Table.Th>Posted date</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th className="border-l border-slate-200 text-right">Tax</Table.Th>
                  <Table.Th className="text-right">Deductibles</Table.Th>
                  <Table.Th className="bg-orange-50/70 text-right text-ink">Gross income</Table.Th>
                  <Table.Th aria-label="Actions" />
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {filtered.map((invoice) => (
                  <Table.Tr key={invoice.id}>
                    {/* Invoice ID */}
                    <Table.Td className="whitespace-nowrap px-2 py-1 font-medium text-ink">
                      {invoice.invoiceId || "—"}
                    </Table.Td>

                    {/* Client */}
                    <Table.Td className="whitespace-nowrap font-medium text-ink">
                      {clientName(invoice.employmentId)}
                    </Table.Td>

                    {/* Net Income */}
                    <Table.Td className="text-right tabular-nums">
                      <EditableCell
                        value={invoice.netIncome}
                        displayValue={formatAmount(invoice.netIncome, invoice.currency)}
                        type="number"
                        onSave={(value) =>
                          updateField(invoice, "netIncome", Number(value))
                        }
                      />
                    </Table.Td>

                    {/* Posted Date */}
                    <Table.Td>
                      <EditableCell
                        value={invoice.postedDate}
                        displayValue={invoice.postedDate
                          ? new Date(`${invoice.postedDate}T00:00:00`).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : undefined}
                        type="date"
                        onSave={(value) =>
                          updateField(invoice, "postedDate", value)
                        }
                      />
                    </Table.Td>

                    {/* Status */}
                    <Table.Td>
                      <Select
                        value={invoice.status}
                        data={STATUS_OPTIONS}
                        w="100%"
                        onChange={(value) =>
                          updateField(invoice, "status", value)
                        }
                        size="sm"
                        radius="xl"
                        styles={{
                          input: {
                            minHeight: 32,
                            border: "1px solid",
                            borderColor: {
                              Paid: "#bbf7d0",
                              Pending: "#fde68a",
                              Overdue: "#fecdd3",
                              Unpaid: "#e2e8f0",
                              Void: "#e2e8f0",
                            }[invoice.status] || "#e2e8f0",
                            backgroundColor: {
                              Paid: "#f0fdf4",
                              Pending: "#fffbeb",
                              Overdue: "#fff1f2",
                            }[invoice.status] || "#f8fafc",
                            color: {
                              Paid: "#15803d",
                              Pending: "#a16207",
                              Overdue: "#be123c",
                            }[invoice.status] || "#64748b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    </Table.Td>

                    {/* Tax */}
                    <Table.Td className="border-l border-slate-200 text-right tabular-nums">
                      <EditableCell
                        value={invoice.tax}
                        displayValue={formatAmount(invoice.tax, invoice.currency)}
                        type="number"
                        onSave={(value) =>
                          updateField(invoice, "tax", Number(value))
                        }
                      />
                    </Table.Td>

                    {/* Deductibles */}
                    <Table.Td className="text-right tabular-nums">
                      <EditableCell
                        value={invoice.deductibles}
                        displayValue={formatAmount(invoice.deductibles, invoice.currency)}
                        type="number"
                        onSave={(value) =>
                          updateField(invoice, "deductibles", Number(value))
                        }
                      />
                    </Table.Td>

                    {/* Gross Income */}
                    <Table.Td className="bg-orange-50/40 text-right font-semibold tabular-nums text-ink">
                      {formatAmount(invoice.grossIncome, invoice.currency)}
                    </Table.Td>

                    {/* Delete */}
                    <Table.Td className="text-right">
                      <Tooltip label="Delete invoice">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => {
                            setDeleteError("");
                            setDeleteTarget(invoice);
                          }}
                          aria-label={`Delete invoice ${invoice.invoiceId || ""}`}
                          className="text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : (
          <div className="px-6 py-16 text-center">
            <IconReceipt className="mx-auto text-slate-300" size={32} />

            <p className="mt-3 font-bold text-ink">No invoices found</p>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </section>

      <Modal
        opened={!!deleteTarget}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        title="Delete Invoice"
        centered
        radius="xl"
      >
        <Text size="sm" c="dimmed">
          Are you sure you want to delete invoice{" "}
          <strong>{deleteTarget?.invoiceId || "this invoice"}</strong>? This action
          cannot be undone.
        </Text>
        {deleteError && <Text size="sm" c="red" mt="sm">{deleteError}</Text>}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="default"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete} loading={deleting}>
            Delete invoice
          </Button>
        </div>
      </Modal>
    </div>
  );
}
