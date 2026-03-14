import { useState, useRef } from "react";
import { speakWithSarvam } from "../utils/tts";

export default function ResultCard({ result, lang = "en-IN" }) {
  if (!result) return null;

  const {
    medicine_name, used_for, simple_explanation,
    side_effects = [], safe_dosage,
    food_interactions = [], eli5_explanation,
  } = result;

  const [activeSection, setActiveSection] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const stoppedRef = useRef(false);

  function buildSections() {
    return [
      { key: "header", label: "Medicine Overview", text: `${medicine_name}. Used for: ${used_for}.` },
      { key: "what",   label: "What is this medicine?", text: simple_explanation },
      eli5_explanation && { key: "eli5", label: "Simple version", text: eli5_explanation },
      { key: "dosage", label: "How to take it", text: safe_dosage },
      side_effects.length && { key: "side", label: "Possible side effects", text: `Possible side effects: ${side_effects.join(". ")}` },
      food_interactions.length && { key: "food", label: "Food and drink to avoid", text: `Food and drink to avoid: ${food_interactions.join(". ")}` },
    ].filter(Boolean);
  }

  async function speakSection(sections, idx) {
    if (stoppedRef.current || idx >= sections.length) {
      setIsPlaying(false);
      setActiveSection(null);
      return;
    }

    const section = sections[idx];
    setActiveSection(section.key);

    try {
      const audioUrl = await speakWithSarvam(section.text, lang);

      if (stoppedRef.current) return;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        speakSection(sections, idx + 1);
      };
      audio.onerror = () => {
        setError("Playback failed, skipping section");
        setTimeout(() => setError(null), 3000);
        speakSection(sections, idx + 1);
      };

      await audio.play();

    } catch (err) {
      console.error("Sarvam TTS error:", err);
      setError(err.message);
      setIsPlaying(false);
      setActiveSection(null);
    }
  }

  async function handlePlayPause() {
    if (isPlaying) {
      stoppedRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setActiveSection(null);
      return;
    }

    stoppedRef.current = false;
    setError(null);
    setIsPlaying(true);
    await speakSection(buildSections(), 0);
  }

  const sections = buildSections();
  const totalSections = sections.length;
  const currentIdx = sections.findIndex(s => s.key === activeSection);
  const progress = activeSection ? ((currentIdx + 1) / totalSections) * 100 : 0;

  return (
    <div style={{ width: "100%", maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── Medicine Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1C3A2F 0%, #2E7D5E 100%)",
        borderRadius: 24, padding: "24px 28px",
        color: "#F5EFE6", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", right: 20, bottom: -40, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: 6 }}>
          Medicine
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 26, fontWeight: 400, margin: 0, lineHeight: 1.2 }}>
          {medicine_name}
        </h2>
        <div style={{ marginTop: 10, display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "4px 12px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500 }}>{used_for}</span>
        </div>

        {/* Play/Stop */}
        <button onClick={handlePlayPause} style={{
          position: "absolute", top: 20, right: 20,
          background: isPlaying ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.18)",
          border: "1.5px solid rgba(255,255,255,0.4)",
          borderRadius: 999, padding: "6px 14px", color: "#F5EFE6",
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          transition: "background 0.2s",
        }}>
          {isPlaying ? "⏹ Stop" : "🔊 Read All"}
        </button>

        {/* Progress bar */}
        {isPlaying && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, opacity: 0.75 }}>
                📖 {sections.find(s => s.key === activeSection)?.label}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, opacity: 0.55 }}>
                {currentIdx + 1} / {totalSections}
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.2)" }}>
              <div style={{ height: "100%", borderRadius: 999, background: "#A8D5BE", width: `${progress}%`, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* Error toast */}
        {error && (
          <div style={{
            marginTop: 10, background: "rgba(255,100,100,0.2)",
            border: "1px solid rgba(255,100,100,0.4)", borderRadius: 10,
            padding: "6px 12px", fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "#F5EFE6",
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* ── Cards ── */}
      <InfoCard icon="💬" label="What is this medicine?" accent="#D4EAE0" active={activeSection === "what"}>
        <p style={bodyText}>{simple_explanation}</p>
      </InfoCard>

      {eli5_explanation && (
        <InfoCard icon="🧓" label="Simple version (for elderly users)" accent="#E8E3F5" active={activeSection === "eli5"}>
          <p style={{ ...bodyText, fontStyle: "italic", color: "#5A5070" }}>"{eli5_explanation}"</p>
        </InfoCard>
      )}

      <InfoCard icon="⏰" label="How to take it" accent="#D4EAE0" active={activeSection === "dosage"}>
        <p style={{ ...bodyText, fontWeight: 600, color: "#1C3A2F" }}>{safe_dosage}</p>
      </InfoCard>

      {side_effects.length > 0 && (
        <InfoCard icon="⚠️" label="Possible side effects" accent="#F5E8C8" active={activeSection === "side"}>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {side_effects.map((e, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, ...bodyText }}>
                <span style={{ color: "#C49A2A", marginTop: 2, flexShrink: 0 }}>◆</span>{e}
              </li>
            ))}
          </ul>
        </InfoCard>
      )}

      {food_interactions.length > 0 && (
        <InfoCard icon="🍽️" label="Food & drink to avoid" accent="#F5DDD4" active={activeSection === "food"}>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {food_interactions.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, ...bodyText }}>
                <span style={{ color: "#C94040", marginTop: 2, flexShrink: 0 }}>◆</span>{item}
              </li>
            ))}
          </ul>
        </InfoCard>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(46,125,94,0.25); }
          50%       { box-shadow: 0 0 0 5px rgba(46,125,94,0.10); }
        }
      `}</style>
    </div>
  );
}

const bodyText = {
  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
  color: "#3D3530", lineHeight: 1.65, margin: 0,
};

function InfoCard({ icon, label, accent, children, active }) {
  return (
    <div style={{
      background: active ? "#F2FAF6" : "#FDFAF6",
      borderRadius: 18,
      border: `1px solid ${active ? "#2E7D5E" : "#EDE5DA"}`,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(28,58,47,0.04)",
      animation: active ? "pulse-border 1.6s ease-in-out infinite" : "none",
      transition: "border-color 0.3s, background 0.3s",
    }}>
      <div style={{ height: 4, background: active ? "#2E7D5E" : accent }} />
      <div style={{ padding: "14px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 15 }}>{icon}</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
            color: active ? "#2E7D5E" : "#9E9488",
            letterSpacing: "0.12em", textTransform: "uppercase", transition: "color 0.3s",
          }}>{label}</span>
          {active && (
            <span style={{ marginLeft: "auto", fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#2E7D5E", fontWeight: 600 }}>
              🔊 Reading…
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}