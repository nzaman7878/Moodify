import { useEffect, useRef, useState } from "react";

import { useSong } from "../hooks/useSong";

const formatTime = (time) => {
  if (!Number.isFinite(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const Player = () => {
  const audioRef = useRef(null);
  const { loading, song } = useSong();

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    audio.load();
  }, [song?.url]);

  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !song?.url) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Could not play audio", error);
      setIsPlaying(false);
    }
  };

  const handleSeek = (event) => {
    const nextTime = Number(event.target.value);
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeChange = (event) => {
    setVolume(Number(event.target.value));
  };

  const progressMax = duration || 0;

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-white">
      <audio
        ref={audioRef}
        src={song?.url}
        preload="metadata"
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration)
        }
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex gap-4 items-center">
        {song?.posterUrl ? (
          <img
            src={song.posterUrl}
            alt={song?.title || "Current song poster"}
            className="h-24 w-24 rounded-2xl object-cover bg-slate-800 border border-slate-700"
          />
        ) : (
          <div className="h-24 w-24 rounded-2xl bg-slate-800 border border-slate-700" />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Now Playing
          </p>
          <h2 className="mt-1 text-xl font-semibold truncate">
            {song?.title || "No song selected"}
          </h2>
          <p className="mt-1 text-sm capitalize text-slate-400">
            {song?.mood || "Choose a mood"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <input
          type="range"
          min="0"
          max={progressMax}
          step="1"
          value={currentTime}
          onChange={handleSeek}
          disabled={!duration}
          className="w-full accent-purple-500"
          aria-label="Song progress"
        />

        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleTogglePlay}
          disabled={loading || !song?.url}
          className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-700 text-white font-semibold transition"
          aria-label={isPlaying ? "Pause song" : "Play song"}
        >
          {loading ? "..." : isPlaying ? "II" : ">"}
        </button>

        <div className="flex flex-1 items-center gap-3">
          <span className="text-sm text-slate-400">Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-purple-500"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
