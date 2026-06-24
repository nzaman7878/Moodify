import { useRef, useState } from "react";
import html2canvas from "html2canvas";

const exportEmojis = {
  angry: "😤",
  happy: "✨",
  neutral: "☁️",
  sad: "🌧️",
  surprised: "👀",
};

const VibeExport = ({ song, mood, moodLabel }) => {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 1,
        backgroundColor: "#080d22",
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `my-${mood}-vibe.png`;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to create Vibe Card. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
     
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
      >
        {isExporting ? "Capturing Vibe..." : "📸 Share Vibe"}
      </button>

      <div style={{ position: "fixed", left: "-9999px", top: "-9999px" }}>
        <div
          ref={cardRef}
          style={{
            width: "1080px",
            height: "1920px",
            background: "linear-gradient(180deg, #080d22 0%, #1a0533 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "80px 60px",
            fontFamily: "Inter, sans-serif",
            color: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          {/* Branding */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 900,
                letterSpacing: "0.4em",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              MOODIFY
            </span>
          </div>

          {/* Mood + Song */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <div style={{ fontSize: "160px", lineHeight: 1 }}>
              {exportEmojis[mood?.toLowerCase()] || "🎵"}
            </div>

            <p
              style={{
                fontSize: "56px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "rgba(255,255,255,0.9)",
                margin: 0,
              }}
            >
              Feeling {moodLabel}
            </p>

            {song ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "24px",
                  marginTop: "32px",
                }}
              >
                <img
                  src={song.albumArt || song.posterUrl}
                  alt={song.title}
                  crossOrigin="anonymous"
                  style={{
                    width: "280px",
                    height: "280px",
                    borderRadius: "24px",
                    objectFit: "cover",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                  }}
                />
                <p
                  style={{
                    fontSize: "44px",
                    fontWeight: 700,
                    textAlign: "center",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {song.title}
                </p>
                <p
                  style={{
                    fontSize: "30px",
                    color: "rgba(255,255,255,0.55)",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  {song.artist || "Moodify Recommendations"}
                </p>
              </div>
            ) : (
              <p
                style={{
                  fontSize: "28px",
                  color: "rgba(255,255,255,0.35)",
                  marginTop: "32px",
                }}
              >
                Finding the perfect track...
              </p>
            )}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              WHAT'S YOUR VIBE?
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default VibeExport;