// SearchBar.jsx — Person 1
import { useState, useRef } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const languages = [
    { code: "en", label: "English",  script: "EN" },
    { code: "kn", label: "ಕನ್ನಡ",    script: "KA" },
    { code: "hi", label: "हिन्दी",   script: "HI" },
    { code: "ta", label: "தமிழ்",    script: "TA" },
    { code: "te", label: "తెలుగు",   script: "TE" },
    { code: "ml", label: "മലയാളം",  script: "ML" },
  ];

  const handleImage = (file) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImage(e.dataTransfer.files[0]);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    fileRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() && !imageFile) return;
    onSearch({ query, language, imageFile });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* ── Header ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span style={{ fontSize: 36 }}>𓆼</span>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 42,
            fontWeight: 400,
            color: "#1C3A2F",
            letterSpacing: "-1px",
            lineHeight: 1,
          }}>
            SheScript
          </h1>
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#7A9E8E",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}>
          Prescription Translator for Women
        </p>
      </div>

      {/* ── Form Card ── */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#FDFAF6",
          borderRadius: 24,
          border: "1px solid #E8E0D4",
          boxShadow: "0 8px 40px rgba(28,58,47,0.08)",
          padding: "28px 28px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Text area */}
        <div>
          <Label>Medicine name or prescription text</Label>
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Paracetamol 500mg TDS after food..."
            style={{
              width: "100%",
              borderRadius: 14,
              border: "1.5px solid #DDD5C8",
              background: "#FAF7F3",
              padding: "12px 16px",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              color: "#2C2C2C",
              resize: "none",
              outline: "none",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = "#2E7D5E"}
            onBlur={e => e.target.style.borderColor = "#DDD5C8"}
          />
        </div>

        {/* Image upload */}
        <div>
          <Label>Or upload a prescription image</Label>
          <div
            onClick={() => fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            style={{
              borderRadius: 14,
              border: `2px dashed ${dragOver ? "#2E7D5E" : "#DDD5C8"}`,
              background: dragOver ? "#F0FAF5" : "#FAF7F3",
              padding: "18px 12px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {imagePreview ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <img src={imagePreview} alt="preview" style={{ maxHeight: 110, borderRadius: 10, objectFit: "contain" }} />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                  style={{ fontSize: 12, color: "#C94040", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div style={{ color: "#B0A898", fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>📋</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#8A7F74" }}>Drop image here or click to browse</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>JPG, PNG supported</div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImage(e.target.files[0])} />
        </div>

        {/* Language pills */}
        <div>
          <Label>Output language</Label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 999,
                  border: `1.5px solid ${language === l.code ? "#1C3A2F" : "#DDD5C8"}`,
                  background: language === l.code ? "#1C3A2F" : "transparent",
                  color: language === l.code ? "#F5EFE6" : "#6B6259",
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || (!query.trim() && !imageFile)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            border: "none",
            background: loading || (!query.trim() && !imageFile)
              ? "#C5BDB4"
              : "linear-gradient(135deg, #1C3A2F 0%, #2E7D5E 100%)",
            color: "#F5EFE6",
            fontSize: 15,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            cursor: loading || (!query.trim() && !imageFile) ? "not-allowed" : "pointer",
            letterSpacing: "0.02em",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <svg style={{ animation: "spin 1s linear infinite", width: 18, height: 18 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Reading prescription...
            </>
          ) : "Translate Prescription →"}
        </button>
      </form>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea:focus { border-color: #2E7D5E !important; box-shadow: 0 0 0 3px rgba(46,125,94,0.1); }
      `}</style>
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11,
      fontWeight: 600,
      color: "#9E9488",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: 8,
    }}>
      {children}
    </div>
  );
}