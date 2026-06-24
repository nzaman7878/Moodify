import { useState } from "react";
import MoodAnalytics from "./MoodAnalytics";
import TimelineItem from "./TimelineItem"; 

const MoodHistory = ({ recentHistory = [], sevenDayHistory = [], onNoteUpdated, onDeleted, token }) => {
  // 1. Restored the Tab State
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-300/10 bg-gradient-to-r from-[#171d25]/95 to-[#1b2535]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* HEADER */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/80">
            Mood History
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white drop-shadow-md">
            {activeTab === "today" ? "Recent Scans" : "7-Day Trends"}
          </h2>
        </div>

        {/* Sleek LIVE Badge */}
        {activeTab === "today" && (
          <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-400 ring-1 ring-white/10 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Live
          </div>
        )}
      </div>

      {/* 2. RESTORED CLICKABLE TABS */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-2 rounded-xl bg-black/20 p-1.5 ring-1 ring-white/5 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab("today")}
          className={`rounded-lg py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
            activeTab === "today"
              ? "bg-gradient-to-r from-cyan-400 to-cyan-300 text-[#0b1120] shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab("7days")}
          className={`rounded-lg py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
            activeTab === "7days"
              ? "bg-gradient-to-r from-cyan-400 to-cyan-300 text-[#0b1120] shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          7 Days
        </button>
      </div>

      {/* 3. CONDITIONAL CONTENT RENDER */}
      <div className="relative z-10 mt-5 space-y-3">
        {activeTab === "today" ? (
          recentHistory.length === 0 ? (
            /* Premium Empty State */
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 py-12 ring-1 ring-white/10">
              <div className="h-8 w-8 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center mb-3">
                <div className="h-2 w-2 rounded-full bg-slate-500/50" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                No history recorded yet
              </p>
            </div>
          ) : (
            recentHistory.map((item, index) => (
              <TimelineItem 
                key={item._id || `${item.label}-${item.time}-${index}`}
                item={item}
                index={index}
                token={token}
                onNoteUpdated={onNoteUpdated}
                onDeleted={onDeleted}
              />
            ))
          )
        ) : (
          <div className="pt-2">
            <MoodAnalytics data={sevenDayHistory} />
          </div>
        )}
      </div>

    </div>
  );
};

export default MoodHistory;