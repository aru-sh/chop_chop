# Recurring Reminders Feature - Product Requirements Document

## Overview
Add a recurring reminders system to Chop Chop that allows users to set up periodic notifications for habits, health reminders, and recurring tasks with browser notifications and audio alerts.

## Problem Statement
- Users need regular reminders for habits (drink water, take breaks, medication, etc.)
- Current priority system is for one-time tasks, not recurring behaviors
- No system for time-based notifications or habit tracking
- Users forget important recurring activities without prompts

## Target User
- Individuals who want to build healthy habits
- People who need regular reminders for health/wellness activities
- Users who work long hours and need break reminders
- Anyone wanting to establish consistent routines

## Core Features

### 1. Recurring Reminder Creation
- **Primary Function**: Create reminders that repeat at specified intervals
- **User Story**: As a user, I want to set up a reminder to drink water every hour so I stay hydrated throughout the day
- **Acceptance Criteria**:
  - Input field for reminder text/title
  - Dropdown/input for interval (minutes, hours, days)
  - Optional notes field (with markdown support)
  - Start time selection (immediate or scheduled)
  - Enable/disable toggle

### 2. Flexible Time Intervals
- **Primary Function**: Support various time intervals for different use cases
- **User Story**: As a user, I want to set different intervals (30 minutes for eye breaks, 2 hours for posture checks, daily for vitamins) to match my needs
- **Acceptance Criteria**:
  - Minutes: 1-59 minutes
  - Hours: 1-23 hours  
  - Days: 1-30 days
  - User-friendly time picker/input
  - Clear display of next reminder time

### 3. Browser Notifications with Sound
- **Primary Function**: Deliver attention-grabbing notifications that users notice
- **User Story**: As a user, I want notifications with sound so I notice them even when focused on other tasks
- **Acceptance Criteria**:
  - Browser notification permission request on first use
  - Notification shows reminder title and optional message
  - Audio alert plays with notification (with volume control)
  - Notification actions: "Done", "Snooze 10min", "Dismiss"
  - Fallback for browsers without notification support

### 4. Side Panel Navigation
- **Primary Function**: Separate interface for managing recurring reminders
- **User Story**: As a user, I want a dedicated space for recurring reminders separate from my daily priorities
- **Acceptance Criteria**:
  - Collapsible side panel with "Recurring Reminders" section
  - Toggle between "Daily Priorities" and "Recurring Reminders" views
  - Visual indicator for active reminders count
  - Clean, organized layout matching app design

### 5. Reminder Management
- **Primary Function**: Full CRUD operations for recurring reminders
- **User Story**: As a user, I want to edit, pause, or delete reminders as my needs change
- **Acceptance Criteria**:
  - Edit reminder text, interval, and settings
  - Pause/resume functionality
  - Delete reminders
  - View next scheduled time
  - See reminder history/stats (optional)

## Technical Requirements

### Frontend Framework
- **Next.js React** integration with existing app
- **TypeScript** for type safety
- **Tailwind CSS** for consistent styling
- **Framer Motion** for smooth transitions

### Browser APIs
- **Notification API** for browser notifications
- **Web Audio API** or HTML5 Audio for sound alerts
- **Service Worker** for background notifications (optional enhancement)
- **Permission API** for notification permissions

### Data Storage
- **Local Storage** expansion of existing JSON structure
- **Reminder state persistence** across browser sessions
- **Export/Import** integration with existing data management

### Performance Requirements
- **Minimal impact** on existing app performance
- **Efficient timer management** (no unnecessary setInterval calls)
- **Battery-friendly** implementation for mobile devices

## Data Structure

