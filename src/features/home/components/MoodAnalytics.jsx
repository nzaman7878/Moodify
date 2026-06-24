import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Shared design system accents
const moodAccents = {
  happy:     { bar: "from-yellow-400 to-amber-300",  border: "border-yellow-400/20", glow: "rgba(250,204,21,0.15)"  },
  sad:       { bar: "from-blue-400 to-cyan-300",     border: "border-blue-400/20",   glow: "rgba(96,165,250,0.15)" },
  angry:     { bar: "from-red-500 to-orange-400",    border: "border-red-500/20",    glow: "rgba(239,68,68,0.15)"  },
  surprised: { bar: "from-purple-400 to-pink-300",   border: "border-purple-400/20", glow: "rgba(192,132,252,0.15)"},
  neutral:   { bar: "from-violet-400 via-sky-300 to-cyan-200", border: "border-cyan-300/10", glow: "rgba(34,211,238,0.10)" },
};

// Fallback data just in case the array is completely empty
const fallbackData = [
  { day: "Today", mood: "Neutral", score: 50, time: "Now" }
];

// Custom Premium Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const activeKey = ["happy", "sad", "angry", "surprised", "neutral"].includes((data.mood || "").toLowerCase())
      ? data.mood.toLowerCase()
      : "neutral";
    const accent = moodAccents[activeKey];

    return (
      <div 
        className={`rounded-xl border ${accent.border} bg-[#0b1120]/95 p-4 backdrop-blur-md transition-colors duration-300`}
        style={{ boxShadow: `0 8px 32px ${accent.glow}` }}
      >
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {data.day} • {data.time}
        </p>
        <p className="mt-1 text-2xl font-black text-white drop-shadow-md capitalize">
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accent.bar}`}>
            {data.mood}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const MoodAnalytics = ({ data = [] }) => {

  // 1. DATA NORMALIZER: Formats database timestamps and assigns charting scores
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return fallbackData;

    return data.map((item) => {
      // If the data is already formatted (e.g., dummy data), return it
      if (item.day && item.time && item.score !== undefined) return item;

      // Ensure we have a valid date object from the database timestamp (createdAt)
      const dateObj = new Date(item.createdAt || item.date || Date.now());
      
      // Standardize the mood text
      const moodText = item.mood || item.label || "Neutral";
      const moodKey = moodText.toLowerCase();

      // Assign numerical scores so the chart renders peaks and valleys
      let chartScore = 50; // Neutral default
      if (moodKey === "happy") chartScore = 90;
      if (moodKey === "surprised") chartScore = 75;
      if (moodKey === "sad") chartScore = 25;
      if (moodKey === "angry") chartScore = 10;

      return {
        ...item,
        mood: moodText,
        score: chartScore,
        day: dateObj.toLocaleDateString("en-US", { weekday: "short" }), // "Mon"
        time: dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), // "2:00 PM"
      };
    });
  }, [data]);

  // 2. DYNAMIC INSIGHT GENERATOR
  const generatedInsight = useMemo(() => {
    if (!chartData || chartData === fallbackData) {
      return "Log your mood to generate insights.";
    }

    const moodCounts = chartData.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {});

    const topMood = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b
    );

    return `You have mostly been feeling ${topMood} recently.`;
  }, [chartData]);

  // 3. DYNAMIC SCROLL WIDTH
  const chartDynamicWidth = chartData.length > 7 ? `${chartData.length * 60}px` : "100%";

  return (
    <div className="flex w-full flex-col">
      
      {/* Glassmorphic Insight Block */}
      <div className="mb-6 flex items-start gap-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 ring-1 ring-cyan-400/30">
          <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Recent Vibe Check
          </h3>
          <p className="mt-1 text-sm font-semibold text-white/90 capitalize">
            {generatedInsight}
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-56 w-full overflow-x-auto overflow-y-hidden pb-2 custom-scrollbar">
        <div style={{ minWidth: chartDynamicWidth, height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey={(row) => `${row.day} ${row.time}`}
                stroke="#475569"
                fontSize={10}
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                interval={0} 
                angle={-25}
                textAnchor="end"
                height={40}
              />
              <YAxis
                domain={[0, 100]} 
                hide={true} 
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }} 
              />
              
              <Area
                type="monotone"
                dataKey="score"
                stroke="#22d3ee"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
                activeDot={{ 
                  r: 6, 
                  fill: "#0b1120", 
                  stroke: "#22d3ee", 
                  strokeWidth: 3,
                  style: { filter: "drop-shadow(0 0 8px rgba(34,211,238,0.8))" }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalytics;