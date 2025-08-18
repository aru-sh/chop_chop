'use client';

import { useState } from 'react';
import { usePriorities } from '@/hooks/usePriorities';
import { PriorityItem } from '@/components/PriorityItem';
import { SortablePriorityItem } from '@/components/SortablePriorityItem';
import { AddPriority } from '@/components/AddPriority';
import { ImportExport } from '@/components/ImportExport';
import { Toast } from '@/components/Toast';
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
      // Get the actual index in the full priorities array
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chop Chop</h1>
          <p className="text-gray-600">{today}</p>
        </div>

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

        <div className="space-y-4">
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
