import MoodFace from "./MoodFace";

const moodAccents = {
  happy:     { bar: "from-yellow-400 to-amber-300",   border: "border-yellow-400/20", glow: "rgba(250,204,21,0.15)"  },
  sad:       { bar: "from-blue-400 to-cyan-300",      border: "border-blue-400/20",   glow: "rgba(96,165,250,0.15)" },
  angry:     { bar: "from-red-500 to-orange-400",     border: "border-red-500/20",    glow: "rgba(239,68,68,0.15)"  },
  surprised: { bar: "from-purple-400 to-pink-300",    border: "border-purple-400/20", glow: "rgba(192,132,252,0.15)"},
  neutral:   { bar: "from-violet-400 via-sky-300 to-cyan-200", border: "border-cyan-300/10", glow: "rgba(34,211,238,0.10)" },
};

const CurrentMoodCard = ({ selectedMood, detectedMood, moodLabels }) => {
  const activeMood = (selectedMood || detectedMood || "neutral").toLowerCase();
  const displayLabel = moodLabels[activeMood] || detectedMood || "Neutral";
  const accent = moodAccents[activeMood] || moodAccents.neutral;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${accent.border} bg-gradient-to-r from-[#171d25]/95 to-[#1b2535]/90 px-8 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)]`}
      style={{ boxShadow: `0 0 80px ${accent.glow}, 0 24px 80px rgba(0,0,0,0.32)` }}
    >
      {/* Ambient glow blob */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl opacity-30"
        style={{ background: accent.glow.replace("0.15", "1").replace("rgba", "rgb").replace(/,\s*[\d.]+\)/, ")") }}
      />

      <div className="relative z-10 flex items-center justify-between gap-6">
        {/* Left — text content */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/80">
            Current Mood Analysis
          </p>

          {/* Mood name */}
          <h1 className="mt-3 text-5xl font-black leading-none tracking-tight text-white drop-shadow-lg capitalize">
            {displayLabel}
          </h1>

          {/* Divider */}
          <div className="mt-5 h-px w-full bg-white/5" />

          {/* Progress bar + stats row */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Confidence
                </span>
                <span className="text-[10px] font-black text-white/70">89%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${accent.bar} transition-all duration-700`}
                  style={{ width: "89%" }}
                />
              </div>
            </div>

            {/* Stat pill */}
            <div className="shrink-0 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 text-center">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Match</p>
              <p className="text-lg font-black text-white leading-none mt-0.5">89%</p>
            </div>
          </div>

          {/* Mood pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["🎯 AI Detected", "⚡ Live", "🧠 MediaPipe"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-slate-300 ring-1 ring-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — animated face */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <MoodFace mood={activeMood} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {displayLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrentMoodCard;