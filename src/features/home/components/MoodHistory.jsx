import { useState } from "react";
import MoodFace from "./MoodFace";
import MoodAnalytics from "./MoodAnalytics"; // 1. Import the Analytics component!

const MoodHistory = ({ recentHistory = [], sevenDayHistory = [] }) => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="rounded-lg border border-white/10 bg-[#242843]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
            Mood History
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-white">
            {activeTab === "today" ? "Today's Timeline" : "Past 7 Days"}
          </h2>
        </div>

        {activeTab === "today" && (
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" />
            Live
          </span>
        )}
      </div>

      {/* TAB BUTTONS */}
      <div className="mt-5 grid grid-cols-2 rounded-md bg-white/10 p-1">
        <button
          onClick={() => setActiveTab("today")}
          className={`rounded py-2 text-sm transition-all duration-200 ${
            activeTab === "today"
              ? "bg-cyan-300/80 font-black text-cyan-950 shadow-sm"
              : "font-bold text-white/75 hover:bg-white/5"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab("7days")}
          className={`rounded py-2 text-sm transition-all duration-200 ${
            activeTab === "7days"
              ? "bg-cyan-300/80 font-black text-cyan-950 shadow-sm"
              : "font-bold text-white/75 hover:bg-white/5"
          }`}
        >
          7 Days
        </button>
      </div>

      {/* CONTENT AREA: Conditionally render List vs Chart */}
      <div className="mt-4 space-y-3">
        {activeTab === "today" ? (
          
          /* --- TODAY VIEW: The Timeline List --- */
          recentHistory.length === 0 ? (
            <div className="py-6 text-center text-sm font-medium text-slate-400">
              No history recorded yet.
            </div>
          ) : (
            recentHistory.map((item, index) => (
              <div
                key={item._id || `${item.label}-${item.time}-${index}`}
                className="group flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 py-3 transition-colors hover:bg-white/10"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    item.active
                      ? "bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]"
                      : "bg-amber-300"
                  }`}
                />
                <MoodFace mood={item.label} small />
                <span className="flex-1 text-sm font-bold text-lime-300">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-white/60">
                  {item.time}
                </span>
              </div>
            ))
          )
        ) : (
          
          /* --- 7 DAYS VIEW: The Recharts Graph --- */
          <div className="pt-2">
            <MoodAnalytics data={sevenDayHistory} />
          </div>
          
        )}
      </div>
    </div>
  );
};

export default MoodHistory;