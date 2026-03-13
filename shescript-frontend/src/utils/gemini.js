import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const buildPrompt = (input) => `
You are a helpful medical assistant explaining medicines to women patients.

Given this medicine or prescription text: "${input}"

Return ONLY a valid JSON object. No extra text.

{
  "medicine_name": "name of the medicine",
  "used_for": "what condition this medicine treats in simple words",
  "simple_explanation": "explain what this medicine does",
  "side_effects": ["side effect 1"],
  "safe_dosage": "how to take it",
  "food_interactions": ["what to avoid"],
  "pregnancy_safe": true,
  "pregnancy_note": "pregnancy safety note",
  "hormonal_effects": "does this affect hormones",
  "eli5_explanation": "very simple explanation",
  "warning_flags": ["important warning"]
}
`;

export async function geminiExplain(medicineText) {
  try {
    const prompt = buildPrompt(medicineText);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return { success: true, data: parsed };

  } catch (error) {
    console.error("Gemini text error:", error);

    return {
      success: false,
      error: "Could not explain this medicine"
    };
  }
}

export async function geminiExplainFromImage(imageFile) {
  try {
    const base64 = await convertToBase64(imageFile);
    const mimeType = imageFile.type;

    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: mimeType
      }
    };

    const textPart = buildPrompt(
      "the medicine or prescription shown in this image"
    );

    const result = await model.generateContent([textPart, imagePart]);
    const responseText = result.response.text();

    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return { success: true, data: parsed };

  } catch (error) {
    console.error("Gemini image error:", error);

    return {
      success: false,
      error: "Could not read the image"
    };
  }
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = () => reject(new Error("Failed to read image"));

    reader.readAsDataURL(file);
  });
}