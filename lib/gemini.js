import * as FileSystem from "expo-file-system/legacy";

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

export async function imageToBase64(uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });

  return base64;
}

export async function analyzeImage(base64Image, prompt) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      generationConfig: {
        responseMimeType: "application/json",
      },
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini request failed (${response.status}): ${errorText.slice(0, 200)}`,
    );
  }

  const json = await response.json();
  return json;
}

export const ANALYSIS_PROMPT = `
Analyze this image. Identify:
1. Objects - list the distinct physical objects you see
2. Context - briefly describe the setting or scene
3. Activities - what activity appears to be happening, if any
4. Recommendations - one practical suggestion based on the scene
Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`;

const ANALYSIS_PROMPTS = {
  academic: `
Analyze this image in an academic context. Identify:
1. Objects - list the distinct physical objects you see
2. Context - briefly describe the learning or study setting
3. Activities - what academic activity appears to be happening, if any
4. Recommendations - one practical suggestion to support studying or learning
Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`,
  safety: `
Analyze this image for safety. Identify:
1. Objects - list the distinct physical objects you see
2. Context - briefly describe the scene
3. Activities - what activity appears to be happening, if any
4. Recommendations - one practical safety suggestion based on the scene
Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`,
  inventory: `
Analyze this image for inventory tracking. Identify:
1. Objects - list the distinct physical objects you see
2. Context - briefly describe the setting or scene
3. Activities - what activity appears to be happening, if any
4. Recommendations - one practical inventory or organization suggestion based on the scene
Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`,
};

export function getAnalysisPrompt(mode = "academic") {
  return ANALYSIS_PROMPTS[mode] || ANALYSIS_PROMPTS.academic;
}
