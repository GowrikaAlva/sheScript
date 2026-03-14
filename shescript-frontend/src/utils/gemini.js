import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const buildPrompt = (input) => `
You are a medical assistant explaining prescriptions clearly.

Given this medicine or prescription text: "${input}"

Return ONLY valid JSON.

Rules:
- Dosage MUST be realistic like: "1 tablet twice daily after food for 5 days"
- Avoid generic phrases like "take as prescribed by doctor"
- Use simple language.

JSON format:

{
  "medicine_name": "medicine name",
  "used_for": "what condition this medicine treats",
  "simple_explanation": "what the medicine does in the body",
  "side_effects": ["side effect 1", "side effect 2"],
  "safe_dosage": "example: 1 tablet three times daily after food for 5 days",
  "food_interactions": ["foods or drinks to avoid"],
  "pregnancy_safe": true,
  "pregnancy_note": "pregnancy safety explanation",
  "hormonal_effects": "any hormone related effects",
  "eli5_explanation": "very simple explanation for elderly",
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
      error: "Could not explain this medicine",
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
        mimeType: mimeType,
      },
    };

    const textPart = buildPrompt(
      "the medicine or prescription shown in this image",
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
      error: "Could not read the image",
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
