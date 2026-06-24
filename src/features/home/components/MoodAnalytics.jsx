import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

 
const weeklyData = [
  { day: "Mon", mood: "Neutral", score: 50, time: "2:00 PM" },
  { day: "Tue", mood: "Happy", score: 85, time: "1:30 PM" },
  { day: "Wed", mood: "Surprised", score: 70, time: "3:00 PM" },
  { day: "Thu", mood: "Sad", score: 25, time: "8:00 PM" },
  { day: "Fri", mood: "Happy", score: 90, time: "12:00 PM" },
  { day: "Sat", mood: "Happy", score: 95, time: "1:00 PM" },
  { day: "Sun", mood: "Neutral", score: 55, time: "11:00 AM" },
];


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-white/10 bg-[#0b1128]/90 p-4 shadow-2xl backdrop-blur-md">
        <p className="mb-1 font-bold text-cyan-300">{data.day}</p>
        <p className="text-sm font-medium text-white">
          Mood: <span className="text-violet-300">{data.mood}</span>
        </p>
        <p className="text-xs text-slate-400">Captured at {data.time}</p>
      </div>
    );
  }
  return null;
};

const MoodAnalytics = ({ data = weeklyData }) => {

  const generatedInsight = useMemo(() => {
    if (!data || data.length === 0) {
      return "Log your mood to generate insights.";
    }

    const moodCounts = data.reduce((acc, curr) => {
      if (curr.score > 0) {
        acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      }
      return acc;
    }, {});

    if (Object.keys(moodCounts).length === 0) {
       return "Log your mood to generate insights.";
    }

    const topMood = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b
    );

    return `You have mostly been feeling ${topMood} over the last 7 days.`;
  }, [data]);

  const chartDynamicWidth = data && data.length > 7 ? `${data.length * 60}px` : "100%";

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-white/5 p-6 flex flex-col">
      
    
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Weekly Vibe Check
        </h3>
        <p className="mt-2 flex items-center gap-2 font-medium text-cyan-200">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
          Insight: {generatedInsight}
        </p>
      </div>


      <div className="h-64 w-full overflow-x-auto overflow-y-hidden pb-2 custom-scrollbar">
        
        {/* The expanding inner container */}
        <div style={{ minWidth: chartDynamicWidth, height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]} 
                hide={true} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '5 5' }} />
              
              <Area
                type="monotone"
                dataKey="score"
                stroke="#22d3ee"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
                activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    

    </div>
  );
};

export default MoodAnalytics;