import { useEffect, useRef, useCallback } from 'react';
import { useRecurringReminders } from './useRecurringReminders';
import { useNotifications } from './useNotifications';

export const useReminderTimer = () => {
  console.log('🚀 useReminderTimer hook initialized');
  
  const { getActiveReminders, getOverdueReminders, triggerReminder } = useRecurringReminders();
  const { showNotification, permission, requestPermission } = useNotifications();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<number>(Date.now());

  const checkReminders = useCallback(() => {
    const now = Date.now();
    const overdueReminders = getOverdueReminders();
    
    console.log('🔔 Checking reminders:', {
      overdueCount: overdueReminders.length,
      permission,
      timestamp: new Date().toLocaleTimeString()
    });
    
    overdueReminders.forEach(reminder => {
      console.log('⏰ Overdue reminder:', reminder.title, 'Next due:', reminder.nextReminderAt);
      
      if (permission === 'granted') {
        console.log('✅ Showing notification for:', reminder.title);
        showNotification(reminder);
      } else {
        console.log('❌ Permission not granted:', permission);
      }
      triggerReminder(reminder.id);
    });

    lastCheckRef.current = now;
  }, [getOverdueReminders, showNotification, triggerReminder, permission]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      checkReminders();
    }, 5000); // Check every 5 seconds for testing

    // Initial check
    checkReminders();
  }, [checkReminders]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const activeReminders = getActiveReminders();
    
    console.log('📊 Timer effect:', {
      activeReminders: activeReminders.length,
      permission,
      reminders: activeReminders.map(r => ({ title: r.title, nextDue: r.nextReminderAt }))
    });
    
    if (activeReminders.length > 0) {
      if (permission === 'default') {
        console.log('🔑 Requesting notification permission...');
        requestPermission();
      }
      console.log('⏰ Starting reminder timer...');
      startTimer();
    } else {
      console.log('⏹️ No active reminders, stopping timer');
      stopTimer();
    }

    return () => stopTimer();
  }, [getActiveReminders, permission, requestPermission, startTimer, stopTimer]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, keep timer running but reduce frequency
        stopTimer();
      } else {
        // Page is visible, resume normal checking
        checkReminders(); // Immediate check when returning
        startTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [checkReminders, startTimer, stopTimer]);

  return {
    startTimer,
    stopTimer,
    checkReminders
  };
};