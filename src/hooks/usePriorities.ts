import { useLocalStorage } from './useLocalStorage';
import { Priority } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const usePriorities = () => {
  const { data, saveData, exportData, importData } = useLocalStorage();

  const addPriority = (text: string) => {
    const newPriority: Priority = {
      id: uuidv4(),
      text: text.trim(),
      order: data.priorities.length,
      completed: false,
      subnote: '',
      createdAt: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      priorities: [...data.priorities, newPriority]
    };

    saveData(updatedData);
  };

  const updatePriority = (id: string, updates: Partial<Priority>) => {
    const updatedData = {
      ...data,
      priorities: data.priorities.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    };

    saveData(updatedData);
  };

  const deletePriority = (id: string) => {
    const updatedData = {
      ...data,
      priorities: data.priorities
        .filter(p => p.id !== id)
        .map((p, index) => ({ ...p, order: index }))
    };

    saveData(updatedData);
  };

  const reorderPriorities = (startIndex: number, endIndex: number) => {
    const result = Array.from(data.priorities);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const reorderedPriorities = result.map((p, index) => ({
      ...p,
      order: index
    }));

    const updatedData = {
      ...data,
      priorities: reorderedPriorities
    };

    saveData(updatedData);
  };

  const toggleComplete = (id: string) => {
    const priority = data.priorities.find(p => p.id === id);
    if (priority) {
      updatePriority(id, {
        completed: !priority.completed,
        completedAt: priority.completed ? undefined : new Date().toISOString()
      });
    }
  };

  const updateSubnote = (id: string, subnote: string) => {
    updatePriority(id, { subnote: subnote.trim() });
  };

  return {
    priorities: data.priorities,
    addPriority,
    updatePriority,
    deletePriority,
    reorderPriorities,
    toggleComplete,
    updateSubnote,
    exportData,
    importData
  };
};