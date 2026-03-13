import { LANGUAGES } from "../utils/translate";

export default function LanguageSwitch({
  selectedLanguage,
  onLanguageChange,
  isLoading,
}) {
  return (
    <div className="flex items-center gap-2 my-3">
      <label className="font-semibold text-[#2E4057]">🌐 Language:</label>

      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={isLoading}
        className="border-2 border-gray-300 rounded-xl 
                   p-2 text-base bg-white cursor-pointer"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>

      {isLoading && <p className="text-sm text-gray-400">Translating...</p>}
    </div>
  );
}
