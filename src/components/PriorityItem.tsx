import { useState } from 'react';
import { Priority } from '@/types';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface PriorityItemProps {
  priority: Priority;
  onToggleComplete: (id: string) => void;
  onUpdateSubnote: (id: string, subnote: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  dragHandleProps?: any;
}

export const PriorityItem = ({
  priority,
  onToggleComplete,
  onUpdateSubnote,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  dragHandleProps
}: PriorityItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [subnoteText, setSubnoteText] = useState(priority.subnote);

  const handleSubnoteSubmit = () => {
    onUpdateSubnote(priority.id, subnoteText);
    setIsExpanded(false);
  };

  const handleSubnoteKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubnoteSubmit();
    }
    if (e.key === 'Escape') {
      setSubnoteText(priority.subnote);
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 ${
        priority.completed ? 'opacity-75' : ''
      }`}>
      <div className="flex items-center gap-3">
        {dragHandleProps && (
          <button
            {...dragHandleProps}
            className="cursor-move text-gray-400 hover:text-gray-600 p-1"
          >
            <Bars3Icon className="w-4 h-4" />
          </button>
        )}
        
        <input
          type="checkbox"
          checked={priority.completed}
          onChange={() => onToggleComplete(priority.id)}
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        
        <span
          className={`flex-1 cursor-pointer ${
            priority.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {priority.text}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveUp(priority.id)}
            disabled={!canMoveUp}
            className={`p-1 rounded ${
              canMoveUp 
                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                : 'text-gray-200 cursor-not-allowed'
            }`}
          >
            <ChevronUpIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onMoveDown(priority.id)}
            disabled={!canMoveDown}
            className={`p-1 rounded ${
              canMoveDown 
                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                : 'text-gray-200 cursor-not-allowed'
            }`}
          >
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(priority.id)}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
          <textarea
            value={subnoteText}
            onChange={(e) => setSubnoteText(e.target.value)}
            onKeyDown={handleSubnoteKeyPress}
            placeholder="Add a sub-note..."
            className="w-full p-2 text-sm border border-gray-200 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubnoteSubmit}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setSubnoteText(priority.subnote);
                setIsExpanded(false);
              }}
              className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {priority.subnote && !isExpanded && (
        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
          {priority.subnote}
        </div>
      )}
    </motion.div>
  );
};