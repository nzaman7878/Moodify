import { useEffect, useState, useCallback } from "react";
import { useSong } from "../hooks/useSong";
import { SongContextProvider } from "../song.context";
import Navbar from "../components/Navbar";
import Player from "../components/Player";
import FaceExpression from "../../Expression/components/FaceExpression";
import CurrentMoodCard from "../components/CurrentMoodCard";
import MoodHistory from "../components/MoodHistory";
import RecommendationsSidebar from "../components/RecommendationsSidebar";

const moodHistory = [
  { label: "Neutral", time: "04:59 PM", active: true },
  { label: "Happy", time: "04:58 PM", active: false },
  { label: "Neutral", time: "04:56 PM", active: false },
];

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
  const [history, setHistory] = useState(moodHistory);
  const [error, setError] = useState("");

  useEffect(() => {
    handleGetRecommendations({}).catch(() => {
      setError("Could not load recommendations from the backend.");
    });
  }, [handleGetRecommendations]);

  const handleMoodSelect = useCallback(
    async (mood) => {
      if ((mood === selectedMood && !error) || loading) return;

      setSelectedMood(mood);
      setError("");

      try {
        await handleGetSong({ mood });

        setHistory((currentHistory) => {
          const newEntry = {
            label: moodLabels[mood] || mood,
            time: new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            active: true,
          };

          const previousEntries = currentHistory
            .slice(0, 2)
            .map((item) => ({ ...item, active: false })); // Set older dots to amber

          return [newEntry, ...previousEntries];
        });
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Could not find a song for this mood.",
        );
      }
    },
    [selectedMood, error, loading, handleGetSong],
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

            <MoodHistory history={history} />

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
