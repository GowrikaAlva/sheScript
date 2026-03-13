import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ResultCard from './components/ResultCard'
import WarningBanner from './components/WarningBanner'
import DosageChecklist from './components/DosageChecklist'

// ─── Dummy data for testing UI before Person 2 & 3 are ready ───
const DUMMY_RESULT = {
  medicine_name: "Paracetamol 500mg",
  used_for: "Pain relief and fever reduction",
  simple_explanation:
    "This medicine helps reduce fever and relieve mild to moderate pain like headaches, body aches, and toothaches.",
  eli5_explanation:
    "It makes your fever go down and takes away pain. Like a helper for when your body hurts.",
  safe_dosage: "Take 1 tablet after breakfast, lunch, and dinner (3 times a day). Do not take more than 4 tablets in 24 hours.",
  side_effects: ["Nausea if taken on empty stomach", "Rarely: skin rash", "Liver stress if overdosed"],
  food_interactions: ["Avoid alcohol completely", "Do not take with other paracetamol-containing medicines"],
  pregnancy_safe: true,
  pregnancy_note: null,
  hormonal_effects: null,
  warning_flags: [],
}

const DUMMY_FLAGS = [
  { type: "info", message: "Safe for most women. Always complete the full course." },
]

const DUMMY_CHECKLIST = {
  morning: true,
  afternoon: true,
  night: true,
  withFood: true,
  duration: "5 days or as prescribed",
}

function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [flags, setFlags] = useState([])
  const [checklist, setChecklist] = useState(null)
  const [searched, setSearched] = useState(false)

  // ── Replace this with real Gemini + womenFlags + generateChecklist calls later ──
  const handleSearch = async ({ query, language, imageFile }) => {
    setLoading(true)
    setSearched(false)

    // Simulate API delay — Person 2 will replace this block
    await new Promise((res) => setTimeout(res, 1800))

    setResult(DUMMY_RESULT)
    setFlags(DUMMY_FLAGS)
    setChecklist(DUMMY_CHECKLIST)
    setLoading(false)
    setSearched(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center gap-6">

      {/* Search Input */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center gap-2 text-gray-400 py-8">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm">Reading your prescription...</p>
        </div>
      )}

      {/* Results */}
      {searched && !loading && result && (
        <>
          <WarningBanner flags={flags} result={result} />
          <ResultCard result={result} />
          <DosageChecklist checklist={checklist} />
        </>
      )}

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-4 text-center max-w-sm">
        SheScript does not replace your doctor. It helps you understand what you were given. 💚
      </p>
    </div>
  )
}

export default App