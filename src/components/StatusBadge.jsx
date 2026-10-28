export default function StatusBadge({ status }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Pending: "bg-amber-50 text-amber-700 ring-amber-100",
    Overdue: "bg-rose-50 text-rose-700 ring-rose-100",
    Active: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    Paused: "bg-slate-100 text-slate-500 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${styles[status] || styles.Pending}`}
    >
      {status}
    </span>
  );
}
