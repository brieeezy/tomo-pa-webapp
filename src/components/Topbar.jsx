import { IconBell, IconSearch, IconMenu2 } from "@tabler/icons-react";

export default function Topbar({ title, onMenu }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/70 bg-white/45 px-5 py-4 backdrop-blur-xl md:px-8">
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
        <button className="relative rounded-xl bg-white p-2.5 text-slate-500 shadow-sm">
          <IconBell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
          JM
        </div>
      </div>
    </header>
  );
}
