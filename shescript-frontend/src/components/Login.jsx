import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Email and password are required");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("shescript_token", data.token);
      localStorage.setItem("shescript_user", JSON.stringify(data.user));
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5EFE6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 42,
            fontWeight: 400,
            color: "#1C3A2F",
            letterSpacing: "-1px",
            margin: 0,
          }}>
            SheScript
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "#7A9E8E",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 500,
            marginTop: 6,
          }}>
            Welcome back
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#FDFAF6",
            borderRadius: 24,
            border: "1px solid #E8E0D4",
            boxShadow: "0 8px 40px rgba(28,58,47,0.08)",
            padding: "32px 28px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {error && (
            <div style={{
              background: "#FFF0F0",
              border: "1px solid #F5C6C6",
              borderRadius: 12,
              padding: "10px 14px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#C94040",
            }}>
              {error}
            </div>
          )}

          <FieldGroup label="Email Address" name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={handleChange} />
          <FieldGroup label="Password" name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              border: "none",
              background: loading ? "#C5BDB4" : "linear-gradient(135deg, #1C3A2F 0%, #2E7D5E 100%)",
              color: "#F5EFE6",
              fontSize: 15,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              transition: "all 0.2s",
              marginTop: 4,
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <p style={{
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "#9E9488",
            marginTop: 4,
          }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#2E7D5E", fontWeight: 600, textDecoration: "none" }}>
              Register
            </Link>
          </p>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
}

function FieldGroup({ label, name, type, placeholder, value, onChange }) {
  return (
    <div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        fontWeight: 600,
        color: "#9E9488",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 8,
      }}>
        {label}
      </div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          borderRadius: 14,
          border: "1.5px solid #DDD5C8",
          background: "#FAF7F3",
          padding: "12px 16px",
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          color: "#2C2C2C",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#2E7D5E")}
        onBlur={(e) => (e.target.style.borderColor = "#DDD5C8")}
      />
    </div>
  );
}
