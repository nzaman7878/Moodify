import { useEffect, useRef } from "react";
import { useSong } from "../hooks/useSong";

const Player = () => {
  const { song } = useSong();

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && song?.url) {
      audioRef.current.play().catch((error) => {
        console.log("Autoplay was prevented by the browser:", error);
      });
    }
  }, [song]);

  if (!song || !song.url) {
    return (
      <div className="flex h-[136px] items-center justify-center rounded-2xl border border-white/5 bg-[#242843]/50 p-5">
        <p className="text-sm font-medium text-slate-500">
          Waiting for mood detection...
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 rounded-2xl border border-cyan-300/10 bg-gradient-to-r from-[#171d25] to-[#1a2332] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl shadow-lg">
        <img
          src={song.posterUrl || `https://picsum.photos/seed/moodify/${song._id}/96`}
          alt={song.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-cyan-400 blur-sm" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
          Now Playing
        </p>

        <h3 className="mt-1 truncate text-2xl font-extrabold text-white">
          {song.title}
        </h3>

        <p className="truncate text-sm font-medium text-slate-400 capitalize">
          {song.mood} Vibe
        </p>

        <audio
          ref={audioRef}
          src={song.url}
          controls
          className="mt-4 h-10 w-full rounded-full bg-slate-900/50 outline-none [&::-webkit-media-controls-panel]:bg-slate-800 [&::-webkit-media-controls-current-time-display]:text-cyan-100 [&::-webkit-media-controls-time-remaining-display]:text-cyan-100"
        />
      </div>
    </div>
  );
};

export default Player;
