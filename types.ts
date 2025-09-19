export interface SymptomAnalysis {
  possibleConditions: {
    name: string;
    description: string;
    likelihood: 'High' | 'Medium' | 'Low';
  }[];
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  recommendation: string;
  disclaimer: string;
}

// FIX: Aligned GroundingChunk with the @google/genai library type, where web, uri, and title are optional to resolve type mismatch.
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  }
}

export interface Place {
  name: string;
  address: string;
}

export interface NearbyServiceResult {
  summary: string;
  places: Place[];
  sources: GroundingChunk[];
}

export interface HistoryItem {
  id: string;
  date: string;
  symptoms: string;
  analysis: SymptomAnalysis;
}

export interface Reminder {
  id: string;
  name: string;
  time: string; // HH:MM format
}
