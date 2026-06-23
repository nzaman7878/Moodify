import NeutralFace from "./NeutralFace";

const CurrentMoodCard = ({ selectedMood, detectedMood, moodLabels }) => {
  return (
    <div className="grid min-h-[175px] grid-cols-[1fr_auto] items-center gap-8 rounded-lg border border-cyan-300/10 bg-gradient-to-r from-[#171d25]/95 to-[#1b9fc0]/80 px-10 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-cyan-200">
          Current Mood Analysis
        </p>
        <h1 className="mt-4 text-5xl font-black leading-none text-white drop-shadow-lg">
          {moodLabels[selectedMood] || detectedMood}
        </h1>
        <div className="mt-6 flex max-w-sm items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-white/20">
            <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-violet-400 via-sky-300 to-cyan-200" />
          </div>
          <span className="text-sm font-bold text-cyan-100">89% match</span>
        </div>
      </div>
      <NeutralFace />
    </div>
  );
};

export default CurrentMoodCard;