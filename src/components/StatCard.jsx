export default function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tint = "indigo",
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <span
          className={`grid h-10 w-10 place-items-center rounded-2xl ${colors[tint]}`}
        >
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-400">{note}</p>
    </div>
  );
}
