// WarningBanner.jsx — Person 1
import { getWomenFlags } from "../utils/womenFlags";  

const CONFIG = {
  danger: {
    bg: "#FDF1F1",
    strip: "#C94040",
    text: "#7A1F1F",
    subtext: "#A84040",
    icon: "🚨",
  },
  warning: {
    bg: "#FDF8EE",
    strip: "#C49A2A",
    text: "#6B4A0E",
    subtext: "#9A7020",
    icon: "⚠️",
  },
  info: {
    bg: "#F0F6FB",
    strip: "#3A7CA5",
    text: "#1A3A52",
    subtext: "#4A6A82",
    icon: "ℹ️",
  },
};

function Banner({ type, label, message }) {
  const s = CONFIG[type] || CONFIG.info;
  return (
    <div style={{
      background: s.bg,
      borderRadius: 16,
      overflow: "hidden",
      border: `1px solid ${s.strip}22`,
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      display: "flex",
    }}>
      {/* left accent bar */}
      <div style={{ width: 4, background: s.strip, flexShrink: 0, borderRadius: "4px 0 0 4px" }} />
      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 14 }}>{s.icon}</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: s.text,
            letterSpacing: "0.04em",
          }}>{label}</span>
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: s.subtext,
          lineHeight: 1.6,
          margin: 0,
        }}>{message}</p>
      </div>
    </div>
  );
}

export default function WarningBanner({ medicineName, result = {} }) {
  const flags = getWomenFlags ? getWomenFlags(medicineName) : [];
  const extraFlags = [];

  if (result.pregnancy_safe === false) {
    extraFlags.unshift({
      type: "danger",
      label: "Pregnancy Warning",
      message: result.pregnancy_note || "This medicine is NOT safe during pregnancy. Please consult your doctor immediately.",
    });
  }
  if (result.hormonal_effects) {
    extraFlags.push({ type: "warning", label: "Hormonal Effect", message: result.hormonal_effects });
  }

  const allFlags = [...extraFlags, ...(flags || [])];

  if (allFlags.length === 0) {
    return (
      <div style={{
        width: "100%", maxWidth: 560, margin: "0 auto",
        background: "#F0FAF5",
        borderRadius: 16,
        border: "1px solid #A7D9BF",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#1C6645", margin: 0 }}>
          No major warnings found for this medicine.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
      {allFlags.map((flag, i) => (
        <Banner key={i} type={flag.type} label={flag.label} message={flag.message} />
      ))}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}