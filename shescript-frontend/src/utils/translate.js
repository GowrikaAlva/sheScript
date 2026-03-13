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
  if (!text) return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url);
    const data = await res.json();

    return data[0].map((item) => item[0]).join("");
  } catch (err) {
    console.log("Translation error:", err);
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
