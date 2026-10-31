import { useState } from "react";
import { Badge, Button, SimpleGrid, Modal, Text, Group, Stack } from "@mantine/core";
import { IconPlus, IconTrash, IconBuilding, IconPencil } from "@tabler/icons-react";
import EmployerModal from "../components/EmployerModal";

const priorityLabels = { 1: "Low", 2: "Medium", 3: "High" };

export default function Employers({
  employers = [],
  onCreate,
  onDelete,
  onUpdate,
  onSelect,
  error,
}) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await onDelete?.(deleteTarget.id);
      setDeleteTarget(null);
      setDeleteError("");
    } catch {
      setDeleteError("Could not delete this employer. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">People & companies</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
            Employers
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage client details, job descriptions, and contacts.
          </p>
        </div>
        <Button
          onClick={onCreate}
          leftSection={<IconPlus size={17} />}
          radius="xl"
          className="bg-brand hover:bg-[#c96300]"
        >
          Add client
        </Button>
      </div>
      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
      {/* Employer Cards */}
      {employers.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
          {employers.map((employer) => (
            <div
              key={employer.id}
              className="group relative min-h-64 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-soft"
              onClick={() => {
                setSelectedEmployer(employer);
                onSelect?.(employer);
              }}
            >
              {/* Delete Button */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setEditTarget(employer);
                }}
                aria-label={`Edit ${employer.clientName}`}
                className="absolute right-24 top-3 z-10 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-orange-50 hover:text-brand"
              >
                <IconPencil size={15} />
                Edit
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setDeleteError("");
                  setDeleteTarget(employer);
                }}
                className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <IconTrash size={15} />
                Delete
              </button>

              {/* Employer Information */}
              <div className="flex h-full flex-col items-start gap-3 p-6">
                {employer.companyLogo || employer.logoUrl || employer.logo ? (
                  <img
                    src={employer.companyLogo || employer.logoUrl || employer.logo}
                    alt={`${employer.clientName} company logo`}
                    className="h-14 w-14 shrink-0 rounded-full border border-slate-200 bg-white object-contain"
                  />
                ) : (
                  <div
                    aria-label="Company logo placeholder"
                    className="h-14 w-14 shrink-0 rounded-full border border-slate-200 bg-white"
                  />
                )}

                <div className="w-full">
                  <h3 className="line-clamp-2 font-display text-lg font-bold text-ink">
                    {employer.clientName}
                  </h3>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {employer.contactEmail}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {employer.shift && <Badge variant="light">{employer.shift}</Badge>}
                    {employer.priority != null && (
                      <Badge color="orange" variant="light">
                        {priorityLabels[employer.priority] || `Priority ${employer.priority}`}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">{employer.jobDesc}</p>
                  <p className="mt-2 truncate text-xs text-slate-400">
                    {employer.contactPerson}{employer.contactPhone ? ` · ${employer.contactPhone}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </SimpleGrid>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-14 text-center">
          <p className="font-semibold text-slate-500">No clients yet.</p>

          <p className="mt-2 text-sm text-slate-400">
            Add your first client to get started.
          </p>
        </div>
      )}

      <Modal
        opened={!!selectedEmployer}
        onClose={() => setSelectedEmployer(null)}
        title={
          <div className="flex items-center gap-3">
            {selectedEmployer?.companyLogo || selectedEmployer?.logoUrl || selectedEmployer?.logo ? (
              <img
                src={selectedEmployer.companyLogo || selectedEmployer.logoUrl || selectedEmployer.logo}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full border border-slate-200 object-contain"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400">
                <IconBuilding size={21} />
              </div>
            )}
            <div>
              <p className="font-display text-xl font-extrabold text-ink">
                Employer details
              </p>
              <p className="mt-1 text-sm font-normal text-slate-400">
                {selectedEmployer?.clientName}
              </p>
            </div>
          </div>
        }
        centered
        radius="2xl"
        size="lg"
        styles={{
          content: {
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100dvh - 2rem)",
            height: "min(760px, calc(100dvh - 2rem))",
            overflow: "hidden",
          },
          header: { flex: "0 0 auto" },
          body: {
            flex: "1 1 auto",
            minHeight: 0,
            overflow: "auto",
            overscrollBehavior: "contain",
            padding: "12px 40px",
          },
        }}
      >
        {selectedEmployer && (
          <Stack gap="md">
            <div>
              <p className="text-sm font-semibold text-brand">{selectedEmployer.clientName}</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-ink">
                Employer information
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedEmployer.shift && <Badge variant="light">{selectedEmployer.shift}</Badge>}
              {selectedEmployer.priority != null && (
                <Badge color="orange" variant="light">
                  {priorityLabels[selectedEmployer.priority] || `Priority ${selectedEmployer.priority}`}
                </Badge>
              )}
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 [&>*]:min-w-0">
              <Detail label="Contact person" value={selectedEmployer.contactPerson} />
              <Detail label="Contact email" value={selectedEmployer.contactEmail} />
              <Detail label="Phone" value={selectedEmployer.contactPhone} />
              <Detail label="Income / pay range" value={getIncomePayRange(selectedEmployer)} />
            </div>
            <section>
              <h4 className="text-xs text-slate-400">Job description</h4>
              <JobDescription description={selectedEmployer.jobDesc} />
            </section>
          </Stack>
        )}
      </Modal>

      <EmployerModal
        opened={!!editTarget}
        onClose={() => setEditTarget(null)}
        initialValues={editTarget || undefined}
        editing
        onSave={(values) => {
          const { id, ...changes } = values;
          return onUpdate?.(editTarget.id, changes);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        opened={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete employer"
        centered
        radius="xl"
      >
        <Text size="sm" c="dimmed">
          Are you sure you want to delete <strong>{deleteTarget?.clientName}</strong>?
          This action cannot be undone.
        </Text>
        {deleteError && <Text size="sm" c="red">{deleteError}</Text>}

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>

          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

function Detail({ label, value }) {
  return <div className="min-w-0">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-1 break-words text-sm font-medium text-ink">{value || "—"}</p>
  </div>;
}

function getIncomePayRange(employer) {
  if (employer.payRange) return employer.payRange;
  const amount = employer.amount != null && employer.amount !== ""
    ? `${employer.currency ? `${employer.currency} ` : ""}${employer.amount}`
    : "";
  return [employer.incomeType, amount].filter(Boolean).join(" · ");
}

function JobDescription({ description }) {
  const lines = String(description || "")
    .replace(/\s*[•●▪]\s*/g, "\n• ")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return <p className="mt-1 text-sm text-ink">—</p>;

  return (
    <div className="mt-2 space-y-2 text-sm leading-6 text-ink">
      {lines.map((line, index) => line.startsWith("•") ? (
        <p key={`${index}-${line}`} className="flex gap-2">
          <span aria-hidden="true" className="shrink-0 text-brand">•</span>
          <span>{line.slice(1).trim()}</span>
        </p>
      ) : <p key={`${index}-${line}`}>{line}</p>)}
    </div>
  );
}
