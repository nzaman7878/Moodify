import { useEffect, useRef, useState } from "react";

import { initFaceLandmarker } from "../utils/initFaceLandmarker";
import { initCamera } from "../utils/initCamera";
import { detectMood } from "../utils/detectMood";

// Brought over the shared mood accents to sync the UI feel
const moodAccents = {
  happy:     { bar: "from-yellow-400 to-amber-300",  border: "border-yellow-400/20", glow: "rgba(250,204,21,0.15)"  },
  sad:       { bar: "from-blue-400 to-cyan-300",     border: "border-blue-400/20",   glow: "rgba(96,165,250,0.15)" },
  angry:     { bar: "from-red-500 to-orange-400",    border: "border-red-500/20",    glow: "rgba(239,68,68,0.15)"  },
  surprised: { bar: "from-purple-400 to-pink-300",   border: "border-purple-400/20", glow: "rgba(192,132,252,0.15)"},
  neutral:   { bar: "from-violet-400 via-sky-300 to-cyan-200", border: "border-cyan-300/10", glow: "rgba(34,211,238,0.10)" },
};

export default function FaceExpression({
  onMoodDetected,
  onExpressionChange,
}) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);

  const [expression, setExpression] = useState("Click Detect");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let videoElement = null;

    const init = async () => {
      try {
        landmarkerRef.current = await initFaceLandmarker();
        await initCamera(videoRef);
        videoElement = videoRef.current;
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    init();

    return () => {
      if (videoElement?.srcObject) {
        videoElement.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
  }, []);

  const handleDetectMood = () => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
      videoRef.current,
      performance.now()
    );

    if (!results.faceBlendshapes?.length) {
      setExpression("No Face Detected");
      return;
    }

    const mood = detectMood(
      results.faceBlendshapes[0].categories
    );

    setExpression(mood);
    onExpressionChange?.(mood);

    const moodMap = {
      Happy: "happy",
      Sad: "sad",
      Surprised: "surprised",
      Angry: "angry",
      Neutral: "neutral",
    };

    const apiMood = moodMap[mood] || "happy";

    if (onMoodDetected) {
      onMoodDetected(apiMood);
    }
  };

  // Determine which accent to use based on the current expression text
  const activeKey = ["happy", "sad", "angry", "surprised", "neutral"].includes(expression.toLowerCase())
    ? expression.toLowerCase()
    : "neutral";
  const accent = moodAccents[activeKey];

  return (
    <div
      className={`relative overflow-hidden w-full max-w-[360px] rounded-2xl border ${accent.border} bg-gradient-to-r from-[#171d25]/95 to-[#1b2535]/90 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] transition-colors duration-700`}
      style={{ boxShadow: `0 0 80px ${accent.glow}, 0 24px 80px rgba(0,0,0,0.32)` }}
    >
      {/* Ambient glow blob */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full blur-3xl opacity-30 transition-colors duration-700"
        style={{
          background: accent.glow
            .replace("0.15", "1")
            .replace("rgba", "rgb")
            .replace(/,\s*[\d.]+\)/, ")"),
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Header */}
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/80">
          Moodify
        </p>
        <h2 className="mt-2 text-3xl font-black leading-none tracking-tight text-white drop-shadow-lg text-center">
          Expression Capture
        </h2>

        {/* Divider */}
        <div className="mt-5 mb-5 h-px w-full bg-white/5" />

        {/* Video Container */}
        <div className="w-full rounded-xl bg-white/5 p-3 ring-1 ring-white/10 relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="aspect-video w-full rounded-lg bg-black object-cover shadow-inner"
          />
          {/* Live indicator tag */}
          <div className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md ring-1 ring-white/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            LIVE
          </div>
        </div>

        {/* Detected Result Box */}
        <div className="mt-5 flex w-full flex-col items-center justify-center rounded-xl bg-white/5 py-4 ring-1 ring-white/10">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Detected Mood
          </p>
          <div
            className={`mt-1 text-3xl font-black capitalize tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${accent.bar} transition-all duration-700`}
          >
            {expression}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDetectMood}
          disabled={loading}
          className={`mt-5 h-12 w-full rounded-xl bg-gradient-to-r ${
            loading ? "from-slate-600 to-slate-500" : accent.bar
          } text-xs font-black uppercase tracking-[0.1em] text-[#0b1120] shadow-lg transition-all duration-500 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {loading ? "Initializing..." : "Detect Again"}
        </button>
      </div>
    </div>
  );
}