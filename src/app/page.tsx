'use client';

import { useState } from 'react';
import { usePriorities } from '@/hooks/usePriorities';
import { useRecurringReminders } from '@/hooks/useRecurringReminders';
import { useReminderTimer } from '@/hooks/useReminderTimer';
import { PriorityItem } from '@/components/PriorityItem';
import { SortablePriorityItem } from '@/components/SortablePriorityItem';
import { AddPriority } from '@/components/AddPriority';
import { ImportExport } from '@/components/ImportExport';
import { Toast } from '@/components/Toast';
import { RecurringRemindersView } from '@/components/RecurringRemindersView';
import { AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';

export default function Home() {
  // Initialize reminder timer
  useReminderTimer();
  
  const { getActiveReminders } = useRecurringReminders();
  const activeRemindersCount = getActiveReminders().length;

  const [currentView, setCurrentView] = useState('priorities');
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    priorities,
    addPriority,
    deletePriority,
    reorderPriorities,
    toggleComplete,
    updateSubnote,
    exportData,
    importData
  } = usePriorities();

  const incompletePriorities = priorities.filter(p => !p.completed);
  const completedPriorities = priorities.filter(p => p.completed);

  const handleToggleComplete = (id: string) => {
    const priority = priorities.find(p => p.id === id);
    if (priority && !priority.completed) {
      setToast({
        show: true,
        message: `Great job completing "${priority.text}"! 🎉`,
        type: 'success'
      });
    }
    toggleComplete(id);
  };

  const handleMoveUp = (id: string) => {
    const currentIndex = priorities.findIndex(p => p.id === id);
    if (currentIndex > 0) {
      reorderPriorities(currentIndex, currentIndex - 1);
    }
  };

  const handleMoveDown = (id: string) => {
    const currentIndex = priorities.findIndex(p => p.id === id);
    if (currentIndex < priorities.length - 1) {
      reorderPriorities(currentIndex, currentIndex + 1);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const fullOldIndex = priorities.findIndex(p => p.id === active.id);
      const fullNewIndex = priorities.findIndex(p => p.id === over.id);
      
      reorderPriorities(fullOldIndex, fullNewIndex);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Side Panel */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Chop Chop</h2>
          
          {/* Navigation */}
          <div className="space-y-2">
            <button 
              onClick={() => setCurrentView('priorities')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${currentView === 'priorities' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              📋 Daily Tasks ({priorities.length})
            </button>
            <button 
              onClick={() => setCurrentView('reminders')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${currentView === 'reminders' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              ⏰ Reminders {activeRemindersCount > 0 && `(${activeRemindersCount})`}
            </button>
          </div>
        </div>


      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chop Chop</h1>
            <p className="text-gray-600">{today}</p>
          </div>

          {currentView === 'priorities' && (
            <div className="space-y-4">
              <div className="mb-6 flex justify-end">
                <ImportExport 
                  onExport={() => {
                    exportData();
                    showToast('Data exported successfully! 📁');
                  }} 
                  onImport={async (file) => {
                    try {
                      await importData(file);
                      showToast('Data imported successfully! ✨');
                    } catch (error) {
                      showToast('Failed to import data. Please check the file format.', 'error');
                      throw error;
                    }
                  }} 
                />
              </div>
              
              <AddPriority onAdd={addPriority} />
            
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              >
                <SortableContext
                  items={incompletePriorities.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence>
                    {incompletePriorities.map((priority, index) => (
                      <SortablePriorityItem
                        key={priority.id}
                        priority={priority}
                        onToggleComplete={handleToggleComplete}
                        onUpdateSubnote={updateSubnote}
                        onDelete={deletePriority}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        canMoveUp={index > 0}
                        canMoveDown={index < incompletePriorities.length - 1}
                      />
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>

              {completedPriorities.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Completed ({completedPriorities.length})
                  </h3>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {completedPriorities.map((priority) => (
                        <PriorityItem
                          key={priority.id}
                          priority={priority}
                          onToggleComplete={handleToggleComplete}
                          onUpdateSubnote={updateSubnote}
                          onDelete={deletePriority}
                          onMoveUp={handleMoveUp}
                          onMoveDown={handleMoveDown}
                          canMoveUp={false}
                          canMoveDown={false}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {priorities.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No priorities yet. Add one to get started!
                  </p>
                </div>
              )}
            </div>
          )}

          {currentView === 'reminders' && (
            <div className="space-y-4">
              <RecurringRemindersView />
            </div>
          )}
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}