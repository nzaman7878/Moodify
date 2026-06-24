import { useEffect, useState, useCallback } from "react";
import { useSong } from "../hooks/useSong";
import { SongContextProvider } from "../song.context";
import { getMoodHistory, saveMoodHistory, fetchWeeklyHistory } from "../services/song.api";
import Navbar from "../components/Navbar";
import Player from "../components/Player";
import FaceExpression from "../../Expression/components/FaceExpression";
import CurrentMoodCard from "../components/CurrentMoodCard";
import MoodHistory from "../components/MoodHistory";
import RecommendationsSidebar from "../components/RecommendationsSidebar";
import VibeExport from "../components/VibeExport";

// Shared design system accents for the global background glow
const moodAccents = {
  happy:     { glow: "rgba(250,204,21,0.12)" },
  sad:       { glow: "rgba(96,165,250,0.12)" },
  angry:     { glow: "rgba(239,68,68,0.12)" },
  surprised: { glow: "rgba(192,132,252,0.12)"},
  neutral:   { glow: "rgba(34,211,238,0.08)" },
};

const fallbackRecommendations = [
  "Fateh Kar Fateh (From Fateh)",
  "Restart - Rap (From 12th Fail)",
  "Roohdaari",
  "Morya Malhar",
  "Chumma",
  "Gumshudah",
  "Teri Banga Ri Film Version",
  "Roohdaari - Reprise Version",
  "Millionaire",
  "Turn Jo Mile Ho",
].map((title, index) => ({
  _id: `fallback-${index}`,
  title,
  mood: index % 2 ? "happy" : "neutral",
  posterUrl: `https://picsum.photos/seed/moodify-${index}/80`,
}));

const moodLabels = {
  angry: "Angry",
  happy: "Happy",
  neutral: "Neutral",
  sad: "Sad",
  surprised: "Surprised",
};

const moodScores = {
  angry: 10,
  sad: 25,
  neutral: 50,
  surprised: 75,
  happy: 90,
  Angry: 10,
  Sad: 25,
  Neutral: 50,
  Surprised: 75,
  Happy: 90,
};

