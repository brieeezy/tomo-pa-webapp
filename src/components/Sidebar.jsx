import {
  IconLayoutDashboard,
  IconReceipt,
  IconUsers,
  IconSettings,
  IconHelpCircle,
} from "@tabler/icons-react";
import Brand from "./Brand";

const links = [
  { id: "overview", label: "Overview", icon: IconLayoutDashboard },
  { id: "employers", label: "Employers", icon: IconUsers },
  { id: "invoices", label: "Invoices", icon: IconReceipt },
  { id: "jobs", label: "Job", icon: IconReceipt },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="hidden w-[250px] shrink-0 border-r border-white/70 bg-white/55 px-5 py-7 backdrop-blur-xl lg:flex lg:flex-col">
      <Brand />
      <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
        Workspace
      </p>
      <nav className="space-y-1">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition ${active === id ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200/70" : "text-slate-500 hover:bg-white hover:text-ink"}`}
          >
            <Icon size={19} />
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto space-y-1">
        <button className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold text-slate-500 hover:bg-white">
          <IconSettings size={19} /> Settings
        </button>
        <button className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold text-slate-500 hover:bg-white">
          <IconHelpCircle size={19} /> Help center
        </button>
        <div className="mt-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
          <p className="text-xs font-bold text-indigo-700">
            Keep your books tidy
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Track invoices and stay on top of your work.
          </p>
        </div>
      </div>
    </aside>
  );
}
