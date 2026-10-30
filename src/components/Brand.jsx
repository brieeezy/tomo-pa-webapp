import logo from "../assets/tomo-logo.svg";

export default function Brand() {
  return (
    <div className="flex items-center gap-3 px-1">
      <img src={logo} alt="Tomo" className="h-10 w-10 rounded-2xl object-cover shadow-sm" />
      <div>
        <p className="font-display text-lg font-extrabold tracking-tight text-ink">
          tomo
        </p>
        <p className="-mt-1 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
          AI personal assistant
        </p>
      </div>
    </div>
  );
}
