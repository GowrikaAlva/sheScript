import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ResultCard from './components/ResultCard'
import WarningBanner from './components/WarningBanner'
import DosageChecklist from './components/DosageChecklist'
import LanguageSwitch from './components/LanguageSwitch'
import { translateResult } from './utils/translate'
import { geminiExplain, geminiExplainFromImage } from './utils/gemini'

function App() {
  const [loading, setLoading] = useState(false)
  const [originalData, setOriginalData] = useState(null)
  const [translatedData, setTranslatedData] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)
  const [searched, setSearched] = useState(false)

  // ── Real Gemini call ──
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
    } else {
      alert(response.error)
    }

    setLoading(false)
  }

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
          to   { opacity: 1; transform: translateY(0); }
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

        {/* Search */}
        <div className="fade-up" style={{ width: "100%", maxWidth: 560 }}>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            padding: "32px 0",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "3px solid #D4EAE0",
              borderTopColor: "#2E7D5E",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7A9E8E" }}>
              Reading your prescription...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Results */}
        {searched && !loading && displayData && (
          <>
            {originalData && (
              <div className="fade-up" style={{ width: "100%", maxWidth: 560 }}>
                <LanguageSwitch
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  isLoading={isTranslating}
                />
              </div>
            )}

            <div className="fade-up-2" style={{ width: "100%", maxWidth: 560 }}>
              <WarningBanner medicineName={originalData.medicine_name} result={originalData} />
            </div>

            <div className="fade-up-3" style={{ width: "100%", maxWidth: 560 }}>
              <ResultCard data={translatedData || originalData} />
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
          SheScript does not replace your doctor.<br />
          It helps you understand what you were given. 💚
        </p>
      </div>
    </>
  )
}

export default App