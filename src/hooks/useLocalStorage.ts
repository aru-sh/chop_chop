import { useState, useEffect } from 'react';
import { DayData } from '@/types';

export const useLocalStorage = () => {
  const [data, setData] = useState<DayData>({
    date: new Date().toISOString().split('T')[0],
    priorities: [],
    recurringReminders: []
  });

  const STORAGE_KEY = 'chop-chop-data';

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const parsedData: DayData = JSON.parse(stored);
        if (parsedData.date === today) {
          // Ensure recurringReminders exists for backward compatibility
          const updatedData = {
            ...parsedData,
            recurringReminders: parsedData.recurringReminders || []
          };
          setData(updatedData);
        } else {
          // New day, start fresh but preserve recurring reminders
          setData({
            date: today,
            priorities: [],
            recurringReminders: parsedData.recurringReminders || []
          });
        }
      } catch (error) {
        console.error('Error parsing stored data:', error);
        setData({
          date: today,
          priorities: [],
          recurringReminders: []
        });
      }
    } else {
      setData({
        date: today,
        priorities: [],
        recurringReminders: []
      });
    }
  }, []);

  const saveData = (newData: DayData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chop-chop-${data.date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string) as DayData;
          // Validate the structure and ensure backward compatibility
          if (imported.date && Array.isArray(imported.priorities)) {
            const validatedData = {
              ...imported,
              recurringReminders: imported.recurringReminders || []
            };
            saveData(validatedData);
            resolve();
          } else {
            reject(new Error('Invalid data structure'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return {
    data,
    saveData,
    exportData,
    importData
  };
};