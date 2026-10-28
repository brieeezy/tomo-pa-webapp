import {
  IconReceipt,
  IconWallet,
  IconClockHour4,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { Button, Table } from "@mantine/core";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { calculateInvoice, formatMoney, formatDate } from "../utils/formatters";

export default function Overview({ invoices, employers, onNavigate }) {
  const total = invoices.reduce(
    (sum, invoice) => sum + calculateInvoice(invoice),
    0,
  );
  const paid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + calculateInvoice(i), 0);
  const pending = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((sum, i) => sum + calculateInvoice(i), 0);
  const employerName = (id) =>
    employers.find((e) => String(e.id) === String(id))?.name ||
    "Unknown employer";
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Tuesday, October 27, 2026
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
            Good afternoon, JM <span>✦</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Here’s what’s happening with your ledger.
          </p>
        </div>
        <Button
          radius="xl"
          leftSection={<IconReceipt size={17} />}
          onClick={() => onNavigate("invoices")}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          View invoices
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total invoiced"
          value={formatMoney(total)}
          note={`${invoices.length} invoices recorded`}
          icon={IconWallet}
        />
        <StatCard
          label="Paid to date"
          value={formatMoney(paid)}
          note="Successfully collected"
          icon={IconReceipt}
          tint="emerald"
        />
        <StatCard
          label="Awaiting payment"
          value={formatMoney(pending)}
          note="Pending or overdue invoices"
          icon={IconClockHour4}
          tint="amber"
        />
      </div>
      <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-soft">
        <div className="flex items-center justify-between px-5 py-5 md:px-6">
          <div>
            <h3 className="font-display text-lg font-extrabold text-ink">
              Recent invoices
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              A quick look at your latest billing activity.
            </p>
          </div>
          <button
            onClick={() => onNavigate("invoices")}
            className="flex items-center gap-1 text-sm font-bold text-indigo-600"
          >
            All invoices <IconArrowUpRight size={16} />
          </button>
        </div>
        <Table.ScrollContainer minWidth={680}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Invoice</Table.Th>
                <Table.Th>Employer</Table.Th>
                <Table.Th>Issue date</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {invoices.slice(0, 5).map((i) => (
                <Table.Tr key={i.id}>
                  <Table.Td>
                    <span className="font-bold text-ink">{i.id}</span>
                    <p className="mt-1 text-xs text-slate-400">
                      {i.description}
                    </p>
                  </Table.Td>
                  <Table.Td>{employerName(i.employerId)}</Table.Td>
                  <Table.Td>{formatDate(i.issueDate)}</Table.Td>
                  <Table.Td className="font-bold">
                    {formatMoney(calculateInvoice(i))}
                  </Table.Td>
                  <Table.Td>
                    <StatusBadge status={i.status} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </section>
    </div>
  );
}
