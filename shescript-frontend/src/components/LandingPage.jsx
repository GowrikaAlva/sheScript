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
      {/* Header */}

      <div
        style={{
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 64,
            color: "#1C3A2F",
            margin: 0,
            letterSpacing: "-1px",
          }}
        >
          SheScript
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.14em",
            color: "#7A8E84",
            fontSize: 13,
            marginTop: 6,
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          Prescription Translator for Women
        </p>
      </div>

      {/* Description */}

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 18,
          color: "#4E5C55",
          maxWidth: 640,
          lineHeight: 1.7,
          marginBottom: 44,
        }}
      >
        Understand your prescriptions clearly. SheScript translates complex
        medical instructions into simple language and highlights important
        warnings for women's health.
      </p>

      {/* Features */}

      <div
        style={{
          display: "flex",
          gap: 22,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 42,
        }}
      >
        <Feature icon="📷" title="Scan Prescriptions" />
        <Feature icon="🌍" title="Translate Languages" />
        <Feature icon="⚠️" title="Medicine Reminder" />
        <Feature icon="📅" title="Dosage Checklist" />
      </div>

      {/* CTA Button */}

      <button
        onClick={() => navigate("/register")}
        style={{
          padding: "16px 42px",
          borderRadius: 999,
          border: "none",
          background: "linear-gradient(135deg,#1C3A2F,#2E7D5E)",
          color: "#F5EFE6",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(28,58,47,0.25)",
          transition: "all 0.25s ease",
        }}
      >
        Get Started →
      </button>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#9E9488",
          marginTop: 16,
        }}
      >
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{
            color: "#2E7D5E",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Log in
        </span>
      </p>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#9E9488",
          marginTop: 8,
        }}
      >
        <span
          onClick={() => navigate("/app")}
          style={{
            color: "#2E7D5E",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Use without login
        </span>
      </p>
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
        transition: "all 0.2s",
      }}
    >
      <div style={{ fontSize: 26 }}>{icon}</div>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          marginTop: 10,
          fontSize: 14,
          color: "#2F2F2F",
        }}
      >
        {title}
      </p>
    </div>
  );
}
