import { IconBook2 } from "@tabler/icons-react";

export default function Brand() {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200">
        <IconBook2 size={22} stroke={2.2} />
      </div>
      <div>
        <p className="font-display text-lg font-extrabold tracking-tight text-ink">
          ledger
        </p>
        <p className="-mt-1 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
          Work, organized
        </p>
      </div>
    </div>
  );
}
