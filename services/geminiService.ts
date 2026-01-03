import { GoogleGenAI, Type } from "@google/genai";
import type { BreedInfo } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const breedInfoSchema = {
  type: Type.OBJECT,
  properties: {
    breedName: {
      type: Type.STRING,
      description: "Identified breed name.",
    },
    description: {
      type: Type.STRING,
      description: "Detailed description.",
    },
    origin: {
      type: Type.STRING,
      description: "Region of origin in India.",
    },
    characteristics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 key characteristics.",
    },
    temperament: { type: Type.STRING },
    milkYield: { type: Type.STRING },
    draughtCapacity: { type: Type.STRING },
    lifespan: { type: Type.STRING },
    dietaryNeeds: { type: Type.STRING },
    commonDiseases: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    confidenceScore: { type: Type.NUMBER },
    confidenceReasoning: { type: Type.STRING }
  },
  required: [
    "breedName", "description", "origin", "characteristics", 
    "temperament", "milkYield", "draughtCapacity", "lifespan",
    "dietaryNeeds", "commonDiseases", "confidenceScore", "confidenceReasoning"
  ],
};

export const getBreedInfo = async (base64Image: string, mimeType: string): Promise<BreedInfo> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType,
    },
  };
  
  const prompt = `You are an expert in Indian livestock. Analyze the image and identify the cattle or buffalo breed. Provide JSON details including name, origin, characteristics, temperament, yield, draught capacity, lifespan, diet, and common diseases. Include a confidence score.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
          parts: [
              imagePart, 
              { text: prompt }
          ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: breedInfoSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI.");

    const parsedResult = JSON.parse(jsonText.trim()) as BreedInfo;
    
    if (!parsedResult.imageUrl) {
        parsedResult.imageUrl = `https://ui-avatars.com/api/?name=${parsedResult.breedName.charAt(0)}&background=random&size=256`;
    }

    return parsedResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze breed. Please ensure the image is clear.");
  }
};