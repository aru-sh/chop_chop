import { useState } from 'react';
import { RecurringReminder } from '@/types';
import { 
  PlayIcon, 
  PauseIcon, 
  TrashIcon, 
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon 
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RecurringReminderItemProps {
  reminder: RecurringReminder;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<RecurringReminder>) => void;
}

export const RecurringReminderItem = ({
  reminder,
  onToggleActive,
  onDelete,
  onUpdate
}: RecurringReminderItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(reminder.title);
  const [editNotes, setEditNotes] = useState(reminder.notes || '');
  const [editInterval, setEditInterval] = useState(reminder.intervalValue);
  const [editIntervalType, setEditIntervalType] = useState(reminder.intervalType);

  const formatNextReminder = (nextReminderAt: string) => {
    const next = new Date(nextReminderAt);
    const now = new Date();
    const diffMs = next.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Due now!';
    }

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `in ${diffDays}d ${diffHours % 24}h`;
    } else if (diffHours > 0) {
      return `in ${diffHours}h ${diffMins % 60}m`;
    } else {
      return `in ${diffMins}m`;
    }
  };

  const formatInterval = () => {
    return `${reminder.intervalValue} ${reminder.intervalType}`;
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(reminder.id, {
        title: editTitle.trim(),
        notes: editNotes.trim() || undefined,
        intervalValue: editInterval,
        intervalType: editIntervalType
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(reminder.title);
    setEditNotes(reminder.notes || '');
    setEditInterval(reminder.intervalValue);
    setEditIntervalType(reminder.intervalType);
    setIsEditing(false);
  };

  const getIntervalLimits = (type: 'minutes' | 'hours' | 'days') => {
    switch (type) {
      case 'minutes': return { min: 1, max: 59 };
      case 'hours': return { min: 1, max: 23 };
      case 'days': return { min: 1, max: 30 };
    }
  };

  const limits = getIntervalLimits(editIntervalType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-white rounded-lg shadow-sm border p-4 transition-all duration-200 ${
        reminder.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 opacity-75'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Active/Inactive Indicator */}
          <div className={`w-3 h-3 rounded-full ${
            reminder.isActive ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
            ) : (
              <h3 className={`font-medium truncate ${
                reminder.isActive ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {reminder.title}
              </h3>
            )}
            
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <ClockIcon className="w-3 h-3" />
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <span>Every</span>
                  <input
                    type="number"
                    value={editInterval}
                    onChange={(e) => setEditInterval(Math.max(limits.min, Math.min(limits.max, parseInt(e.target.value) || limits.min)))}
                    min={limits.min}
                    max={limits.max}
                    className="w-12 p-0.5 text-xs border border-gray-200 rounded"
                  />
                  <select
                    value={editIntervalType}
                    onChange={(e) => {
                      const newType = e.target.value as 'minutes' | 'hours' | 'days';
                      setEditIntervalType(newType);
                      const newLimits = getIntervalLimits(newType);
                      setEditInterval(Math.max(newLimits.min, Math.min(newLimits.max, editInterval)));
                    }}
                    className="text-xs border border-gray-200 rounded p-0.5"
                  >
                    <option value="minutes">min</option>
                    <option value="hours">hrs</option>
                    <option value="days">days</option>
                  </select>
                </div>
              ) : (
                <>
                  <span>Every {formatInterval()}</span>
                  {reminder.isActive && (
                    <>
                      <span>•</span>
                      <span className="font-medium">
                        {formatNextReminder(reminder.nextReminderAt)}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
              >
                <ClockIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onToggleActive(reminder.id)}
                className={`p-1 rounded transition-colors ${
                  reminder.isActive
                    ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-100'
                    : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                }`}
              >
                {reminder.isActive ? (
                  <PauseIcon className="w-4 h-4" />
                ) : (
                  <PlayIcon className="w-4 h-4" />
                )}
              </button>

              {(reminder.notes || isExpanded) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>
              )}

              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded"
              >
                <ClockIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(reminder.id)}
                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded Notes Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
            {isEditing ? (
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes... (supports **markdown**)"
                className="w-full p-2 text-sm border border-gray-200 rounded resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[60px]"
                rows={2}
              />
            ) : reminder.notes ? (
              <div className="prose prose-sm max-w-none prose-headings:text-gray-700 prose-p:text-gray-600 prose-strong:text-gray-700 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-blockquote:border-l-blue-500 prose-ul:text-gray-600 prose-ol:text-gray-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {reminder.notes}
                </ReactMarkdown>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-gray-400 hover:text-gray-600 italic"
              >
                Click to add notes...
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};