const formatHistoryItem = (item, index) => {
  const dateObj = new Date(item.createdAt);
  const safeMood = item.mood ? item.mood.toLowerCase() : "neutral";
  const moodLabel = moodLabels[safeMood] || item.mood;
  return {
    _id: item._id.toString(), // ✅ Always a plain string
    label: moodLabel,
    active: index === 0,
    note: item.note || "",
    time: dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const formatWeeklyItem = (item) => {
  const dateObj = new Date(item.createdAt);
  const safeMood = item.mood ? item.mood.toLowerCase() : "neutral";
  const moodLabel = moodLabels[safeMood] || item.mood;
  return {
    day: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
    time: dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    mood: moodLabel,
    score: moodScores[safeMood] || 50,
  };
};

const HomeContent = () => {
  const {
    handleGetRecommendations,
    handleGetSong,
    handleSelectSong,
    recommendations,
    song,
    loading,
  } = useSong();

  const [selectedMood, setSelectedMood] = useState("neutral");
  const [detectedMood, setDetectedMood] = useState("Neutral");
  const [recentHistory, setRecentHistory] = useState([]);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const loadRecentHistory = useCallback(async () => {
    const data = await getMoodHistory();
    if (data.history) {
      setRecentHistory(data.history.map(formatHistoryItem));
    }
  }, []);

  const loadWeeklyHistory = useCallback(async () => {
    const data = await fetchWeeklyHistory();
    if (data.data) {
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toLocaleDateString("en-US", { weekday: "short" }));
      }

      const dataByDay = {};
      data.data.forEach((item) => {
        const d = new Date(item.createdAt);
        const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
        dataByDay[dayLabel] = item;
      });

      const formattedWeekly = last7Days.map((dayLabel) => {
        const item = dataByDay[dayLabel];
        if (item) return formatWeeklyItem(item);
        return { day: dayLabel, time: "--", mood: "No Activity", score: 0 };
      });

      setWeeklyHistory(formattedWeekly);
    }
  }, []);

  useEffect(() => {
    handleGetRecommendations({}).catch(() => {
      setError("Could not load recommendations from the backend.");
    });
    loadRecentHistory().catch((err) =>
      console.error("Could not load recent history", err)
    );
    loadWeeklyHistory().catch((err) =>
      console.error("Could not load weekly history", err)
    );
  }, [handleGetRecommendations, loadRecentHistory, loadWeeklyHistory]);

  const handleMoodSelect = useCallback(
    async (mood) => {
      if ((mood === selectedMood && !error) || loading) return;

      setSelectedMood(mood);
      setError("");

      try {
        await handleGetSong({ mood });
        await saveMoodHistory({ mood });
        await loadRecentHistory();
        await loadWeeklyHistory();
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Could not find a song for this mood."
        );
      }
    },
    [selectedMood, error, loading, handleGetSong, loadRecentHistory, loadWeeklyHistory]
  );

  const handleNoteUpdated = useCallback((itemId, newNote) => {
    setRecentHistory((currentHistory) =>
      currentHistory.map((item) =>
        item._id === itemId ? { ...item, note: newNote } : item
      )
    );
  }, []);

  const visibleRecommendations =
    recommendations?.length > 0 ? recommendations : fallbackRecommendations;

  const handleDeletedEntry = (itemId) => {
    setRecentHistory((prevHistory) => 
      prevHistory.filter(item => item._id !== itemId)
    );
  };

  // Determine global ambient color based on active mood
  const activeKey = ["happy", "sad", "angry", "surprised", "neutral"].includes(selectedMood.toLowerCase())
    ? selectedMood.toLowerCase()
    : "neutral";
  const globalAccent = moodAccents[activeKey];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050810] text-white">
      
      {/* DYNAMIC AMBIENT BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Deep space base grid/gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#050810_0%,#0b1120_50%,#050810_100%)] opacity-80" />
        {/* Dynamic top-left glow */}
        <div 
          className="absolute -left-[20%] -top-[10%] h-[800px] w-[800px] rounded-full blur-[120px] transition-colors duration-1000 ease-in-out"
          style={{ background: globalAccent.glow }}
        />
        {/* Dynamic bottom-right glow */}
        <div 
          className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full blur-[100px] transition-colors duration-1000 ease-in-out"
          style={{ background: globalAccent.glow }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Added `items-start` to prevent column stretching */}
        <section className="mx-auto grid min-h-[calc(100vh-82px)] w-full max-w-[1560px] items-start grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[380px_minmax(480px,1fr)_380px] xl:grid-cols-[420px_minmax(560px,1fr)_420px]">
          
          {/* LEFT SIDEBAR: Camera */}
          {/* Added `sticky top-28 h-fit` and removed `min-h-[520px]` */}
          <aside className="sticky top-28 h-fit flex items-center justify-center rounded-[2rem] border border-white/5 bg-[#0b1120]/40 p-6 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <FaceExpression
              onMoodDetected={handleMoodSelect}
              onExpressionChange={setDetectedMood}
            />
          </aside>

          {/* CENTER COLUMN: Feed & Player */}
          <section className="flex min-w-0 flex-col gap-8 pb-10">
            <CurrentMoodCard
              selectedMood={selectedMood}
              detectedMood={detectedMood}
              moodLabels={moodLabels}
            />

            <MoodHistory 
              recentHistory={recentHistory}
              sevenDayHistory={weeklyHistory}          
              onNoteUpdated={handleNoteUpdated}
              onDeleted={handleDeletedEntry}
              token={token}
            />

            <div className="flex w-full justify-center">
              <Player />
            </div>

            <VibeExport
              song={song}
              mood={selectedMood}
              moodLabel={moodLabels[selectedMood]}
            />

            {/* ERROR STATE */}
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-md ring-1 ring-red-500/20">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
                <p className="text-sm font-bold tracking-wide text-red-200">
                  {error}
                </p>
              </div>
            )}
          </section>

          {/* RIGHT SIDEBAR: Recommendations */}
          {/* Added `sticky top-28 h-fit` */}
          <aside className="sticky top-28 h-fit pb-10">
            <RecommendationsSidebar
              recommendations={visibleRecommendations}
              handleSelectSong={handleSelectSong}
              moodLabels={moodLabels}
              currentSong={song}
            />
          </aside>

        </section>
      </div>
    </main>
  );
};

const Home = () => {
  return (
    <SongContextProvider>
      <HomeContent />
    </SongContextProvider>
  );
};

export default Home;