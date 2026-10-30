import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBriefcase,
  IconSearch,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import EmployerModal from "../components/EmployerModal";

const Detail = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-1 break-words text-sm font-medium text-ink">
      {value || "—"}
    </p>
  </div>
);

const descriptionHeadings = [
  "About Our Client",
  "Job Description",
  "Responsibilities",
  "Requirements",
  "Qualifications",
  "Benefits",
];

function getDescriptionLines(description = "") {
  const headingPattern = new RegExp(
    `\\b(${descriptionHeadings.join("|")})\\b`,
    "gi",
  );

  return String(description)
    .replace(/\s*[•●▪]\s*/g, "\n• ")
    .replace(headingPattern, "\n$1\n")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function JobDescription({ description }) {
  const lines = getDescriptionLines(description);

  if (!lines.length) {
    return <p className="text-sm leading-7 text-slate-500">No description provided.</p>;
  }

  return (
    <div className="space-y-2 text-sm leading-7 text-slate-600">
      {lines.map((line, index) => {
        const isHeading = descriptionHeadings.some(
          (heading) => heading.toLowerCase() === line.toLowerCase(),
        );

        if (isHeading) {
          return (
            <h4 key={`${index}-${line}`} className="pt-2 font-bold text-ink">
              {line}
            </h4>
          );
        }

        if (line.startsWith("•")) {
          return (
            <p key={`${index}-${line}`} className="flex gap-2">
              <span aria-hidden="true" className="text-brand">•</span>
              <span>{line.slice(1).trim()}</span>
            </p>
          );
        }

        return <p key={`${index}-${line}`}>{line}</p>;
      })}
    </div>
  );
}

export default function Jobs({
  jobs: initialJobs = [],
  onViewJob,
  onCreateEmployment,
  onToggleImportant,
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [importance, setImportance] = useState("All jobs");
  const [selectedJob, setSelectedJob] = useState(null);
  const [employmentJob, setEmploymentJob] = useState(null);

  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  const filtered = useMemo(
    () =>
      jobs.filter((job) => {
        const matchesSearch = [
          job.jobTitle,
          job.clientName,
          job.jobDescription,
          ...(job.tags || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesImportance =
          importance === "All jobs" ||
          (importance === "Important" ? job.isImportant : !job.isImportant);
        return matchesSearch && matchesImportance;
      }),
    [jobs, search, importance],
  );

  const toggleImportant = (event, job) => {
    event.stopPropagation();
    const updated = { ...job, isImportant: !job.isImportant };
    setJobs((current) =>
      current.map((item) => (item.id === job.id ? updated : item)),
    );
    onToggleImportant?.(updated);
  };
  const createEmployment = (values) => {
    onCreateEmployment?.({ ...employmentJob, ...values });
    setEmploymentJob(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Opportunities workspace</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
            Jobs
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Explore recommended roles and add them to your employment records.
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-soft">
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-5">
          <TextInput
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            placeholder="Search jobs or clients..."
            className="min-w-[220px] flex-1"
          />
          <Select
            value={importance}
            onChange={setImportance}
            data={["All jobs", "Important", "Not important"]}
            w={170}
          />
        </div>
        {filtered.length ? (
          <div className="space-y-3 p-4 sm:p-5">
            {filtered.map((job) => (
              <article
                key={job.id}
                onClick={() => { onViewJob?.(job); setSelectedJob(job); }}
                className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#ffe5cc] hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff1e3] text-brand sm:flex">
                      <IconBriefcase size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-ink">
                          {job.jobTitle}
                        </h3>
                        {job.isImportant && (
                          <Badge color="yellow" variant="light" radius="xl">
                            Important
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {job.clientName}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {job.jobDescription}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        <span>{job.location}</span>
                        <span>{job.employmentType}</span>
                        <span>{job.payRange || "Salary not listed"}</span>
                        {job.isRemote && <span>Remote</span>}
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-end"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Tooltip
                      label={
                        job.isImportant
                          ? "Remove important label"
                          : "Mark as important"
                      }
                    >
                      <ActionIcon
                        variant="subtle"
                        color={job.isImportant ? "yellow" : "gray"}
                        size="lg"
                        onClick={(event) => toggleImportant(event, job)}
                        aria-label={
                          job.isImportant
                            ? "Remove important label"
                            : "Mark as important"
                        }
                      >
                        <span className="flex">
                          {job.isImportant ? (
                            <IconStarFilled size={18} />
                          ) : (
                            <IconStar size={18} />
                          )}
                        </span>
                      </ActionIcon>
                    </Tooltip>
                    <Button
                      variant="light"
                      color="orange"
                      rightSection={<IconArrowRight size={16} />}
                      onClick={() => setEmploymentJob(job)}
                    >
                      Add Employment
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <IconBriefcase className="mx-auto text-slate-300" size={32} />
            <p className="mt-3 font-bold text-ink">No jobs found</p>
            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </section>

      <Modal
        opened={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={
          <div>
            <p className="font-display text-xl font-extrabold text-ink">
              Job details
            </p>
            <p className="mt-1 text-sm font-normal text-slate-400">
              Role details from Tomo job listings.
            </p>
          </div>
        }
        centered
        size="xl"
        radius="2xl"
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
          },
        }}
      >
        {selectedJob && (
          <Stack gap="md">
            <div>
              <p className="text-sm font-semibold text-brand">
                {selectedJob.clientName}
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-ink">
                {selectedJob.jobTitle}
              </h3>
            </div>
            <JobDescription description={selectedJob.jobDescription} />
            <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 [&>*]:min-w-0">
              <Detail label="Shift" value={selectedJob.shiftSchedule} />
              <Detail label="Languages" value={selectedJob.progLang} />
              <Detail label="Location" value={selectedJob.location} />
              <Detail
                label="Employment type"
                value={selectedJob.employmentType}
              />
              <Detail label="Posted date" value={selectedJob.postedOn} />
              <Detail label="Skills" value={selectedJob.tags?.join(", ")} />
              <Detail label="Employer" value={selectedJob.employerName} />
              <Detail label="Publisher" value={selectedJob.jobPublisher} />
              <Detail label="Pay range" value={selectedJob.payRange} />
              <Detail label="Work arrangement" value={selectedJob.isRemote ? "Remote" : "On-site / unspecified"} />
              <Detail label="Employer website" value={selectedJob.employerWebsite} />
            </div>
            {selectedJob.applyLink && (
              <Button
                component="a"
                href={selectedJob.applyLink}
                target="_blank"
                rel="noreferrer"
                radius="xl"
                variant="light"
              >
                View application
              </Button>
            )}
            <Button
              radius="xl"
              className="bg-brand hover:bg-[#c96300]"
              onClick={() => {
                setEmploymentJob({
                  clientName:
                    selectedJob.clientName || selectedJob.employerName || "",
                  jobDesc:
                    selectedJob.jobDescription || selectedJob.jobDesc || "",
                  shift: selectedJob.shiftSchedule || selectedJob.shift || "Not specified",
                  priority: 2,
                  contactPerson: selectedJob.contactPerson || "",
                  contactPhone: selectedJob.contactPhone || selectedJob.phoneNumber || "",
                  contactEmail: selectedJob.contactEmail || selectedJob.emailAddress || "",
                });
                setSelectedJob(null);
              }}
            >
              Add Employment
            </Button>
          </Stack>
        )}
      </Modal>
      <EmployerModal
        opened={!!employmentJob}
        onClose={() => setEmploymentJob(null)}
        initialValues={employmentJob || undefined}
        onSave={createEmployment}
      />
    </div>
  );
}
