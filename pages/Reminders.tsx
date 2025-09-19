import React, { useState, useEffect } from 'react';
import { getReminders, addReminder, deleteReminder } from '../services/reminderService';
import type { Reminder } from '../types';

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReminders(getReminders());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !time) {
      setError('Please provide both a name and a time for the reminder.');
      return;
    }
    const updatedReminders = addReminder({ name, time });
    setReminders(updatedReminders);
    setName('');
    setTime('');
    setError(null);
  };

  const handleDelete = (id: string) => {
    const updatedReminders = deleteReminder(id);
    setReminders(updatedReminders);
  };

  return (
    <div className="p-4 space-y-10">
      <header className="text-center animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">Health Reminders</h1>
        <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
          Set daily reminders for your medications and supplements.
        </p>
      </header>

      <div className="max-w-2xl mx-auto bg-card backdrop-blur-xl border border-border-color p-6 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <h2 className="text-2xl font-semibold text-text-primary mb-6">Add New Reminder</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reminder-name" className="block text-sm font-medium text-text-primary mb-2">
              Medication Name
            </label>
            <input
              id="reminder-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Vitamin C"
              className="w-full p-3 bg-background/50 border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition text-text-primary"
            />
          </div>
          <div>
            <label htmlFor="reminder-time" className="block text-sm font-medium text-text-primary mb-2">
              Time
            </label>
            <input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 bg-background/50 border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition text-text-primary"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300 ease-in-out shadow-lg shadow-primary/20 transform hover:scale-105"
          >
            Add Reminder
          </button>
        </form>
      </div>

      <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Your Reminders</h2>
        {reminders.length === 0 ? (
          <div className="text-center bg-card backdrop-blur-xl border border-border-color p-10 rounded-2xl shadow-2xl shadow-black/20">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="mt-2 text-text-secondary">You have no reminders set.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.sort((a, b) => a.time.localeCompare(b.time)).map((reminder) => (
              <div key={reminder.id} className="bg-card backdrop-blur-xl border border-border-color p-4 rounded-xl shadow-2xl shadow-black/20 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-text-primary">{reminder.name}</p>
                  <p className="text-2xl font-bold text-primary">{reminder.time}</p>
                </div>
                <button 
                  onClick={() => handleDelete(reminder.id)}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  aria-label={`Delete reminder for ${reminder.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;