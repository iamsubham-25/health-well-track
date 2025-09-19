
import React, { useState } from 'react';
import { findNearbyServices } from '../services/geminiService';
import type { NearbyServiceResult } from '../types';

const NearbyServices: React.FC = () => {
  const [serviceType, setServiceType] = useState('pharmacy');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<NearbyServiceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await findNearbyServices(serviceType, location);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-10">
      <header className="text-center animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">Find Nearby Services</h1>
        <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
          Search for doctors, clinics, pharmacies, and hospitals in your area.
        </p>
      </header>

      <div className="max-w-2xl mx-auto bg-card backdrop-blur-xl border border-border-color p-6 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-text-primary mb-2">
              Type of Service
            </label>
            <select
              id="serviceType"
              className="w-full p-3 bg-background/50 border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              disabled={isLoading}
            >
              <option value="pharmacy">Pharmacy</option>
              <option value="doctor">Doctor</option>
              <option value="clinic">Clinic</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
              Your Location (e.g., "New York, NY" or Zip Code)
            </label>
            <input
              id="location"
              type="text"
              className="w-full p-3 bg-background/50 border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition text-text-primary"
              placeholder="Enter your city, state, or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300 ease-in-out disabled:bg-gray-500/50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/20 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </div>

      {results && (
        <div className="max-w-4xl mx-auto mt-8 space-y-8">
          <h2 className="text-3xl font-bold text-center text-primary animate-fade-in-up">Search Results</h2>
          
          <div className="bg-card backdrop-blur-xl border border-border-color p-6 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                Summary
            </h3>
            <p className="text-text-secondary whitespace-pre-wrap">{results.summary}</p>
          </div>

          {results.places && results.places.length > 0 && (
             <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="font-semibold text-2xl mb-4 flex items-center gap-2 text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Locations Found
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.places.map((place, index) => (
                  <div key={index} className="bg-card backdrop-blur-xl border border-border-color p-6 rounded-xl shadow-2xl shadow-black/20 flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
                    <div>
                      <h4 className="font-bold text-lg text-primary">{place.name}</h4>
                      <p className="text-text-secondary text-sm mt-1">{place.address}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full bg-primary/80 text-white text-center font-semibold py-2 px-4 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-2"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3v10m6-10v10" /></svg>
                      View on Map
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {results.sources && results.sources.length > 0 && (
            <div className="bg-card backdrop-blur-xl border border-border-color p-6 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Web Sources
              </h3>
              <ul className="space-y-2">
                {results.sources.map((source, index) => (
                  <li key={index} className="text-text-secondary truncate">
                    {source.web?.uri ? (
                      <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        <span className="truncate">{source.web.title || source.web.uri}</span>
                      </a>
                    ) : (
                      <span>Source link not available</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyServices;
