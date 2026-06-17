import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);

  const [expression, setExpression] = useState("Click Detect");
  const [loading, setLoading] = useState(true);

  const moodMap = {
    Happy: {
      emoji: "😊",
      genres: ["Pop", "Dance"],
    },
    Sad: {
      emoji: "😢",
      genres: ["Lo-fi", "Acoustic"],
    },
    Surprised: {
      emoji: "😲",
      genres: ["EDM"],
    },
    Angry: {
      emoji: "😠",
      genres: ["Rock", "Metal"],
    },
    Neutral: {
      emoji: "😐",
      genres: ["Chill", "Ambient"],
    },
  };

  useEffect(() => {
    const init = async () => {
      try {
        const vision =
          await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );

        landmarkerRef.current =
          await FaceLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath:
                  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
              },
              outputFaceBlendshapes: true,
              runningMode: "VIDEO",
              numFaces: 1,
            }
          );

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
          });

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

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

  const detectMood = () => {
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

    const blendshapes =
      results.faceBlendshapes[0].categories;

    const getScore = (name) =>
      blendshapes.find(
        (item) => item.categoryName === name
      )?.score || 0;

    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");

    const jawOpen = getScore("jawOpen");
    const browUp = getScore("browInnerUp");

    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");

    const browDownLeft =
      getScore("browDownLeft");
    const browDownRight =
      getScore("browDownRight");

    let detectedMood = "Neutral";

    // Happy
    if (
      smileLeft > 0.4 &&
      smileRight > 0.4
    ) {
      detectedMood = "Happy";
    }

    // Surprised
    else if (
      jawOpen > 0.55 &&
      browUp > 0.4
    ) {
      detectedMood = "Surprised";
    }

    // Sad
    else if (
      frownLeft > 0.3 &&
      frownRight > 0.3
    ) {
      detectedMood = "Sad";
    }

    // Angry
    else if (
      browDownLeft > 0.4 &&
      browDownRight > 0.4
    ) {
      detectedMood = "Angry";
    }

    setExpression(detectedMood);
  };

  const mood =
    moodMap[expression] || moodMap.Neutral;

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-[400px] rounded-xl border"
      />

      <button
        onClick={detectMood}
        disabled={loading}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        {loading
          ? "Loading Camera..."
          : "Detect Mood"}
      </button>

      {moodMap[expression] && (
        <>
          <h2 className="text-3xl font-bold">
            {mood.emoji} {expression}
          </h2>

          <div className="flex gap-2 flex-wrap justify-center">
            {mood.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gray-200 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}