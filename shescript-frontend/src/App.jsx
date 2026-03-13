import { useState, useEffect } from "react"
import SearchBar from "./components/SearchBar"
import ResultCard from "./components/ResultCard"
import WarningBanner from "./components/WarningBanner"
import DosageChecklist from "./components/DosageChecklist"

import { translateResult } from "./utils/translate"
import { geminiExplain, geminiExplainFromImage } from "./utils/gemini"

function App() {

  const [loading, setLoading] = useState(false)
  const [originalData, setOriginalData] = useState(null)
  const [translatedData, setTranslatedData] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)
  const [searched, setSearched] = useState(false)
  const [history, setHistory] = useState([])

  /* ───────── Load search history ───────── */

  async function loadHistory() {
    try {
      const res = await fetch("http://localhost:3000/history")
      const data = await res.json()
      setHistory(data)
    } catch (err) {
      console.log("History error:", err)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  /* ───────── Search handler ───────── */

  const handleSearch = async ({ query, imageFile }) => {

    setLoading(true)
    setSearched(false)
    setTranslatedData(null)
    setSelectedLanguage("en")

    const response = imageFile
      ? await geminiExplainFromImage(imageFile)
      : await geminiExplain(query)

    if (response.success) {

      setOriginalData(response.data)
      setTranslatedData(response.data)
      setSearched(true)

      /* Save search to backend */

      try {

        await fetch("http://localhost:3000/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            medicine: response.data.medicine_name,
            result: response.data.description || response.data,
            language: selectedLanguage
          })
        })

        loadHistory()

      } catch (err) {
        console.log("Save error:", err)
      }

    } else {
      alert(response.error)
    }

    setLoading(false)
  }

  /* ───────── Language switch ───────── */

  async function handleLanguageChange(langCode) {

    setSelectedLanguage(langCode)

    if (langCode === "en") {
      setTranslatedData(originalData)
      return
    }

    setIsTranslating(true)

    const translated = await translateResult(originalData, langCode)

    setTranslatedData(translated)

    setIsTranslating(false)
  }

  const displayData = translatedData || originalData

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

      <div style={{
        minHeight: "100vh",
        background: "#F5EFE6",
        backgroundImage: "radial-gradient(circle at 20% 20%, #E8F5EE 0%, transparent 50%), radial-gradient(circle at 80% 80%, #F5E8E0 0%, transparent 50%)",
        padding: "48px 16px 64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}>

        {/* Search Bar */}

        <div className="fade-up" style={{ width: "100%", maxWidth: 560 }}>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Recent Searches */}

        {history.length > 0 && (
          <div style={{ width: "100%", maxWidth: 560 }}>
            <h4 style={{
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 8,
              color: "#5C6F66"
            }}>
              Recent Searches
            </h4>

            {history.map((item, index) => (
              <div key={index} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                padding: "6px 0",
                color: "#6E7F77"
              }}>
                {item.medicine} ({item.language})
              </div>
            ))}
          </div>
        )}

        {/* Loading Spinner */}

        {loading && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "32px 0",
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "3px solid #D4EAE0",
              borderTopColor: "#2E7D5E",
              animation: "spin 0.8s linear infinite",
            }} />

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#7A9E8E"
            }}>
              Reading your prescription...
            </p>

            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Results */}

        {searched && !loading && displayData && (
          <>
            <div className="fade-up" style={{ width: "100%", maxWidth: 560 }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#9E9488",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}>Output language</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
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
                    type="button"
                    disabled={isTranslating}
                    onClick={() => handleLanguageChange(l.code)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 999,
                      border: `1.5px solid ${selectedLanguage === l.code ? "#1C3A2F" : "#DDD5C8"}`,
                      background: selectedLanguage === l.code ? "#1C3A2F" : "transparent",
                      color: selectedLanguage === l.code ? "#F5EFE6" : "#6B6259",
                      fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      cursor: isTranslating ? "not-allowed" : "pointer",
                      opacity: isTranslating ? 0.6 : 1,
                      transition: "all 0.15s",
                    }}
                  >
                    {l.label}
                  </button>
                ))}
                {isTranslating && <span style={{ fontSize: 13, color: "#7A9E8E", fontFamily: "'DM Sans', sans-serif" }}>Translating...</span>}
              </div>
            </div>

            <div className="fade-up-2" style={{ width: "100%", maxWidth: 560 }}>
              <WarningBanner
                medicineName={originalData.medicine_name}
                result={originalData}
              />
            </div>

            <div className="fade-up-3" style={{ width: "100%", maxWidth: 560 }}>
              <ResultCard data={displayData} />
            </div>

            <div className="fade-up-4" style={{ width: "100%", maxWidth: 560 }}>
              <DosageChecklist safeDosage={originalData.safe_dosage} />
            </div>
          </>
        )}

        {/* Footer */}

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: "#A89E94",
          marginTop: 8,
          textAlign: "center",
          maxWidth: 360,
          lineHeight: 1.6,
        }}>
          SheScript does not replace your doctor.
          <br />
          It helps you understand what you were given. 💚
        </p>

      </div>
    </>
  )
}

export default App