import { useState } from "react";

import FaceExpression from "../../Expression/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";
import { SongContextProvider } from "../song.context";

const moods = [
  {
    label: "Happy",
    value: "happy",
    tone: "bg-pink-500/20 text-pink-200 border-pink-500/30",
  },
  {
    label: "Sad",
    value: "sad",
    tone: "bg-blue-500/20 text-blue-200 border-blue-500/30",
  },
  {
    label: "Surprised",
    value: "surprised",
    tone: "bg-yellow-500/20 text-yellow-100 border-yellow-500/30",
  },
];

const HomeContent = () => {
  const { loading, handleGetSong } = useSong();
  const [selectedMood, setSelectedMood] = useState("happy");
  const [error, setError] = useState("");

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setError("");

    try {
      await handleGetSong({ mood });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not find a song for this mood"
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Moodify</h1>
            <p className="mt-2 text-slate-400">
              Detect your mood and play music that matches it.
            </p>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            <FaceExpression />
          </div>

          <aside className="flex flex-col gap-5">
            <Player />

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Pick a mood</h2>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => handleMoodSelect(mood.value)}
                    disabled={loading}
                    className={`rounded-2xl border px-4 py-3 text-left font-medium transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 ${
                      mood.tone
                    } ${
                      selectedMood === mood.value
                        ? "ring-2 ring-white/70"
                        : ""
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}
            </div>
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
