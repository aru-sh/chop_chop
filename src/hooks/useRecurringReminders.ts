import { useLocalStorage } from './useLocalStorage';
import { RecurringReminder } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useRecurringReminders = () => {
  const { data, saveData, exportData, importData } = useLocalStorage();

  const calculateNextReminder = (intervalType: 'minutes' | 'hours' | 'days', intervalValue: number): string => {
    const now = new Date();
    const next = new Date(now);

    switch (intervalType) {
      case 'minutes':
        next.setMinutes(next.getMinutes() + intervalValue);
        break;
      case 'hours':
        next.setHours(next.getHours() + intervalValue);
        break;
      case 'days':
        next.setDate(next.getDate() + intervalValue);
        break;
    }

    return next.toISOString();
  };

  const addRecurringReminder = (
    title: string,
    intervalType: 'minutes' | 'hours' | 'days',
    intervalValue: number,
    notes?: string,
    soundEnabled: boolean = true,
    soundVolume: number = 0.7
  ) => {
    const newReminder: RecurringReminder = {
      id: uuidv4(),
      title: title.trim(),
      notes: notes?.trim() || undefined,
      intervalType,
      intervalValue,
      isActive: true,
      createdAt: new Date().toISOString(),
      nextReminderAt: calculateNextReminder(intervalType, intervalValue),
      soundEnabled,
      soundVolume
    };

    const updatedData = {
      ...data,
      recurringReminders: [...data.recurringReminders, newReminder]
    };

    saveData(updatedData);
    return newReminder;
  };

  const updateRecurringReminder = (id: string, updates: Partial<RecurringReminder>) => {
    const updatedData = {
      ...data,
      recurringReminders: data.recurringReminders.map(reminder =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    };

    saveData(updatedData);
  };

  const deleteRecurringReminder = (id: string) => {
    const updatedData = {
      ...data,
      recurringReminders: data.recurringReminders.filter(reminder => reminder.id !== id)
    };

    saveData(updatedData);
  };

  const toggleReminderActive = (id: string) => {
    const reminder = data.recurringReminders.find(r => r.id === id);
    if (reminder) {
      const updates: Partial<RecurringReminder> = {
        isActive: !reminder.isActive
      };
      
      // If activating, calculate new next reminder time
      if (!reminder.isActive) {
        updates.nextReminderAt = calculateNextReminder(reminder.intervalType, reminder.intervalValue);
      }

      updateRecurringReminder(id, updates);
    }
  };

  const triggerReminder = (id: string) => {
    const reminder = data.recurringReminders.find(r => r.id === id);
    if (reminder && reminder.isActive) {
      // Update last reminder time and calculate next
      const updates: Partial<RecurringReminder> = {
        lastReminderAt: new Date().toISOString(),
        nextReminderAt: calculateNextReminder(reminder.intervalType, reminder.intervalValue)
      };

      updateRecurringReminder(id, updates);
      return reminder;
    }
    return null;
  };

  const getActiveReminders = () => {
    return data.recurringReminders.filter(reminder => reminder.isActive);
  };

  const getOverdueReminders = () => {
    const now = new Date();
    return data.recurringReminders.filter(reminder => 
      reminder.isActive && new Date(reminder.nextReminderAt) <= now
    );
  };

  return {
    recurringReminders: data.recurringReminders,
    addRecurringReminder,
    updateRecurringReminder,
    deleteRecurringReminder,
    toggleReminderActive,
    triggerReminder,
    getActiveReminders,
    getOverdueReminders,
    exportData,
    importData
  };
};