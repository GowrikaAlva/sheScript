// ─────────────────────────────────────────────
// SUPPORTED LANGUAGES
// ─────────────────────────────────────────────
export const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Hindi", code: "hi" },
  { label: "Kannada", code: "kn" },
  { label: "Tamil", code: "ta" },
  { label: "Telugu", code: "te" },
  { label: "Malayalam", code: "ml" },
];

// ─────────────────────────────────────────────
// TRANSLATE A SINGLE STRING
// uses MyMemory API — completely free, no key needed
// ─────────────────────────────────────────────
export async function translateText(text, targetLanguage) {
  if (targetLanguage === "en") return text;
  if (!text || text.trim() === "") return text;

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`,
    );

    const data = await response.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      return text; // return original if failed
    }
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
}

// ─────────────────────────────────────────────
// TRANSLATE AN ARRAY OF STRINGS
// ─────────────────────────────────────────────
export async function translateArray(arr, targetLanguage) {
  if (targetLanguage === "en") return arr;
  if (!arr || arr.length === 0) return arr;

  try {
    // translate each item one by one
    const translated = await Promise.all(
      arr.map((item) => translateText(item, targetLanguage)),
    );
    return translated;
  } catch (error) {
    console.error("Array translation failed:", error);
    return arr;
  }
}

// ─────────────────────────────────────────────
// TRANSLATE ENTIRE MEDICINE RESULT OBJECT
// Person 1 calls only this one function
// ─────────────────────────────────────────────
export async function translateResult(resultData, targetLanguage) {
  if (targetLanguage === "en") return resultData;

  try {
    const [
      used_for,
      simple_explanation,
      safe_dosage,
      pregnancy_note,
      hormonal_effects,
      eli5_explanation,
      side_effects,
      food_interactions,
      warning_flags,
    ] = await Promise.all([
      translateText(resultData.used_for, targetLanguage),
      translateText(resultData.simple_explanation, targetLanguage),
      translateText(resultData.safe_dosage, targetLanguage),
      translateText(resultData.pregnancy_note, targetLanguage),
      translateText(resultData.hormonal_effects, targetLanguage),
      translateText(resultData.eli5_explanation, targetLanguage),
      translateArray(resultData.side_effects, targetLanguage),
      translateArray(resultData.food_interactions, targetLanguage),
      translateArray(resultData.warning_flags, targetLanguage),
    ]);

    return {
      ...resultData,
      used_for,
      simple_explanation,
      safe_dosage,
      pregnancy_note,
      hormonal_effects,
      eli5_explanation,
      side_effects,
      food_interactions,
      warning_flags,
    };
  } catch (error) {
    console.error("Full translation failed:", error);
    return resultData;
  }
}
