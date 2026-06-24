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

  return (
    <main className="min-h-screen overflow-hidden bg-[#080d22] text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_18%_26%,rgba(43,205,213,0.22),transparent_30%),radial-gradient(circle_at_68%_18%,rgba(31,123,186,0.22),transparent_28%),linear-gradient(135deg,#070b1d_0%,#0b1430_48%,#070918_100%)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="mx-auto grid min-h-[calc(100vh-82px)] w-full max-w-[1480px] grid-cols-1 gap-6 px-5 py-7 lg:grid-cols-[390px_minmax(480px,1fr)_390px] xl:grid-cols-[430px_minmax(560px,1fr)_420px]">
          <aside className="flex min-h-[520px] items-center justify-center rounded-[2rem] border border-cyan-300/10 bg-cyan-950/20 p-6 shadow-[inset_0_0_80px_rgba(34,211,238,0.08)]">
            <FaceExpression
              onMoodDetected={handleMoodSelect}
              onExpressionChange={setDetectedMood}
            />
          </aside>

          <section className="flex min-w-0 flex-col gap-7">
            <CurrentMoodCard
              selectedMood={selectedMood}
              detectedMood={detectedMood}
              moodLabels={moodLabels}
            />

            <MoodHistory
              recentHistory={recentHistory.slice(0, 4)}
              sevenDayHistory={weeklyHistory}
              onNoteUpdated={handleNoteUpdated}
            />

            <Player />

            {error && (
              <p className="rounded-lg border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
                {error}
              </p>
            )}
          </section>

          <RecommendationsSidebar
            recommendations={visibleRecommendations}
            handleSelectSong={handleSelectSong}
            moodLabels={moodLabels}
            currentSong={song}
          />
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