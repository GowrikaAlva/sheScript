// DosageChecklist.jsx — Person 1
// Displays morning / afternoon / night checklist from Person 3's generateChecklist() output
// Props: checklist — { morning: bool, afternoon: bool, night: bool, withFood: bool, duration: string }
// Also accepts raw safe_dosage string as fallback

import { useState } from "react";

const SLOTS = [
  { key: "morning", label: "Morning", time: "8:00 AM", emoji: "🌅" },
  { key: "afternoon", label: "Afternoon", time: "2:00 PM", emoji: "☀️" },
  { key: "night", label: "Night", time: "9:00 PM", emoji: "🌙" },
];

export default function DosageChecklist({ checklist = {}, duration }) {
  const [checked, setChecked] = useState({
    morning: false,
    afternoon: false,
    night: false,
  });

  const toggle = (key) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeSlots = SLOTS.filter((s) => checklist[s.key]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        📅 Daily Dosage Checklist
      </h3>

      {/* Dose slots */}
      {activeSlots.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          No specific timing provided.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {activeSlots.map(({ key, label, time, emoji }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors text-left"
              style={{
                backgroundColor: checked[key] ? "#D1FAE5" : "#F9FAFB",
                border: `1px solid ${checked[key] ? "#34D399" : "#E5E7EB"}`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{time}</p>
                </div>
              </div>
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold transition-colors"
                style={{
                  backgroundColor: checked[key] ? "#10B981" : "white",
                  borderColor: checked[key] ? "#10B981" : "#D1D5DB",
                }}
              >
                {checked[key] ? "✓" : ""}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Food note */}
      {checklist.withFood !== undefined && (
        <div
          className="mt-3 rounded-xl px-4 py-2 text-sm"
          style={{
            backgroundColor: checklist.withFood ? "#FEF9C3" : "#F0FDF4",
            color: checklist.withFood ? "#92400E" : "#166534",
          }}
        >
          {checklist.withFood
            ? "🍛 Take this medicine WITH food or after eating."
            : "💧 Can be taken on an empty stomach."}
        </div>
      )}

      {/* Duration */}
      {(checklist.duration || duration) && (
        <p className="mt-3 text-xs text-gray-500">
          📆 Duration: {checklist.duration || duration}
        </p>
      )}

      {/* Progress */}
      {activeSlots.length > 0 && (
        <p className="mt-3 text-xs text-gray-400 text-right">
          {Object.values(checked).filter(Boolean).length} / {activeSlots.length} doses taken today
        </p>
      )}
    </div>
  );
}