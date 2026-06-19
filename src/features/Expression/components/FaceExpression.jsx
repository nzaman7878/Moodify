import { useEffect, useRef, useState } from "react";

import { initFaceLandmarker } from "../utils/initFaceLandmarker";
import { initCamera } from "../utils/initCamera";
import { detectMood } from "../utils/detectMood";

export default function FaceExpression({ onMoodDetected }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);

  const [expression, setExpression] = useState("Click Detect");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        landmarkerRef.current = await initFaceLandmarker();
        await initCamera(videoRef);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    init();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
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

    const moodMap = {
      Happy: "happy",
      Sad: "sad",
      Surprised: "surprised",
      Angry: "angry",
      Neutral: "happy",
    };

    const apiMood = moodMap[mood] || "happy";

    if (onMoodDetected) {
      onMoodDetected(apiMood);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full max-w-sm rounded-2xl border border-slate-700"
            />
          </div>

          <div className="text-center">
            <h2 className="text-slate-400 text-sm uppercase tracking-wider">
              Current Mood
            </h2>

            <div className="text-5xl font-bold text-white mt-3">
              {expression}
            </div>

            <button
              onClick={handleDetectMood}
              disabled={loading}
              className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition"
            >
              {loading ? "Loading..." : "Detect Mood"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}