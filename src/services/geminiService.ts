
import { GoogleGenAI, Type } from "@google/genai";
import type { SymptomAnalysis, NearbyServiceResult, HistoryItem } from '../types';

const apiKey = process.env.REACT_APP_API_KEY;

if (!apiKey) {
  throw new Error("REACT_APP_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

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
    
    const text = response.text;
    if (!text) {
      throw new Error("AI response did not contain any text.");
    }
    const jsonString = text.trim();
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
      contents: `Find ${serviceType} near ${location}. Respond with a JSON object containing two keys: "summary" (a brief text summary of the findings) and "places" (an array of up to 5 found locations, where each location is an object with "name" and "address" properties). Do not include any markdown formatting like \`\`\`json.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text;

    if (!text) {
      return {
        summary: "The AI did not return a valid response.",
        places: [],
        sources
      };
    }

    try {
      // The response text might have markdown or be just the JSON string.
      const cleanedText = text.replace(/^```json\s*|```\s*$/g, '').trim();
      const data = JSON.parse(cleanedText);
      
      if (!data.summary || !Array.isArray(data.places)) {
        throw new Error("Invalid JSON structure from AI. Missing 'summary' or 'places' array.");
      }

      return { 
        summary: data.summary,
        places: data.places,
        sources 
      };
    } catch (jsonError) {
      console.error("Failed to parse JSON from AI response:", jsonError);
      console.error("Raw AI response text:", text);
      // Fallback: return the raw text as summary if JSON parsing fails, so user still sees something.
      return {
        summary: `The AI returned the following information, but it could not be formatted correctly:\n\n${text}`,
        places: [],
        sources
      };
    }
    
  } catch (error) {
    console.error("Error finding nearby services:", error);
    throw new Error("Failed to find nearby services. Please try again.");
  }
};

export const generateHealthInsights = async (history: HistoryItem[]): Promise<string> => {
  if (history.length === 0) {
    return "No history available to analyze.";
  }

  const formattedHistory = history.map(item => 
    `- Date: ${item.date}, Symptoms: "${item.symptoms}", Analysis: Possible ${item.analysis.possibleConditions.map(c => c.name).join(', ')} (Severity: ${item.analysis.severity})`
  ).join('\n');

  const prompt = `Analyze the following health history log. Your goal is to identify recurring patterns, potential triggers, or general lifestyle suggestions based ONLY on the data provided. Summarize your findings as a few simple, actionable bullet points. Start each bullet point with a '*' character. Do not give medical advice or diagnoses. Keep the tone helpful and suggestive.

Health History:
${formattedHistory}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful wellness assistant analyzing a user's health log. Your role is to spot patterns and provide general wellness tips. You are not a doctor and must not provide medical advice. Focus on suggestions related to lifestyle, environment, or symptom tracking based on the patterns you observe.",
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI response did not contain any text.");
    }
    return text.trim();

  } catch (error) {
    console.error("Error generating health insights:", error);
    throw new Error("Failed to generate health insights. Please try again.");
  }
};
