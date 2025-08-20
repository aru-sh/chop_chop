import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddRecurringReminderProps {
  onAdd: (title: string, intervalType: 'minutes' | 'hours' | 'days', intervalValue: number, notes?: string) => void;
}

export const AddRecurringReminder = ({ onAdd }: AddRecurringReminderProps) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [intervalType, setIntervalType] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [intervalValue, setIntervalValue] = useState(1);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), intervalType, intervalValue, notes.trim() || undefined);
      setTitle('');
      setNotes('');
      setIntervalValue(1);
      setIntervalType('hours');
      setIsFormVisible(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setNotes('');
    setIntervalValue(1);
    setIntervalType('hours');
    setIsFormVisible(false);
  };

  const getIntervalLimits = (type: 'minutes' | 'hours' | 'days') => {
    switch (type) {
      case 'minutes': return { min: 1, max: 59 };
      case 'hours': return { min: 1, max: 23 };
      case 'days': return { min: 1, max: 30 };
    }
  };

  const limits = getIntervalLimits(intervalType);

  if (!isFormVisible) {
    return (
      <button
        onClick={() => setIsFormVisible(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        Add Recurring Reminder
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      {/* Title Input */}
      <div>
        <label htmlFor="reminder-title" className="block text-sm font-medium text-gray-700 mb-1">
          Reminder Title
        </label>
        <input
          id="reminder-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="e.g., Drink water, Take a break..."
          className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
          required
        />
      </div>

      {/* Interval Configuration */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="interval-value" className="block text-sm font-medium text-gray-700 mb-1">
            Every
          </label>
          <input
            id="interval-value"
            type="number"
            value={intervalValue}
            onChange={(e) => setIntervalValue(Math.max(limits.min, Math.min(limits.max, parseInt(e.target.value) || limits.min)))}
            min={limits.min}
            max={limits.max}
            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="interval-type" className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <select
            id="interval-type"
            value={intervalType}
            onChange={(e) => {
              const newType = e.target.value as 'minutes' | 'hours' | 'days';
              setIntervalType(newType);
              const newLimits = getIntervalLimits(newType);
              setIntervalValue(Math.max(newLimits.min, Math.min(newLimits.max, intervalValue)));
            }}
            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
        <strong>Preview:</strong> Remind me &ldquo;{title || 'untitled'}&rdquo; every {intervalValue} {intervalType}
      </div>

      {/* Notes Input */}
      <div>
        <label htmlFor="reminder-notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="reminder-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Additional details... (supports **markdown**)"
          className="w-full p-2 text-sm border border-gray-200 rounded resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[60px]"
          rows={2}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Create Reminder
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};