// ResultCard.jsx — Person 1
export default function ResultCard({ result }) {
  if (!result) return null;

  const {
    medicine_name,
    used_for,
    simple_explanation,
    side_effects = [],
    safe_dosage,
    food_interactions = [],
    eli5_explanation,
  } = result;

  return (
    <div style={{ width: "100%", maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── Medicine Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1C3A2F 0%, #2E7D5E 100%)",
        borderRadius: 24,
        padding: "24px 28px",
        color: "#F5EFE6",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circle */}
        <div style={{
          position: "absolute", right: -30, top: -30,
          width: 120, height: 120, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />
        <div style={{
          position: "absolute", right: 20, bottom: -40,
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: 6 }}>
          Medicine
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 26, fontWeight: 400, margin: 0, lineHeight: 1.2 }}>
          {medicine_name}
        </h2>
        <div style={{
          marginTop: 10,
          display: "inline-block",
          background: "rgba(255,255,255,0.15)",
          borderRadius: 999,
          padding: "4px 12px",
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500 }}>{used_for}</span>
        </div>
      </div>

      {/* ── Cards ── */}
      <InfoCard icon="💬" label="What is this medicine?" accent="#D4EAE0">
        <p style={bodyText}>{simple_explanation}</p>
      </InfoCard>

      {eli5_explanation && (
        <InfoCard icon="🧓" label="Simple version (for elderly users)" accent="#E8E3F5">
          <p style={{ ...bodyText, fontStyle: "italic", color: "#5A5070" }}>"{eli5_explanation}"</p>
        </InfoCard>
      )}

      <InfoCard icon="⏰" label="How to take it" accent="#D4EAE0">
        <p style={{ ...bodyText, fontWeight: 600, color: "#1C3A2F" }}>{safe_dosage}</p>
      </InfoCard>

      {side_effects.length > 0 && (
        <InfoCard icon="⚠️" label="Possible side effects" accent="#F5E8C8">
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {side_effects.map((e, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, ...bodyText }}>
                <span style={{ color: "#C49A2A", marginTop: 2, flexShrink: 0 }}>◆</span>
                {e}
              </li>
            ))}
          </ul>
        </InfoCard>
      )}

      {food_interactions.length > 0 && (
        <InfoCard icon="🍽️" label="Food & drink to avoid" accent="#F5DDD4">
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {food_interactions.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, ...bodyText }}>
                <span style={{ color: "#C94040", marginTop: 2, flexShrink: 0 }}>◆</span>
                {item}
              </li>
            ))}
          </ul>
        </InfoCard>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
    </div>
  );
}

const bodyText = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  color: "#3D3530",
  lineHeight: 1.65,
  margin: 0,
};

function InfoCard({ icon, label, accent, children }) {
  return (
    <div style={{
      background: "#FDFAF6",
      borderRadius: 18,
      border: "1px solid #EDE5DA",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(28,58,47,0.04)",
    }}>
      {/* coloured top strip */}
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "14px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 15 }}>{icon}</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: "#9E9488",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>{label}</span>
        </div>
        {children}
      </div>
    </div>
  );
}