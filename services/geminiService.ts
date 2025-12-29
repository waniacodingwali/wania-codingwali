
import { GoogleGenAI, Type } from "@google/genai";
import { Subtitle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
  });
}

export async function generateSubtitles(videoFile: File, targetLanguage: string): Promise<Subtitle[]> {
  const base64Data = await fileToBase64(videoFile);

  const prompt = `Transcribe and translate the audio from this video into ${targetLanguage} subtitles. 
  Isolate speech from background noise. Return a JSON array of objects.
  Requirements: 
  - Each object has 'startTime' (float seconds), 'endTime' (float seconds), and 'text' (translated subtitle in ${targetLanguage}).
  - Synchronize timing perfectly with spoken words.
  - If multiple speakers exist, maintain a conversational flow.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          { inlineData: { data: base64Data, mimeType: "video/mp4" } },
          { text: prompt }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              startTime: { type: Type.NUMBER },
              endTime: { type: Type.NUMBER },
              text: { type: Type.STRING },
            },
            required: ["startTime", "endTime", "text"]
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    return result.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    }));
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("AI processing failed. Check your video file or connection.");
  }
}
