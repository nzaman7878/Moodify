import { useState, useEffect } from "react";
import MoodFace from "./MoodFace";
import { updateTimelineNote } from "../services/timeline.api"; // Import your API function
const TimelineItem = ({ item, index, token, onNoteUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(item.note || "");
  const [isSaving, setIsSaving] = useState(false);

  
  useEffect(() => {
    if (!isEditing) {
      setNote(item.note || "");
    }
  }, [item.note, isEditing]);
  const handleSave = async () => {
   
    if (note.trim() === (item.note || "")) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
     
      await updateTimelineNote(item._id, note, token);
      

      if (onNoteUpdated) onNoteUpdated(item._id, note);
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save note", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
  };

  return (
    <div className="group flex flex-col gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-3 transition-colors hover:bg-white/10">
      
     
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            item.active
              ? "bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]"
              : "bg-amber-300"
          }`}
        />
        <MoodFace mood={item.label} small />
        <span className="flex-1 text-sm font-bold text-lime-300">
          {item.label}
        </span>
        <span className="text-xs font-semibold text-white/60">
          {item.time}
        </span>
      </div>

     
      <div className="ml-6 pl-2 border-l border-white/10 mt-1">
        {isEditing ? (
          <div className="flex flex-col gap-2 mt-1">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={150}
              placeholder="Why are you feeling this way?"
              className="bg-[#242843] border border-white/20 text-white p-1.5 rounded text-sm focus:outline-none focus:border-cyan-300 w-full"
              autoFocus
              disabled={isSaving}
            />
            <div className="flex gap-2">
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-cyan-300 hover:bg-cyan-200 text-cyan-950 px-2 py-1 rounded text-xs font-bold transition-colors"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button 
                onClick={() => setIsEditing(false)} 
                disabled={isSaving}
                className="text-white/60 hover:text-white px-2 py-1 rounded text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-1">
            {item.note ? (
              <p 
                onClick={() => setIsEditing(true)} 
                className="text-white/70 italic text-sm cursor-pointer hover:text-white transition-colors"
                title="Click to edit"
              >
                "{item.note}"
              </p>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-cyan-200/50 hover:text-cyan-200 text-xs font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                + Add context
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;