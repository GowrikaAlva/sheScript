import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ResultCard from "./components/ResultCard";
import WarningBanner from "./components/WarningBanner";
import DosageChecklist from "./components/DosageChecklist";

import { translateResult } from "./utils/translate";
import { geminiExplain, geminiExplainFromImage } from "./utils/gemini";
import medicines from "./data/medicines.json";

function App() {
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [translatedData, setTranslatedData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState([]);

  const cache = {};

  /* ───────── Load search history ───────── */

  async function loadHistory() {
    try {
      const res = await fetch("http://localhost:3000/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.log("History error:", err);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  /* ───────── PDF Generation (print-based, works for all languages) ───────── */

  function handleDownloadPDF() {
    const element = document.getElementById("pdf-report-content");
    if (!element) return;

    // Collect all inline <style> tags from the current page
    const styleTagsHTML = Array.from(document.querySelectorAll("style"))
      .map((s) => `<style>${s.innerHTML}</style>`)
      .join("\n");

    // Collect all <link rel="stylesheet"> hrefs
    const linkTagsHTML = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((l) => `<link rel="stylesheet" href="${l.href}" />`)
      .join("\n");

    const medicineName = originalData?.medicine_name || "medicine";
    const lang = selectedLanguage;

    const printWindow = window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8" />
        <title>${medicineName} Report</title>

        <!-- Noto Sans covers all Indian scripts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=Noto+Sans:wght@400;600&family=Noto+Sans+Kannada:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&family=Noto+Sans+Telugu:wght@400;600&family=Noto+Sans+Malayalam:wght@400;600&display=swap" rel="stylesheet" />

        <!-- Carry over app styles -->
        ${linkTagsHTML}
        ${styleTagsHTML}

        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            margin: 0;
            padding: 32px 24px;
            background: #F5EFE6 !important;
            font-family:
              'DM Sans',
              'Noto Sans Kannada',
              'Noto Sans Devanagari',
              'Noto Sans Tamil',
              'Noto Sans Telugu',
              'Noto Sans Malayalam',
              'Noto Sans',
              Arial, sans-serif;
          }

          /* Hide any buttons inside the report */
          button { display: none !important; }

          /* Remove animations so everything is visible immediately */
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }

          @page {
            size: A4;
            margin: 14mm 12mm 18mm;
          }

          /* Footer via CSS counter */
          @page {
            @bottom-center {
              content: "MediScan Report  |  ${new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}  |  Lang: ${lang.toUpperCase()}";
              font-size: 8pt;
              color: #9E9488;
            }
          }

          @media print {
            body {
              padding: 0;
              background: #F5EFE6 !important;
            }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for fonts to fully load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }, 900);
    };
  }

  /* ───────── Search handler ───────── */

  const handleSearch = async ({ query, imageFile }) => {
    setLoading(true);
    setSearched(false);
    setTranslatedData(null);
    setSelectedLanguage("en");

    let response;
    const key = query?.toLowerCase().trim();

    /* 1️⃣ Check cache */

    if (cache[key]) {
      response = { success: true, data: cache[key] };
    } else if (!imageFile && medicines[key]) {

    /* 2️⃣ Check local medicine database */
      const med = medicines[key];

      response = {
        success: true,
        data: {
          medicine_name: query,
          used_for: "Common medicine used in treatment",
          simple_explanation:
            "This medicine is commonly prescribed by doctors.",
          side_effects: [],
          safe_dosage: "Take as prescribed by doctor",
          food_interactions: [],
          pregnancy_safe: med.pregnancy_safe,
          pregnancy_note: med.warning || "",
          hormonal_effects: med.hormonal_interaction
            ? "May affect hormones or menstrual cycle"
            : "",
          eli5_explanation:
            "A medicine doctors give to help treat health problems.",
          warning_flags: [],
        },
      };

      cache[key] = response.data;
    } else {

    /* 3️⃣ Use Gemini only if needed */
      response = imageFile
        ? await geminiExplainFromImage(imageFile)
        : await geminiExplain(query);

      if (response.success) {
        cache[key] = response.data;
      }
    }

    /* 4️⃣ Process result */

    if (response.success) {
      setOriginalData(response.data);
      setTranslatedData(response.data);
      setSearched(true);

      try {
        await fetch("http://localhost:3000/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicine: response.data.medicine_name,
            result: response.data.simple_explanation,
            language: selectedLanguage,
          }),
        });

        loadHistory();
      } catch (err) {
        console.log("Save error:", err);
      }
    } else {
      alert(response.error);
    }

    setLoading(false);
  };

  /* ───────── Language switch ───────── */

  async function handleLanguageChange(langCode) {
    setSelectedLanguage(langCode);

    if (langCode === "en") {
      setTranslatedData(originalData);
      return;
    }

    setIsTranslating(true);

    const translated = await translateResult(originalData, langCode);

    setTranslatedData(translated);

    setIsTranslating(false);
  }

  const displayData = translatedData || originalData;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5EFE6; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-2 { animation: fadeUp 0.4s ease 0.08s both; }
        .fade-up-3 { animation: fadeUp 0.4s ease 0.16s both; }
        .fade-up-4 { animation: fadeUp 0.4s ease 0.24s both; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#F5EFE6",
          padding: "48px 16px 64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Search */}

        <div className="fade-up" style={{ width: "100%", maxWidth: 560 }}>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Recent Searches */}

        {history.length > 0 && (
          <div style={{ width: "100%", maxWidth: 560 }}>
            <h4
              style={{
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: 8,
                color: "#5C6F66",
              }}
            >
              Recent Searches
            </h4>

            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  padding: "6px 0",
                  color: "#6E7F77",
                }}
              >
                {item.medicine} ({item.language})
              </div>
            ))}
          </div>
        )}

        {/* Loading */}

        {loading && (
          <p style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Reading prescription...
          </p>
        )}

        {/* Translating */}

        {isTranslating && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#5C6F66" }}>
            Translating...
          </p>
        )}

        {/* Results */}

        {searched && !loading && displayData && (
          <>
            {/* Language Switch */}

            <div className="fade-up" style={{ width: "100%", maxWidth: 560 }}>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9E9488",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Output language
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { code: "en", label: "English" },
                  { code: "kn", label: "ಕನ್ನಡ" },
                  { code: "hi", label: "हिन्दी" },
                  { code: "ta", label: "தமிழ்" },
                  { code: "te", label: "తెలుగు" },
                  { code: "ml", label: "മലയാളം" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 999,
                      border: "1px solid #ccc",
                      background:
                        selectedLanguage === l.code ? "#1C3A2F" : "white",
                      color: selectedLanguage === l.code ? "white" : "black",
                      cursor: "pointer",
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}

            <div className="fade-up" style={{ width: "100%", maxWidth: 560 }}>
              <button
                onClick={handleDownloadPDF}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #1C3A2F 0%, #2E7D5E 100%)",
                  color: "#F5EFE6",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 16px rgba(28,58,47,0.18)",
                }}
              >
                📄 Download Report ({selectedLanguage.toUpperCase()})
              </button>
            </div>

            {/* Report Content */}

            <div id="pdf-report-content" style={{ width: "100%", maxWidth: 560 }}>
              <div className="fade-up-2">
                <WarningBanner
                  medicineName={originalData.medicine_name}
                  result={originalData}
                />
              </div>

              <div className="fade-up-3" style={{ marginTop: 12 }}>
                <ResultCard result={displayData} />
              </div>

              <div className="fade-up-4" style={{ marginTop: 12 }}>
                <DosageChecklist safeDosage={originalData.safe_dosage} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;