
import NeutralFace from "./NeutralFace"; 

const MoodHistory = ({ history }) => {
  return (
    <div className="rounded-lg border border-white/10 bg-[#242843]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
            Mood History
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-white">
            Today's Timeline
          </h2>
        </div>
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          Live
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 rounded-md bg-white/10 p-1">
        <button className="rounded bg-cyan-300/80 py-2 text-sm font-black text-cyan-950">
          Today
        </button>
        <button className="rounded py-2 text-sm font-bold text-white/75">
          7 Days
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {history.map((item) => (
          <div
            key={`${item.label}-${item.time}`}
            className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 py-3"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                item.active ? "bg-emerald-300" : "bg-amber-300"
              }`}
            />
            <NeutralFace small />
            <span className="flex-1 text-sm font-bold text-lime-300">
              {item.label}
            </span>
            <span className="text-xs font-semibold text-white/60">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodHistory;