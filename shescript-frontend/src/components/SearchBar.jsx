// SearchBar.jsx — Person 1
// Handles: text input, image upload, language dropdown, submit button

import { useState, useRef } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();

  const languages = [
    { code: "en", label: "English" },
    { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { code: "hi", label: "हिन्दी (Hindi)" },
    { code: "ta", label: "தமிழ் (Tamil)" },
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4"
    >
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold" style={{ color: "#2E4057" }}>
          💊 SheScript
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered prescription translator for women
        </p>
      </div>

      {/* Text Input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Medicine name or prescription text
        </label>
        <textarea
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Paracetamol 500mg TDS after food"
          className="border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2"
          style={{ focusRingColor: "#2E4057" }}
        />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Or upload a prescription image
        </label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-green-400 transition-colors"
          onClick={() => fileRef.current.click()}
        >
          {imagePreview ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={imagePreview}
                alt="Prescription preview"
                className="max-h-32 rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                className="text-xs text-red-500 hover:underline"
              >
                Remove image
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <span className="text-3xl">📋</span>
              <span className="text-sm">Click to upload prescription image</span>
              <span className="text-xs">JPG, PNG supported</span>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImage}
        />
      </div>

      {/* Language Selector */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Choose language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || (!query.trim() && !imageFile)}
        className="w-full py-3 rounded-xl text-white font-semibold text-base transition-opacity disabled:opacity-50"
        style={{ backgroundColor: "#2E4057" }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Translating...
          </span>
        ) : (
          "🔍 Translate Prescription"
        )}
      </button>
    </form>
  );
}