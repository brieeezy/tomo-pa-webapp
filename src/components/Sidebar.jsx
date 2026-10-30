import {
  IconLayoutDashboard,
  IconReceipt,
  IconUsers,
  IconBriefcase,
} from "@tabler/icons-react";
import Brand from "./Brand";

const links = [
  { id: "overview", label: "Overview", icon: IconLayoutDashboard },
  { id: "employers", label: "Employers", icon: IconUsers },
  { id: "invoices", label: "Invoices", icon: IconReceipt },
  { id: "jobs", label: "Jobs", icon: IconBriefcase },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 border-r border-[#eee5da] bg-[#fff8f0]/85 px-5 py-7 backdrop-blur-xl lg:flex lg:flex-col">
      <Brand />
      <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
        Workspace
      </p>
      <nav className="space-y-1">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition ${active === id ? "bg-space text-white shadow-lg shadow-[#392f5a]/20 ring-1 ring-inset ring-[#9dd9d2]/35" : "text-slate-500 hover:bg-[#e8f7f5] hover:text-space"}`}
          >
            <Icon size={19} />
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto space-y-1">
        <div className="mt-5 rounded-2xl border border-[#9dd9d2]/60 bg-gradient-to-br from-[#e8f7f5] to-[#fff8f0] p-4">
          <p className="text-xs font-bold text-space">
            Your workspace, in sync
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Ask Tomo for a quick hand with your work.
          </p>
        </div>
      </div>
    </aside>
  );
}
