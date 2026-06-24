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

  // 2. SEPARATED STATES: One for the timeline list, one for the Recharts graph
  const [recentHistory, setRecentHistory] = useState([]);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    handleGetRecommendations({}).catch(() => {
      setError("Could not load recommendations from the backend.");
    });

    // --- FETCH RECENT TIMELINE (Top 10) ---
    getMoodHistory()
      .then((data) => {
        if (data.history) {
          const formattedRecent = data.history.map((item, index) => {
            const dateObj = new Date(item.createdAt);
            const moodLabel = moodLabels[item.mood] || item.mood;
            return {
              _id: item._id,
              label: moodLabel,
              active: index === 0,
              time: dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          });
          setRecentHistory(formattedRecent);
        }
      })
      .catch((err) => console.error("Could not load recent history", err));

    // --- FETCH 7-DAY CHART DATA (No limits) ---
 fetchWeeklyHistory()
      .then((data) => {
        if (data.data) {
          
          // 1. Generate an array of the last 7 days (e.g., ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"])
          const last7Days = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push(d.toLocaleDateString("en-US", { weekday: "short" }));
          }

          // 2. Group the backend data by day so we can easily look it up
          const dataByDay = {};
          data.data.forEach((item) => {
            const d = new Date(item.createdAt);
            const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
            
            // This will keep the LATEST mood captured on that specific day
            dataByDay[dayLabel] = item; 
          });

          // 3. Merge the generated days with your database data!
          const formattedWeekly = last7Days.map((dayLabel) => {
            const item = dataByDay[dayLabel];
            
            // If the user recorded a mood on this day, format it normally
            if (item) {
              const safeMoodString = item.mood ? item.mood.toLowerCase() : "neutral";
              const moodLabel = moodLabels[safeMoodString] || item.mood;
              return {
                day: dayLabel,
                time: new Date(item.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
                mood: moodLabel,
                score: moodScores[safeMoodString] || 50,
              };
            } 
            
            // If there is no data for this day, return a blank slate
            return {
              day: dayLabel,
              time: "--",
              mood: "No Activity",
              score: 0, // 0 makes the chart drop to the bottom beautifully
            };
          });

          setWeeklyHistory(formattedWeekly);
        }
      })
      .catch((err) => console.error("Could not load weekly history", err));

  }, [handleGetRecommendations]);

  const handleMoodSelect = useCallback(
    async (mood) => {
      if ((mood === selectedMood && !error) || loading) return;

      setSelectedMood(mood);
      setError("");

      try {
        await handleGetSong({ mood });
        await saveMoodHistory({ mood });

        const now = new Date();
        const safeMoodString = mood.toLowerCase();
        const moodLabel = moodLabels[safeMoodString] || mood;

        // 3. INSTANTLY UPDATE THE TIMELINE LIST
        setRecentHistory((currentHistory) => {
          const newEntry = {
            _id: Date.now().toString(),
            label: moodLabel,
            active: true,
            time: now.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          const previousEntries = currentHistory.map((item) => ({
            ...item,
            active: false,
          }));
          return [newEntry, ...previousEntries];
        });

// --- FETCH 7-DAY CHART DATA (Shows EVERY single entry) ---
    fetchWeeklyHistory()
      .then((data) => {
        if (data.data) {
          
          
          const formattedWeekly = data.data.map((item) => {
            const dateObj = new Date(item.createdAt);
            const safeMoodString = item.mood ? item.mood.toLowerCase() : "neutral";
            const moodLabel = moodLabels[safeMoodString] || item.mood;

            return {
              day: dateObj.toLocaleDateString("en-US", { weekday: "short" }), // "Wed"
              time: dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), // "12:50 PM"
              mood: moodLabel,
              score: moodScores[safeMoodString] || 50,
            };
          });

          // Set the state with ALL entries, no throwing data away!
          setWeeklyHistory(formattedWeekly);
        }
      })
      .catch((err) => console.error("Could not load weekly history", err));
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Could not find a song for this mood."
        );
      }
    },
    [selectedMood, error, loading, handleGetSong]
  );

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

            {/* 5. Pass the cleanly separated data down! */}
            <MoodHistory
              recentHistory={recentHistory.slice(0, 4)} // Show top 4 in the list
              sevenDayHistory={weeklyHistory}           // Show full week in the chart
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