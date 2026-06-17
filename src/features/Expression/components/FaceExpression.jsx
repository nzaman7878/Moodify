import { useEffect, useRef, useState } from "react";

import { initFaceLandmarker } from "../utils/initFaceLandmarker";
import { initCamera } from "../utils/initCamera";
import { detectMood } from "../utils/detectMood";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);

  const [expression, setExpression] = useState("Click Detect");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        landmarkerRef.current =
          await initFaceLandmarker();

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
    if (!landmarkerRef.current || !videoRef.current)
      return;

    const results =
      landmarkerRef.current.detectForVideo(
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
  };

return (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
    <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">
          Moodify
        </h1>
        <p className="text-slate-400 mt-2">
          Detect your mood and discover matching music
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        
        {/* Camera */}
        <div className="flex justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full max-w-sm rounded-2xl border border-slate-700"
          />
        </div>

        {/* Results */}
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

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {expression === "Happy" && (
              <>
                <span className="px-4 py-2 rounded-full bg-pink-500/20 text-pink-300">
                  Pop
                </span>
                <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-300">
                  Dance
                </span>
              </>
            )}

            {expression === "Sad" && (
              <>
                <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300">
                  Lo-Fi
                </span>
                <span className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300">
                  Acoustic
                </span>
              </>
            )}

            {expression === "Surprised" && (
              <span className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300">
                EDM
              </span>
            )}

            {expression === "Angry" && (
              <>
                <span className="px-4 py-2 rounded-full bg-red-500/20 text-red-300">
                  Rock
                </span>
                <span className="px-4 py-2 rounded-full bg-orange-500/20 text-orange-300">
                  Metal
                </span>
              </>
            )}

            {(expression === "Neutral" ||
              expression === "Click Detect") && (
              <>
                <span className="px-4 py-2 rounded-full bg-slate-700 text-slate-300">
                  Chill
                </span>
                <span className="px-4 py-2 rounded-full bg-slate-700 text-slate-300">
                  Ambient
                </span>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  </div>
);
}