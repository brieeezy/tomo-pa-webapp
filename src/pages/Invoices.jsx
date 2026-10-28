import { useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Select,
  Table,
  TextInput,
  Tooltip,
} from "@mantine/core";

import {
  IconPlus,
  IconSearch,
  IconReceipt,
  IconTrash,
} from "@tabler/icons-react";

import StatusBadge from "../components/StatusBadge";
import EditableCell from "../components/EditableCell";

import { formatMoney, formatDate } from "../utils/formatters";

const STATUS_OPTIONS = ["Pending", "Paid", "Overdue"];

export default function Invoices({
  invoices,
  employers,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const clientName = (id) =>
    employers.find((employer) => String(employer.id) === String(id))?.name ||
    "Unknown client";

  const filtered = useMemo(
    () =>
      invoices.filter((invoice) => {
        const matchesStatus = status === "All" || invoice.status === status;

        const matchesSearch = [
          invoice.id,
          invoice.client,
          clientName(invoice.employerId),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
      }),
    [invoices, search, status, employers],
  );

  const updateField = (invoice, field, value) => {
    onUpdate(invoice.id, {
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
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
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Create Invoice
        </Button>
      </div>

      {/* Search */}
      <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-soft">
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-5">
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
          <Table.ScrollContainer minWidth={1100}>
            <Table
              highlightOnHover
              horizontalSpacing="md"
              verticalSpacing="sm"
              className="text-sm"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Invoice ID</Table.Th>
                  <Table.Th>Client</Table.Th>
                  <Table.Th>Net Income</Table.Th>
                  <Table.Th>Posted Date</Table.Th>
                  <Table.Th>Status</Table.Th>

                  <Table.Th className="border-l border-slate-300">Tax</Table.Th>

                  <Table.Th>Deductibles</Table.Th>
                  <Table.Th>Gross Income</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {filtered.map((invoice) => (
                  <Table.Tr key={invoice.id}>
                    {/* Invoice ID */}
                    <Table.Td>
                      <EditableCell
                        value={invoice.id}
                        onSave={(value) => updateField(invoice, "id", value)}
                      />
                    </Table.Td>

                    {/* Client */}
                    <Table.Td>
                      <EditableCell
                        value={invoice.client ?? clientName(invoice.employerId)}
                        onSave={(value) =>
                          updateField(invoice, "client", value)
                        }
                      />
                    </Table.Td>

                    {/* Net Income */}
                    <Table.Td>
                      <EditableCell
                        value={invoice.netIncome}
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
                        onChange={(value) =>
                          updateField(invoice, "status", value)
                        }
                        variant="unstyled"
                        size="xs"
                      />
                    </Table.Td>

                    {/* Tax */}
                    <Table.Td className="border-l border-slate-300">
                      <EditableCell
                        value={invoice.tax}
                        type="number"
                        onSave={(value) =>
                          updateField(invoice, "tax", Number(value))
                        }
                      />
                    </Table.Td>

                    {/* Deductibles */}
                    <Table.Td>
                      <EditableCell
                        value={invoice.deductibles}
                        type="number"
                        onSave={(value) =>
                          updateField(invoice, "deductibles", Number(value))
                        }
                      />
                    </Table.Td>

                    {/* Gross Income */}
                    <Table.Td>
                      <EditableCell
                        value={invoice.grossIncome}
                        type="number"
                        onSave={(value) =>
                          updateField(invoice, "grossIncome", Number(value))
                        }
                      />
                    </Table.Td>

                    {/* Delete */}
                    <Table.Td>
                      <Tooltip label="Delete invoice">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => onDelete(invoice.id)}
                          aria-label="Delete invoice"
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
    </div>
  );
}
