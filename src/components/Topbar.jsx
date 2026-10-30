import { IconBell, IconSearch, IconMenu2, IconLogout } from "@tabler/icons-react";
import { Popover } from "@mantine/core";
import { useState } from "react";

export default function Topbar({ title, onMenu, onLogout, newJobs = [], onOpenJobs }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#eee5da] bg-[#fff8f0]/80 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-xl p-2 text-slate-500 hover:bg-white lg:hidden"
        >
          <IconMenu2 size={20} />
        </button>
        <div>
          <p className="text-xs font-medium text-slate-400">
            Workspace / {title}
          </p>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-ink">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-white bg-white/80 px-3 py-2 text-sm text-slate-400 sm:flex">
          <IconSearch size={16} /> Search
        </div>
        <Popover opened={notificationsOpen} onChange={setNotificationsOpen} position="bottom-end" shadow="md" width={320} withinPortal>
          <Popover.Target>
            <button
              onClick={() => setNotificationsOpen((open) => !open)}
              className="relative rounded-xl bg-white p-2.5 text-slate-500 shadow-sm"
              aria-label={`Notifications${newJobs.length ? `, ${newJobs.length} new jobs` : ""}`}
              aria-expanded={notificationsOpen}
            >
              <IconBell size={18} />
              {newJobs.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{newJobs.length}</span>}
            </button>
          </Popover.Target>
          <Popover.Dropdown className="max-h-96 overflow-y-auto">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-bold text-ink">New job listings</p>
              <span className="text-xs text-slate-400">{newJobs.length} unread</span>
            </div>
            {newJobs.length ? (
              <div className="space-y-1">
                {newJobs.slice(0, 8).map((job) => (
                  <button key={job.id} onClick={() => { onOpenJobs?.(); setNotificationsOpen(false); }} className="block w-full rounded-lg p-2 text-left hover:bg-[#fff8f0]">
                    <span className="block truncate text-sm font-semibold text-ink">{job.jobTitle || "New job listing"}</span>
                    <span className="block truncate text-xs text-slate-500">{job.clientName || job.employerName || "Employer not listed"}</span>
                  </button>
                ))}
                {newJobs.length > 8 && <p className="px-2 pt-1 text-xs text-slate-400">And {newJobs.length - 8} more</p>}
                <button onClick={() => { onOpenJobs?.(); setNotificationsOpen(false); }} className="mt-1 w-full rounded-lg bg-[#fff1e3] px-3 py-2 text-sm font-bold text-brand hover:bg-[#ffe8d2]">View jobs</button>
              </div>
            ) : <p className="py-3 text-sm text-slate-500">You’re all caught up.</p>}
          </Popover.Dropdown>
        </Popover>
        <button onClick={onLogout} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-500 transition hover:bg-[#e8f7f5] hover:text-space" aria-label="Sign out">
          <IconLogout size={17} /><span className="hidden sm:inline">Sign out</span>
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-space text-xs font-bold text-[#9dd9d2] ring-2 ring-[#9dd9d2]/50">
          JM
        </div>
      </div>
    </header>
  );
}
