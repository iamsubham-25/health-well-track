import React, { useState, useEffect, useMemo } from 'react';
import { getHistory, clearHistory } from '../services/historyService';
import type { HistoryItem, SymptomAnalysis } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setShowConfirm(false);
  };

  const getSeverityBadgeColor = (severity: SymptomAnalysis['severity']) => {
    switch (severity) {
      case 'Mild': return 'bg-green-500 text-white';
      case 'Moderate': return 'bg-yellow-500 text-white';
      case 'Severe': return 'bg-orange-500 text-white';
      case 'Critical': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const symptomFrequencyData = useMemo(() => {
    if (!history || history.length === 0) {
        return [];
    }

    const frequencyMap = new Map<string, number>();

    history.forEach(item => {
        item.analysis.possibleConditions.forEach(condition => {
            const count = frequencyMap.get(condition.name) || 0;
            frequencyMap.set(condition.name, count + 1);
        });
    });

    return Array.from(frequencyMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
  }, [history]);


  return (
    <div className="p-4 space-y-10">
      <header className="text-center animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
          Review your past symptom analysis history.
        </p>
      </header>

      <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-end mb-4">
          {history.length > 0 && !showConfirm && (
             <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-600/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Clear History
            </button>
          )}
        </div>

        {showConfirm && (
            <div className="bg-card/80 backdrop-blur-lg border border-border-color p-6 rounded-2xl shadow-lg mb-6 text-center">
                <p className="text-text-primary mb-4">Are you sure you want to delete your entire history? This action cannot be undone.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setShowConfirm(false)} className="bg-secondary text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleClearHistory} className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
                        Yes, Clear History
                    </button>
                </div>
            </div>
        )}

        {history.length === 0 ? (
          <div className="text-center bg-card/80 backdrop-blur-lg border border-border-color p-10 rounded-2xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-text-primary">No History Found</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Your symptom analysis reports will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-card/80 backdrop-blur-lg border border-border-color p-4 sm:p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-primary mb-4">Symptom Frequency</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={symptomFrequencyData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.6)" />
                  <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: 'rgba(55, 65, 81, 0.6)',
                      color: '#F9FAFB',
                    }}
                    cursor={{ fill: 'rgba(236, 72, 153, 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#F472B6" name="Times Reported" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Detailed History</h2>
              <div className="space-y-6">
                {history.map((item) => (
                  <div key={item.id} className="bg-card/80 backdrop-blur-lg border border-border-color p-6 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm text-text-secondary font-medium">{item.date}</p>
                       <span className={`px-3 py-1 text-xs font-bold rounded-full ${getSeverityBadgeColor(item.analysis.severity)}`}>
                        {item.analysis.severity}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-primary mb-2">Symptoms Reported:</h3>
                      <p className="text-text-secondary bg-background/50 p-3 rounded-md italic">"{item.symptoms}"</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold text-md text-primary mb-2">Possible Conditions:</h4>
                      <ul className="list-disc list-inside space-y-1 text-text-secondary">
                        {item.analysis.possibleConditions.map((cond, index) => (
                          <li key={index}>{cond.name} <span className="text-xs">({cond.likelihood})</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                       <h4 className="font-semibold text-md text-primary mb-2">Recommendation:</h4>
                       <p className="text-text-secondary">{item.analysis.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;