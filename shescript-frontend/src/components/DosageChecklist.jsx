// DosageChecklist.jsx — Person 1
import { useState } from "react";
import { generateChecklist } from "../utils/checklist";  

const SLOTS = [
  { key: "morning",   label: "Morning",   time: "8:00 AM", emoji: "🌅" },
  { key: "afternoon", label: "Afternoon", time: "2:00 PM", emoji: "☀️" },
  { key: "night",     label: "Night",     time: "9:00 PM", emoji: "🌙" },
];

export default function DosageChecklist({ safeDosage }) {
  const checklist = generateChecklist ? generateChecklist(safeDosage) : {};
  const [checked, setChecked] = useState({ morning: false, afternoon: false, night: false });
  const toggle = (key) => setChecked((p) => ({ ...p, [key]: !p[key] }));

  const activeSlots = SLOTS.filter((s) => checklist[s.key]);
  const doneCount = activeSlots.filter((s) => checked[s.key]).length;
  const allDone = activeSlots.length > 0 && doneCount === activeSlots.length;

  return (
    <div style={{
      width: "100%", maxWidth: 560, margin: "0 auto",
      background: "#FDFAF6",
      borderRadius: 24,
      border: "1px solid #EDE5DA",
      boxShadow: "0 2px 16px rgba(28,58,47,0.05)",
      padding: "20px 22px 18px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>📅</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: "#9E9488",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>Daily Checklist</span>
        </div>
        {activeSlots.length > 0 && (
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: 999,
            background: allDone ? "#D4EAE0" : "#F0EBE3",
            color: allDone ? "#1C6645" : "#7A6A5A",
            transition: "all 0.3s",
          }}>
            {doneCount}/{activeSlots.length} done
          </span>
        )}
      </div>

      {/* Slots */}
      {activeSlots.length === 0 ? (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#B0A898", fontStyle: "italic" }}>
          No specific timing info available.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {activeSlots.map(({ key, label, time, emoji }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 14,
                border: `1.5px solid ${checked[key] ? "#7DC4A0" : "#DDD5C8"}`,
                background: checked[key] ? "#F0FAF5" : "#FAF7F3",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <div>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, fontWeight: 600,
                    color: checked[key] ? "#1C6645" : "#2C2C2C",
                    margin: 0, lineHeight: 1.2,
                  }}>{label}</p>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11, color: "#9E9488",
                    margin: 0, marginTop: 2,
                  }}>{time}</p>
                </div>
              </div>
              {/* checkbox */}
              <div style={{
                width: 26, height: 26,
                borderRadius: "50%",
                border: `2px solid ${checked[key] ? "#2E7D5E" : "#C5BDB4"}`,
                background: checked[key] ? "#2E7D5E" : "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 13, fontWeight: 700,
                transition: "all 0.2s",
              }}>
                {checked[key] ? "✓" : ""}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Food note */}
      {checklist.withFood !== undefined && (
        <div style={{
          marginTop: 14,
          padding: "10px 14px",
          borderRadius: 12,
          background: checklist.withFood ? "#FDF8EE" : "#F0FAF5",
          border: `1px solid ${checklist.withFood ? "#E8D5A0" : "#A7D9BF"}`,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>{checklist.withFood ? "🍛" : "💧"}</span>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 500,
            color: checklist.withFood ? "#6B4A0E" : "#1C6645",
            margin: 0,
          }}>
            {checklist.withFood ? "Take WITH food or after eating." : "Can be taken on empty stomach."}
          </p>
        </div>
      )}

      {/* Duration */}
      {checklist.duration && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: "#9E9488",
          marginTop: 12, marginBottom: 0,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span>📆</span> Duration:{" "}
          <strong style={{ color: "#5A5048" }}>{checklist.duration}</strong>
        </p>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}