
import type { HistoryItem } from '../types';

const HISTORY_KEY = 'smartHealthHistory';

export const getHistory = (): HistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'date'>): HistoryItem[] => {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: new Date().toISOString(),
    date: new Date().toLocaleString(),
  };
  const updatedHistory = [newItem, ...history].slice(0, 20); // Keep last 20 entries
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};
