import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PantoneColor } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      hex: {
        type: Type.STRING,
        description: "The hexadecimal color code (e.g., #FF5733)",
      },
      pantoneName: {
        type: Type.STRING,
        description: "The name of the closest Pantone color (e.g., Living Coral)",
      },
      pantoneCode: {
        type: Type.STRING,
        description: "The Pantone code (e.g., 16-1546 TCX)",
      },
      description: {
        type: Type.STRING,
        description: "A very brief, 3-4 word description of the color nuance in Spanish.",
      },
    },
    required: ["hex", "pantoneName", "pantoneCode"],
  },
};

export const analyzeColors = async (base64Image: string): Promise<PantoneColor[]> => {
  try {
    // Remove data URL prefix if present to get raw base64
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming jpeg for simplicity, API handles standard formats well
              data: base64Data,
            },
          },
          {
            text: "Analiza esta imagen y extrae los 6 colores más dominantes y estéticamente agradables. Para cada color, encuentra su coincidencia exacta o más cercana en el sistema Pantone (PMS). Devuelve una matriz JSON estricta.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Lower temperature for more accurate color detection
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as PantoneColor[];
      return data;
    }
    
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};