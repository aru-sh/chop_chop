import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ClockIcon, 
  ListBulletIcon 
} from '@heroicons/react/24/outline';

interface SidePanelProps {
  activeRemindersCount: number;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onToggle?: (isOpen: boolean) => void;
}

export type ViewType = 'priorities' | 'reminders';

export const SidePanel = ({ activeRemindersCount, currentView, onViewChange, onToggle }: SidePanelProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div className="flex h-screen">
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200 border border-gray-200"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-40 border-r border-gray-200"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Chop Chop</h2>
              
              {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => onViewChange('priorities')}
                  className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    currentView === 'priorities'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ListBulletIcon className="w-4 h-4 mr-2" />
                  Daily Tasks
                </button>
                <button
                  onClick={() => onViewChange('reminders')}
                  className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative ${
                    currentView === 'reminders'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Reminders
                  {activeRemindersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                      {activeRemindersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Optional additional side panel content can go here */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-30"
            onClick={() => {
              setIsOpen(false);
              onToggle?.(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};