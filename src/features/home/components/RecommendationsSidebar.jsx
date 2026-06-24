const RecommendationsSidebar = ({
  recommendations = [],
  handleSelectSong,
  moodLabels = {},
  currentSong,
}) => {
  return (
    <aside className="grid min-h-[660px] grid-rows-[1fr_auto] gap-5 overflow-hidden rounded-2xl border border-white/10 bg-[#242843]/50 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-md">

      {/* ── Recommendations List ── */}
      <div className="flex min-h-0 flex-col gap-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-3 pl-1 pr-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
            </span>
            <h2 className="bg-gradient-to-r from-cyan-300 to-emerald-200 bg-clip-text text-xs font-black uppercase tracking-[0.2em] text-transparent">
              AI Recommended Music
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 hover:[&::-webkit-scrollbar-thumb]:bg-slate-500">
          {recommendations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
              <p className="text-sm font-medium">No songs available.</p>
            </div>
          ) : (
            <ol className="space-y-1">
              {recommendations.map((song, index) => {
                const isActive = currentSong?._id === song._id;
                return (
                  <li
                    key={song._id || `${song.title}-${index}`}
                    className={`group rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-cyan-500/20 shadow-sm ring-1 ring-cyan-400/50"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectSong(song)}
                      disabled={!song.url}
                      aria-current={isActive ? "true" : undefined}
                      className="grid w-full grid-cols-[22px_42px_1fr] items-center gap-3 px-2 py-2 text-left disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className={`text-xs font-bold ${isActive ? "text-cyan-400" : "text-slate-500"}`}>
                        {isActive ? "▶" : index + 1}
                      </span>

                      <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                        <img
                          src={song.posterUrl || `https://picsum.photos/seed/moodify-${index}/80`}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="text-[10px]">🎵</span>
                          </div>
                        )}
                      </div>

                      <span className="min-w-0">
                        <span className={`block truncate text-sm font-extrabold ${isActive ? "text-white" : "text-slate-200"}`}>
                          {song.title}
                        </span>
                        <span className={`block truncate text-xs font-medium ${isActive ? "text-cyan-300" : "text-slate-500"}`}>
                          {moodLabels[song.mood] || "Moodify Radio"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>

      {/* ── Focus Session Banner (redesigned) ── */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0f1a2e] via-[#0d2137] to-[#0a1628] p-5 text-white shadow-2xl">
        
        {/* Glow blobs */}
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-cyan-500/25 blur-2xl" />
        <div className="absolute -bottom-6 -left-4 h-20 w-20 rounded-full bg-emerald-500/20 blur-2xl" />

        {/* Top label row */}
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
            Focus Session
          </p>
          <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-2.5 py-1 text-[10px] font-bold text-cyan-300 ring-1 ring-cyan-400/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            LIVE
          </span>
        </div>

        {/* Headline */}
        <h3 className="relative z-10 mt-3 text-xl font-black leading-snug tracking-tight">
          Music tuned
          <br />
          <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            to your face
          </span>
        </h3>

        {/* Stats row */}
        <div className="relative z-10 mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400">Mood Match</span>
              <span className="text-[10px] font-black text-cyan-300">89%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 mt-4 flex flex-wrap gap-2">
          {["🎯 Mood-based", "🤖 AI Picks", "⚡ Real-time"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-slate-300 ring-1 ring-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RecommendationsSidebar;