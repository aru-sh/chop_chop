import { useState, useEffect, useCallback } from 'react';
import { RecurringReminder } from '@/types';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const playNotificationSound = useCallback((volume: number = 0.7) => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }, []);

  const showNotification = useCallback((reminder: RecurringReminder) => {
    console.log('🔔 showNotification called:', {
      isSupported,
      permission,
      reminderTitle: reminder.title,
      soundEnabled: reminder.soundEnabled,
      windowFocus: document.hasFocus(),
      visibilityState: document.visibilityState
    });

    if (!isSupported) {
      console.log('❌ Notifications not supported in this browser');
      return;
    }

    if (permission !== 'granted') {
      console.log('❌ Permission not granted:', permission);
      return;
    }

    try {
      // Try creating notification with minimal options first
      const notification = new Notification(`⏰ ${reminder.title}`, {
        body: reminder.notes || 'Time for your reminder!',
        requireInteraction: true, // Changed to true to make it persistent
        silent: false // Force to false to ensure it shows
      });

      console.log('✅ Browser notification created:', {
        title: notification.title,
        body: notification.body,
        tag: notification.tag,
        silent: notification.silent
      });

      // Add event listeners to debug
      notification.onclick = () => {
        console.log('🖱️ Notification clicked');
        notification.close();
      };

      notification.onshow = () => {
        console.log('👀 Notification shown');
      };

      notification.onerror = (error) => {
        console.error('❌ Notification error:', error);
      };

      notification.onclose = () => {
        console.log('❌ Notification closed');
      };

      // Auto-close after 15 seconds (longer for debugging)
      setTimeout(() => {
        console.log('⏰ Auto-closing notification');
        notification.close();
      }, 15000);

      // Play sound if enabled
      if (reminder.soundEnabled) {
        console.log('🔊 Playing notification sound');
        playNotificationSound(reminder.soundVolume);
      }

      return notification;
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
    }
  }, [isSupported, permission, playNotificationSound]);

  const testNotification = useCallback(() => {
    console.log('🧪 Testing basic notification...');
    try {
      const testNotif = new Notification('Test Notification', {
        body: 'This is a test notification from Chop Chop',
        requireInteraction: true,
        silent: false
      });
      
      testNotif.onshow = () => console.log('✅ Test notification shown');
      testNotif.onerror = (e) => console.error('❌ Test notification error:', e);
      testNotif.onclick = () => testNotif.close();
      
      setTimeout(() => testNotif.close(), 10000);
      return testNotif;
    } catch (error) {
      console.error('❌ Test notification failed:', error);
    }
  }, []);

  // Make test function globally available for debugging
  if (typeof window !== 'undefined') {
    (window as any).testNotification = testNotification;
  }

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    playNotificationSound,
    testNotification
  };
};