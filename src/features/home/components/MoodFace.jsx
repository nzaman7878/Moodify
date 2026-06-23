
const MoodFace = ({ mood = "neutral", small = false }) => {
  const currentMood = mood.toLowerCase();
  const containerClass = small 
    ? "h-5 w-5 shadow-sm" 
    : "h-28 w-28 shadow-[0_0_30px_rgba(0,0,0,0.2)]";
    
  const eyeClass = `absolute rounded-full bg-slate-900 ${small ? "h-1 w-1" : "h-3 w-3"}`;
  const eyeLeft = small ? "left-1.5 top-1.5" : "left-7 top-10";
  const eyeRight = small ? "right-1.5 top-1.5" : "right-7 top-10";
  const moodConfig = {
    happy: {
      bg: "bg-yellow-400",
      mouth: `absolute rounded-b-full border-slate-900 border-b-solid ${
        small
          ? "bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-2 border-b-[1.5px]"
          : "bottom-6 left-1/2 -translate-x-1/2 h-8 w-12 border-b-4"
      }`,
    },
    sad: {
      bg: "bg-blue-400",
      mouth: `absolute rounded-t-full border-slate-900 ${
        small
          ? "bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-2 border-t-[1.5px]"
          : "bottom-5 left-1/2 -translate-x-1/2 h-8 w-12 border-t-4"
      }`,
  
      extra: currentMood === "sad" && !small && (
        <div className="absolute right-6 top-14 h-4 w-2.5 rounded-b-full rounded-t-full bg-cyan-200 opacity-80" />
      )
    },
    angry: {
      bg: "bg-red-500",
      mouth: `absolute rounded-full bg-slate-900 ${
        small
          ? "bottom-1.5 left-1/2 -translate-x-1/2 h-[1.5px] w-2"
          : "bottom-8 left-1/2 -translate-x-1/2 h-1.5 w-10"
      }`,

      extra: currentMood === "angry" && (
        <>
          <div className={`absolute rounded-full bg-slate-900 rotate-12 ${small ? "left-1 top-1 h-[1.5px] w-1.5" : "left-5 top-7 h-1.5 w-6"}`} />
          <div className={`absolute rounded-full bg-slate-900 -rotate-12 ${small ? "right-1 top-1 h-[1.5px] w-1.5" : "right-5 top-7 h-1.5 w-6"}`} />
        </>
      )
    },
    surprised: {
      bg: "bg-purple-400",
      mouth: `absolute rounded-full border-slate-900 bg-transparent ${
        small
          ? "bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 border-[1px]"
          : "bottom-6 left-1/2 -translate-x-1/2 h-6 w-5 border-4"
      }`,
    },
    neutral: {
      bg: "bg-yellow-300",
      mouth: `absolute rounded-full bg-slate-900 ${
        small
          ? "bottom-1.5 left-1/2 h-[1px] w-2 -translate-x-1/2"
          : "bottom-8 left-1/2 h-1.5 w-10 -translate-x-1/2"
      }`,
    },
  };

  const config = moodConfig[currentMood] || moodConfig.neutral;

  return (
    <div className={`relative shrink-0 rounded-full transition-colors duration-500 ${config.bg} ${containerClass}`}>
      {config.extra}
      <span className={`${eyeClass} ${eyeLeft}`} />
      <span className={`${eyeClass} ${eyeRight}`} />
      <span className={config.mouth} />
    </div>
  );
};

export default MoodFace;