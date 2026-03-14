import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5EFE6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      {/* Logo */}

      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 60,
            color: "#1C3A2F",
            marginBottom: 8,
          }}
        >
          SheScript
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.12em",
            color: "#7A8E84",
            fontSize: 14,
          }}
        >
          PRESCRIPTION TRANSLATOR FOR WOMEN
        </p>
      </div>

      {/* Description */}

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 18,
          color: "#4E5C55",
          maxWidth: 600,
          lineHeight: 1.7,
          marginBottom: 40,
        }}
      >
        Understand your prescriptions clearly. SheScript translates complex
        medical instructions into simple language and highlights important
        warnings for women’s health.
      </p>

      {/* Features */}

      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        <Feature icon="📷" title="Scan Prescriptions" />
        <Feature icon="🌍" title="Translate Languages" />
        <Feature icon="⚠️" title="Women Safety Warnings" />
        <Feature icon="📅" title="Dosage Checklist" />
      </div>

      {/* Button */}

      <button
        onClick={() => navigate("/app")}
        style={{
          padding: "16px 40px",
          borderRadius: 999,
          border: "none",
          background: "linear-gradient(135deg,#1C3A2F,#2E7D5E)",
          color: "#F5EFE6",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(28,58,47,0.25)",
        }}
      >
        Get Started →
      </button>
    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div
      style={{
        background: "#FDFAF6",
        border: "1px solid #E6DED4",
        padding: "20px 28px",
        borderRadius: 16,
        width: 180,
      }}
    >
      <div style={{ fontSize: 26 }}>{icon}</div>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          marginTop: 10,
          fontSize: 14,
        }}
      >
        {title}
      </p>
    </div>
  );
}
