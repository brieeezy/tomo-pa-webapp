import { useState } from "react";
import { Button, SimpleGrid, Modal, Text, Group } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { formatMoney } from "../utils/formatters";

export default function Employers({
  employers = [],
  onCreate,
  onDelete,
  onSelect,
}) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = () => {
    if (!deleteTarget) return;

    onDelete?.(deleteTarget.id);
    setDeleteTarget(null);
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
            Manage client details and default billing rates.
          </p>
        </div>
        <Button
          onClick={onCreate}
          leftSection={<IconPlus size={17} />}
          radius="xl"
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Add employer
        </Button>
      </div>
      {/* Employer Cards */}
      {employers.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
          {employers.map((employer) => (
            <div
              key={employer.id}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-soft"
              onClick={() => onSelect?.(employer)}
            >
              {/* Delete Button */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setDeleteTarget(employer);
                }}
                className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <IconTrash size={15} />
                Delete
              </button>

              {/* Employer Information */}
              <div className="flex h-full flex-col justify-between p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <IconPlus size={22} />
                </div>

                <div>
                  <h3 className="line-clamp-2 font-display text-lg font-bold text-ink">
                    {employer.name}
                  </h3>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {employer.email}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-indigo-600">
                    {formatMoney(employer.rate, employer.currency)}
                    <span className="ml-1 font-normal text-slate-400">
                      / hr
                    </span>
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
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
          This action cannot be undone.
        </Text>

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
