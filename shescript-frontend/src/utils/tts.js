// src/utils/tts.js

const API_KEY = import.meta.env.VITE_SARVAM_API_KEY;

export async function speakWithSarvam(text, lang = "en-IN") {
  console.log("Sarvam speaking:", { text, lang });

  const response = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": API_KEY,
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: lang,
      speaker: "anushka",       // ← valid speaker name
      model: "bulbul:v2",       // ← valid model
      enable_preprocessing: true,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Sarvam full error:", err);
    throw new Error(JSON.stringify(err));
  }

  const data = await response.json();
  const audioBlob = base64ToBlob(data.audios[0], "audio/wav");
  return URL.createObjectURL(audioBlob);
}

function base64ToBlob(base64, mimeType) {
  const bytes = atob(base64);
  const buffer = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    buffer[i] = bytes.charCodeAt(i);
  }
  return new Blob([buffer], { type: mimeType });
}