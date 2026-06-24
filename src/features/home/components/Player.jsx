import { useEffect, useRef, useState } from "react";
import { useSong } from "../hooks/useSong";

// Shared design system accents
const moodAccents = {
  happy:     { bar: "from-yellow-400 to-amber-300",  border: "border-yellow-400/20", glow: "rgba(250,204,21,0.15)"  },
  sad:       { bar: "from-blue-400 to-cyan-300",     border: "border-blue-400/20",   glow: "rgba(96,165,250,0.15)" },
  angry:     { bar: "from-red-500 to-orange-400",    border: "border-red-500/20",    glow: "rgba(239,68,68,0.15)"  },
  surprised: { bar: "from-purple-400 to-pink-300",   border: "border-purple-400/20", glow: "rgba(192,132,252,0.15)"},
  neutral:   { bar: "from-violet-400 via-sky-300 to-cyan-200", border: "border-cyan-300/10", glow: "rgba(34,211,238,0.10)" },
};

// Helper to format seconds into M:SS
const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const Player = () => {
  const { song } = useSong();
  const audioRef = useRef(null);

  // Custom Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  
  // Volume State
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current && song?.url) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log("Autoplay was prevented by the browser:", error);
        setIsPlaying(false);
      });
    }
  }, [song]);

  // Apply volume changes to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio Event Handlers
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    
    setCurrentTime(formatTime(current));
    if (total) {
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(formatTime(audioRef.current.duration));
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = Math.max(0, Math.min(1, x / bounds.width));
    
    audioRef.current.currentTime = percent * audioRef.current.duration;
    setProgress(percent * 100);
  };

  const handleVolumeScrub = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const newVolume = Math.max(0, Math.min(1, x / bounds.width));
    
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // SLEEK EMPTY STATE
  if (!song || !song.url) {
    return (
      <div className="relative flex w-full max-w-[480px] h-[160px] overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-[#171d25]/95 to-[#1b2535]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
        <div className="relative z-10 m-auto flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-slate-500/50" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Awaiting Mood Detection...
          </p>
        </div>
      </div>
    );
  }

  const activeKey = ["happy", "sad", "angry", "surprised", "neutral"].includes((song.mood || "").toLowerCase())
    ? song.mood.toLowerCase()
    : "neutral";
  const accent = moodAccents[activeKey];

  return (
    <div
      className={`relative overflow-hidden w-full max-w-[520px] rounded-2xl border ${accent.border} bg-gradient-to-r from-[#171d25]/95 to-[#1b2535]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] transition-colors duration-700`}
      style={{ boxShadow: `0 0 80px ${accent.glow}, 0 24px 80px rgba(0,0,0,0.32)` }}
    >
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl opacity-30 transition-colors duration-700"
        style={{
          background: accent.glow
            .replace("0.15", "1")
            .replace("rgba", "rgb")
            .replace(/,\s*[\d.]+\)/, ")"),
        }}
      />

      <div className="relative z-10 flex items-center gap-6">
        {/* Left: Album Art */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-white/5 shadow-2xl ring-1 ring-white/10 transition-transform duration-500 hover:scale-105">
          <img
            src={song.posterUrl || `https://picsum.photos/seed/moodify/${song._id}/112`}
            alt={song.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/20" />
          <div 
            className="absolute -right-2 -top-2 h-8 w-8 rounded-full blur-md opacity-80"
            style={{ background: accent.glow.replace("0.15", "1") }} 
          />
        </div>

        {/* Right: Track Info & Controls */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r ${accent.bar}`}>
            Now Playing
          </p>

          <h3 className="mt-1 truncate text-3xl font-black tracking-tight text-white drop-shadow-md">
            {song.title}
          </h3>

          <div className="mt-2 flex">
            <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300 ring-1 ring-white/10">
              {song.mood} Vibe
            </span>
          </div>

          {/* CUSTOM AUDIO CONTROLS (Updated with Volume) */}
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-black/20 p-2.5 ring-1 ring-white/5 backdrop-blur-sm">
            
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accent.bar} text-[#0b1120] shadow-lg transition-transform hover:scale-105 active:scale-95`}
            >
              {isPlaying ? (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Scrubber & Timestamps */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
              <div 
                className="group relative h-2 w-full cursor-pointer py-1"
                onClick={handleSeek}
              >
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${accent.bar} transition-all duration-150 ease-linear`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div 
                  className="absolute top-1/2 -ml-1.5 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                  style={{ left: `${progress}%` }}
                />
              </div>

              <div className="flex w-full items-center justify-between text-[9px] font-bold tracking-wider text-slate-400">
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>
            </div>

            {/* NEW: Volume Controls */}
            <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-white/5">
              <button 
                onClick={toggleMute} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  // Mute Icon
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  // Volume Icon
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              
              <div 
                className="group relative h-2 w-14 cursor-pointer py-1"
                onClick={handleVolumeScrub}
              >
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-slate-300 transition-all duration-150 ease-linear group-hover:bg-white"
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;