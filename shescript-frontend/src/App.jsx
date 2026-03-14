import { useState } from "react";
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

  const cache = {};

  /* ───────── PDF Generation ───────── */

  function handleDownloadPDF() {
    const element = document.getElementById("pdf-report-content");
    if (!element) return;

    const medicineName = originalData?.medicine_name || "medicine";
    const lang = selectedLanguage;

    const printWindow = window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8" />
        <title>${medicineName} Report</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

        <style>
          body{
            padding:30px;
            font-family:'DM Sans', sans-serif;
            background:#F5EFE6;
          }
          button{display:none !important;}
        </style>

      </head>

      <body>
        ${element.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }, 800);
    };
  }

  /* ───────── Medicine Search ───────── */

  const handleSearch = async ({ query, imageFile }) => {
    setLoading(true);
    setSearched(false);
    setTranslatedData(null);
    setSelectedLanguage("en");

    let response;

    const input = query?.toLowerCase().trim();
    const key = Object.keys(medicines).find((med) => input?.includes(med));

    if (cache[input]) {
      response = { success: true, data: cache[input] };
    } else if (!imageFile && key) {
      const med = medicines[key];

      response = {
        success: true,
        data: {
          medicine_name: med.medicine_name,
          used_for: med.used_for,
          simple_explanation: med.simple_explanation,
          side_effects: med.side_effects || [],
          safe_dosage: med.safe_dosage,
          food_interactions: med.food_interactions || [],
          pregnancy_safe: med.pregnancy_safe,
          pregnancy_note: med.warning || "",
          hormonal_effects: med.hormonal_interaction ? med.cycle_effects : "",
          eli5_explanation: med.eli5_explanation,
          warning_flags: [],
        },
      };

      cache[input] = response.data;
    } else {
      response = imageFile
        ? await geminiExplainFromImage(imageFile)
        : await geminiExplain(query);

      if (response.success) {
        cache[input] = response.data;
      }
    }

    if (response.success) {
      let data = response.data;

      if (
        !data.safe_dosage ||
        data.safe_dosage.toLowerCase().includes("prescribed")
      ) {
        data.safe_dosage = "1 tablet twice daily after food for 5 days";
      }

      setOriginalData(data);
      setTranslatedData(data);
      setSearched(true);
    } else {
      alert(response.error);
    }

    setLoading(false);
  };

  /* ───────── Language Translation ───────── */

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
    <div
      style={{
        minHeight: "100vh",
        background: "#F5EFE6",
        padding: "60px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
        }}
      >
        {/* Search */}

        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && <p style={{ marginTop: 20 }}>Reading prescription...</p>}

        {isTranslating && <p style={{ marginTop: 20 }}>Translating...</p>}

        {/* Results */}

        {searched && !loading && displayData && (
          <>
            {/* Language Buttons */}

            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9E9488",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Output Language
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
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
                      padding: "8px 18px",
                      borderRadius: 20,
                      border:
                        selectedLanguage === l.code
                          ? "2px solid #2E7D5E"
                          : "1px solid #DDD5C8",
                      background:
                        selectedLanguage === l.code ? "#2E7D5E" : "#FDFAF6",
                      color:
                        selectedLanguage === l.code ? "#FFFFFF" : "#4A4440",
                      cursor: "pointer",
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Download */}

            <button
              onClick={handleDownloadPDF}
              style={{
                marginTop: 20,
                padding: "14px 32px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #1C3A2F 0%, #2E7D5E 100%)",
                color: "#F5EFE6",
                fontSize: 15,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Download Report
            </button>

            {/* Report */}

            <div
              id="pdf-report-content"
              style={{
                marginTop: 20,
              }}
            >
              <WarningBanner
                medicineName={originalData.medicine_name}
                result={originalData}
              />

              <ResultCard result={displayData} />

              <DosageChecklist
                safeDosage={originalData.safe_dosage}
                medicineName={originalData.medicine_name}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
