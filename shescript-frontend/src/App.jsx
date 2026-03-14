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

  /* ───────── Load history ───────── */

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

  /* ───────── PDF Generation ───────── */

  function handleDownloadPDF() {
    const element = document.getElementById("pdf-report-content");
    if (!element) return;

    const styleTagsHTML = Array.from(document.querySelectorAll("style"))
      .map((s) => `<style>${s.innerHTML}</style>`)
      .join("\n");

    const linkTagsHTML = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]'),
    )
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

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

        ${linkTagsHTML}
        ${styleTagsHTML}

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

    /* Fuzzy matching for medicines */

    const key = Object.keys(medicines).find((med) => input?.includes(med));

    /* Cache */

    if (cache[input]) {
      response = { success: true, data: cache[input] };
    } else if (!imageFile && key) {

    /* Local medicine database */
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

    /* Gemini fallback */
      response = imageFile
        ? await geminiExplainFromImage(imageFile)
        : await geminiExplain(query);

      if (response.success) {
        cache[input] = response.data;
      }
    }

    /* Process result */

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

      try {
        await fetch("http://localhost:3000/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicine: data.medicine_name,
            result: data.simple_explanation,
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
    <>
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

        <div style={{ width: "100%", maxWidth: 560 }}>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* History */}

        {history.length > 0 && (
          <div style={{ width: "100%", maxWidth: 560 }}>
            <h4>Recent Searches</h4>

            {history.map((item, index) => (
              <div key={index}>
                {item.medicine} ({item.language})
              </div>
            ))}
          </div>
        )}

        {loading && <p>Reading prescription...</p>}
        {isTranslating && <p>Translating...</p>}

        {/* Results */}

        {searched && !loading && displayData && (
          <>
            {/* Language buttons */}

            <div style={{ width: "100%", maxWidth: 560 }}>
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
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Download PDF */}

            <button onClick={handleDownloadPDF}>Download Report</button>

            {/* Report */}

            <div id="pdf-report-content" style={{ width: 560 }}>
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
    </>
  );
}

export default App;
