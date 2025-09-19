
import type { Reminder } from '../types';

const REMINDER_KEY = 'healthReminders';

export const getReminders = (): Reminder[] => {
  try {
    const remindersJson = localStorage.getItem(REMINDER_KEY);
    return remindersJson ? JSON.parse(remindersJson) : [];
  } catch (error) {
    console.error("Failed to parse reminders from localStorage", error);
    return [];
  }
};

export const addReminder = (reminder: Omit<Reminder, 'id'>): Reminder[] => {
  const reminders = getReminders();
  const newReminder: Reminder = {
    ...reminder,
    id: new Date().toISOString() + Math.random(), // more unique id
  };
  const updatedReminders = [...reminders, newReminder];
  localStorage.setItem(REMINDER_KEY, JSON.stringify(updatedReminders));
  return updatedReminders;
};

export const deleteReminder = (id: string): Reminder[] => {
  const reminders = getReminders();
  const updatedReminders = reminders.filter(r => r.id !== id);
  localStorage.setItem(REMINDER_KEY, JSON.stringify(updatedReminders));
  return updatedReminders;
};
