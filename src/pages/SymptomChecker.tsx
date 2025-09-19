
import React, { useState } from 'react';
import { analyzeSymptoms } from '../services/geminiService';
import { addHistoryItem } from '../services/historyService';
import type { SymptomAnalysis } from '../types';

const commonSymptoms = [
  'Fever', 'Cough', 'Headache', 'Sore Throat',
  'Fatigue', 'Nausea', 'Shortness of Breath', 'Muscle Aches',
  'Runny Nose', 'Chills', 'Dizziness', 'Rash'
];

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please enter your symptoms.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeSymptoms(symptoms);
      setAnalysis(result);
      addHistoryItem({ symptoms, analysis: result });
    // FIX: Added curly braces to the catch block to fix syntax error.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSymptomClick = (symptomToAdd: string) => {
    setSymptoms(prev => prev ? `${prev}, ${symptomToAdd}` : symptomToAdd);
  };

  const getSeverityInfo = (severity: SymptomAnalysis['severity']) => {
    switch (severity) {
      case 'Mild': return { color: 'bg-green-500', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
      case 'Moderate': return { color: 'bg-yellow-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
      case 'Severe': return { color: 'bg-orange-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
      case 'Critical': return { color: 'bg-red-600', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
      default: return { color: 'bg-gray-500', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
    }
  };

  return (
    <div className="p-4 space-y-10">
      <header className="text-center animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">Symptom Checker</h1>
        <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
          Describe your symptoms, and our AI will provide a preliminary analysis. This is not a substitute for professional medical advice.
        </p>
      </header>

      <div className="max-w-2xl mx-auto bg-card backdrop-blur-xl border border-border-color p-6 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="block text-sm font-medium text-text-secondary mb-3">
              Select common symptoms or describe them below:
            </p>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => handleSymptomClick(symptom)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-secondary text-text-secondary text-sm rounded-full hover:bg-primary hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        
          <label htmlFor="symptoms" className="block text-sm font-medium text-text-primary mb-2">
            Your Symptoms
          </label>
          <textarea
            id="symptoms"
            rows={5}
            className="w-full p-3 bg-background/50 border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out text-text-primary"
            placeholder="e.g., 'I have a persistent cough that started 2 days ago, a slight fever, and a headache...'"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            disabled={isLoading}
            aria-label="Symptom input area"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300 ease-in-out disabled:bg-gray-500/50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/20 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Analyzing...
              </>
            ) : (
              'Analyze My Symptoms'
            )}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </div>

      {analysis && (
        <div className="max-w-2xl mx-auto mt-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-primary animate-fade-in-up">Analysis Results</h2>
          
          <div className="bg-card backdrop-blur-xl border border-border-color p-6 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getSeverityInfo(analysis.severity).icon} /></svg>
              Severity Assessment
            </h3>
            <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium text-white ${getSeverityInfo(analysis.severity).color}`}>
              {analysis.severity}
            </div>
          </div>

          <div className="bg-card backdrop-blur-xl border border-border-color p-6 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Possible Conditions
            </h3>
            <div className="space-y-4">
              {analysis.possibleConditions.map((condition, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 py-1">
                  <h4 className="font-bold text-lg">{condition.name} <span className="text-sm font-normal text-text-secondary">(Likelihood: {condition.likelihood})</span></h4>
                  <p className="text-text-secondary text-sm">{condition.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card backdrop-blur-xl border border-border-color p-6 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
             <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Recommended Action
            </h3>
            <p className="text-text-secondary">{analysis.recommendation}</p>
          </div>

          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative animate-fade-in-up" role="alert" style={{animationDelay: '0.8s'}}>
            <strong className="font-bold">Disclaimer: </strong>
            <span className="block sm:inline">{analysis.disclaimer} Always consult with a qualified healthcare professional for any medical concerns.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
