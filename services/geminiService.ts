
import { GoogleGenAI, Type } from "@google/genai";
import type { SymptomAnalysis, NearbyServiceResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const symptomAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    possibleConditions: {
      type: Type.ARRAY,
      description: "A list of possible medical conditions based on the symptoms.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the condition." },
          description: { type: Type.STRING, description: "Brief description of the condition." },
          likelihood: { type: Type.STRING, description: "Likelihood of this condition (High, Medium, or Low)." }
        },
        required: ["name", "description", "likelihood"]
      }
    },
    severity: {
      type: Type.STRING,
      description: "Assessed severity of the symptoms (Mild, Moderate, Severe, or Critical)."
    },
    recommendation: {
      type: Type.STRING,
      description: "Recommended next steps, e.g., 'Rest and monitor', 'Consult a doctor within 24 hours', 'Seek immediate medical attention'."
    },
    disclaimer: {
        type: Type.STRING,
        description: "A standard disclaimer that this is not medical advice."
    }
  },
  required: ["possibleConditions", "severity", "recommendation", "disclaimer"]
};

export const analyzeSymptoms = async (symptoms: string): Promise<SymptomAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following symptoms and provide a potential analysis: "${symptoms}"`,
      config: {
        systemInstruction: "You are a helpful AI medical assistant. Your role is to analyze user-provided symptoms and suggest possible conditions, assess severity, and recommend next steps. You must always include a clear disclaimer that you are not a medical professional and the user should consult a real doctor. Do not provide diagnosis. Use the provided JSON schema for your response.",
        responseMimeType: "application/json",
        responseSchema: symptomAnalysisSchema,
      }
    });
    
    const jsonString = response.text.trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw new Error("Failed to get analysis from AI. Please try again.");
  }
};

export const findNearbyServices = async (serviceType: string, location: string): Promise<NearbyServiceResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find ${serviceType} near ${location}. Provide a brief summary and list of places.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const summary = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { summary, sources };
    
  } catch (error) {
    console.error("Error finding nearby services:", error);
    throw new Error("Failed to find nearby services. Please try again.");
  }
};