```typescript
interface RecurringReminder {
  id: string;
  title: string;
  notes?: string; // Optional markdown notes
  intervalType: 'minutes' | 'hours' | 'days';
  intervalValue: number; // 1-59 for minutes, 1-23 for hours, 1-30 for days
  isActive: boolean;
  createdAt: string;
  nextReminderAt: string;
  lastReminderAt?: string;
  soundEnabled: boolean;
  soundVolume: number; // 0-1
}

interface AppData {
  date: string;
  priorities: Priority[];
  recurringReminders: RecurringReminder[]; // New field
}
```

## UX/UI Requirements

### Design Principles
- **Consistent** with existing Chop Chop design language
- **Intuitive** reminder creation flow
- **Non-intrusive** but noticeable notifications
- **Clear visual hierarchy** between daily tasks and recurring reminders

### Key UX Elements
- **Side panel toggle** with smooth animation
- **Visual indicators** for active/paused reminders
- **Next reminder countdown** display
- **Easy-to-access** pause/resume controls
- **Clear notification design** with app branding

### User Flow
1. **Setup**: Click "Add Recurring Reminder" in side panel
2. **Configure**: Enter title, select interval, add optional notes
3. **Activate**: Enable reminder and grant notification permissions
4. **Manage**: View, edit, pause/resume from side panel
5. **Interact**: Respond to notifications with action buttons

## Notification Design

### Browser Notification Format
```
Title: 💧 Drink Water Reminder
Body: Stay hydrated! Remember to drink a glass of water.
Actions: [✅ Done] [⏰ Snooze 10min] [❌ Dismiss]
Icon: App icon/water emoji
```

### Sound Options
- **Default**: Gentle chime sound (non-intrusive)
- **Alternative sounds**: Different tones for different reminder types
- **Volume control**: User-adjustable (0-100%)
- **Mute option**: Visual notification only

## Success Metrics
- **User engagement**: Number of active recurring reminders per user
- **Notification interaction**: Click/action rates on notifications  
- **Feature adoption**: Percentage of users who create recurring reminders
- **Retention**: Users who continue using feature after 1 week

## Implementation Priority (MVP)

### Phase 1 (MVP)
1. Basic recurring reminder creation (title, interval)
2. Side panel navigation
3. Browser notifications with default sound
4. Basic CRUD operations (add, delete, pause/resume)

### Phase 2 (Enhancements)
1. Markdown notes support
2. Custom sound options and volume control
3. Notification interaction (snooze, done actions)
4. Reminder statistics and history

### Phase 3 (Advanced)
1. Service worker for background notifications
2. Multiple reminder categories/tags
3. Smart scheduling (don't remind during sleep hours)
4. Integration with calendar apps

## Browser Compatibility
- **Chrome/Edge 88+**: Full notification and audio support
- **Firefox 85+**: Full support
- **Safari 14+**: Notifications with limitations
- **Mobile browsers**: Basic notification support

## Privacy & Permissions
- **Notification permission**: Requested only when creating first reminder
- **Audio permission**: Auto-play policies respected
- **Data privacy**: All data stored locally, no external servers
- **User control**: Easy permission revocation and data clearing

## Technical Considerations

### Timer Management
- Use `setTimeout` instead of `setInterval` for better performance
- Implement proper cleanup on component unmount
- Handle browser sleep/wake scenarios
- Efficient state management for multiple active timers

### Notification Reliability
- Fallback strategies for blocked notifications
- Visual indicators when notifications are disabled
- In-app alerts as backup for critical reminders
- Clear user education about enabling permissions

## Future Enhancements (Post-MVP)
- **Habit tracking**: Mark completion and build streaks
- **Smart intervals**: AI-suggested optimal timing
- **Location-based reminders**: Context-aware notifications
- **Team reminders**: Shared recurring tasks for households/teams
- **Integration**: Connect with health apps, calendars, etc.

---

## Next Steps
Upon approval, proceed with:
1. Side panel UI implementation
2. Recurring reminder data structure
3. Timer management system
4. Browser notification integration
5. Testing across different browsers and scenarios

**Estimated Development Time**: 2-3 days for MVP implementation