import { AddRecurringReminder } from './AddRecurringReminder';
import { RecurringReminderItem } from './RecurringReminderItem';
import { useRecurringReminders } from '@/hooks/useRecurringReminders';
import { AnimatePresence } from 'framer-motion';

export const RecurringRemindersView = () => {
  const {
    recurringReminders,
    addRecurringReminder,
    updateRecurringReminder,
    deleteRecurringReminder,
    toggleReminderActive
  } = useRecurringReminders();

  const activeReminders = recurringReminders.filter(r => r.isActive);
  const inactiveReminders = recurringReminders.filter(r => !r.isActive);

  return (
    <div className="space-y-6">
      <AddRecurringReminder onAdd={addRecurringReminder} />
      
      {activeReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Active Reminders ({activeReminders.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {activeReminders.map((reminder) => (
                <RecurringReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onToggleActive={toggleReminderActive}
                  onDelete={deleteRecurringReminder}
                  onUpdate={updateRecurringReminder}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {inactiveReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-500 mb-3">
            Paused Reminders ({inactiveReminders.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {inactiveReminders.map((reminder) => (
                <RecurringReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onToggleActive={toggleReminderActive}
                  onDelete={deleteRecurringReminder}
                  onUpdate={updateRecurringReminder}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {recurringReminders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏰</div>
          <p className="text-gray-500 text-lg mb-2">
            No recurring reminders yet
          </p>
          <p className="text-gray-400 text-sm">
            Create your first reminder to get started with building healthy habits!
          </p>
        </div>
      )}
    </div>
  );
};