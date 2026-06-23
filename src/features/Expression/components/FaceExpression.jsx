import { useEffect, useRef, useState } from "react";

import { initFaceLandmarker } from "../utils/initFaceLandmarker";
import { initCamera } from "../utils/initCamera";
import { detectMood } from "../utils/detectMood";

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

  return (
    <div className="w-full max-w-[340px] rounded-[1.4rem] border border-cyan-200/10 bg-cyan-100/10 p-5 text-center shadow-[0_0_55px_rgba(45,212,191,0.24)] backdrop-blur">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
        Moodify
      </p>
      <h2 className="mt-2 text-2xl font-black text-white">
        Expression Capture
      </h2>

      <div className="mt-5 rounded-xl border border-cyan-200/20 bg-[#071225]/90 p-4 shadow-[inset_0_0_38px_rgba(8,145,178,0.2)]">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="aspect-video w-full rounded-lg border border-cyan-200/10 bg-slate-950 object-cover"
        />

        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
          Mood Detected
        </p>
        <div className="mt-2 text-3xl font-black text-lime-300">
          {expression}
        </div>
      </div>

      <button
        onClick={handleDetectMood}
        disabled={loading}
        className="mt-5 h-12 w-full rounded-lg bg-cyan-300 text-sm font-black tracking-wide text-cyan-950 shadow-[0_0_24px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-white/50"
      >
        {loading ? "Loading..." : "Detect Again"}
      </button>
    </div>
  );
}
