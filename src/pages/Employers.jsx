import { useState } from "react";
import { Badge, Button, SimpleGrid, Modal, Text, Group } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

const priorityLabels = { 1: "Low", 2: "Medium", 3: "High" };

export default function Employers({
  employers = [],
  onCreate,
  onDelete,
  onSelect,
  error,
}) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

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
          Add employer
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
              onClick={() => onSelect?.(employer)}
            >
              {/* Delete Button */}
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
              <div className="flex h-full flex-col justify-between p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e3] text-brand">
                  <IconPlus size={22} />
                </div>

                <div>
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
          <p className="font-semibold text-slate-500">No employers yet.</p>

          <p className="mt-2 text-sm text-slate-400">
            Add your first employer to get started.
          </p>
        </div>
      )}

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
