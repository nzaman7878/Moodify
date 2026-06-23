const RecommendationsSidebar = ({
  recommendations = [],
  handleSelectSong,
  moodLabels = {},
  currentSong,
}) => {
  return (
    <aside className="grid min-h-[660px] grid-rows-[1fr_220px] gap-5 overflow-hidden rounded-lg border border-white/10 bg-[#242843]/50 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-md">
      
      {/* Wrapper for Header and List */}
      <div className="flex min-h-0 flex-col gap-3">
        
        {/* The New Aesthetic Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 pl-1 pr-2">
          <div className="flex items-center gap-2.5">
            {/* Animated Pulsing AI Dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            {/* Gradient Headline Text */}
            <h2 className="bg-gradient-to-r from-cyan-300 to-emerald-200 bg-clip-text text-xs font-black uppercase tracking-[0.2em] text-transparent">
              AI Recommended Music
            </h2>
          </div>
        </div>

        {/* The Scrollable List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 hover:[&::-webkit-scrollbar-thumb]:bg-slate-500">
          {recommendations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
              <p className="text-sm font-medium">No songs available.</p>
            </div>
          ) : (
            <ol className="space-y-3">
              {recommendations.map((song, index) => {
                const isActive = currentSong?._id === song._id;

                return (
                  <li
                    key={song._id || `${song.title}-${index}`}
                    className={`group rounded-md transition-all duration-200 ${
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
                      className="grid w-full grid-cols-[22px_42px_1fr] items-center gap-3 px-2 py-1.5 text-left disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span
                        className={`text-xs font-bold ${isActive ? "text-cyan-400" : "text-slate-500"}`}
                      >
                        {isActive ? "▶" : index + 1}
                      </span>

                      <div className="h-10 w-10 overflow-hidden rounded">
                        <img
                          src={
                            song.posterUrl ||
                            `https://picsum.photos/seed/moodify-${index}/80`
                          }
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      <span className="min-w-0">
                        <span
                          className={`block truncate text-sm font-extrabold ${isActive ? "text-white" : "text-slate-200"}`}
                        >
                          {song.title}
                        </span>
                        <span
                          className={`block truncate text-xs font-medium ${isActive ? "text-cyan-300" : "text-slate-500"}`}
                        >
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

      {/* Focus Session Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[linear-gradient(135deg,#14131c,#213853_55%,#111827)] p-5 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col justify-end">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            Focus Session
          </p>
          <h3 className="mt-2 text-2xl font-black">Music tuned to your face</h3>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RecommendationsSidebar;