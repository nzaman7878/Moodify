import { useState } from "react";
import MoodFace from "./MoodFace";
import MoodAnalytics from "./MoodAnalytics";
import TimelineItem from "./TimelineItem"; 

const MoodHistory = ({ recentHistory = [], sevenDayHistory = [], onNoteUpdated, token }) => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="rounded-lg border border-white/10 bg-[#242843]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      
     
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

      
      <div className="mt-4 space-y-3">
        {activeTab === "today" ? (
         
          recentHistory.length === 0 ? (
            <div className="py-6 text-center text-sm font-medium text-slate-400">
              No history recorded yet.
            </div>
          ) : (
            recentHistory.map((item, index) => (
              
              <TimelineItem 
                key={item._id || `${item.label}-${item.time}-${index}`}
                item={item}
                index={index}
                token={token}
                onNoteUpdated={onNoteUpdated}
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