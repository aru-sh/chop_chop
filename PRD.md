# Chop Chop - Product Requirements Document

## Overview
Chop Chop is a simple, intuitive time management and productivity app designed to help users organize their daily priorities without the complexity of existing tools.

## Problem Statement
- Current time management tools are overly complex
- Need for a simple, effective solution for daily priority management
- Lack of intuitive interfaces that encourage consistent usage

## Target User
- Individuals seeking simple daily task organization
- Users overwhelmed by complex productivity tools
- People who want quick, visual priority management

## Core Features

### 1. Daily Priority List
- **Primary Function**: Create and manage a list of priorities for each day
- **User Story**: As a user, I want to quickly add my daily priorities so I can stay focused on what matters most
- **Acceptance Criteria**:
  - Add new priority items with a simple input field
  - View all priorities in a clean, organized list
  - Each priority shows creation time/order

### 2. Single Sub-note per Priority
- **Primary Function**: Add one detailed note or context for each priority item
- **User Story**: As a user, I want to add one sub-note to my priorities so I can capture additional context
- **Acceptance Criteria**:
  - Click on any priority to expand and add/edit one sub-note
  - One sub-note per priority item (keep it simple)
  - Sub-note is collapsible/expandable
  - Basic text input (no rich text needed)

### 3. Priority Reordering
- **Primary Function**: Drag and drop or move priorities up/down to reflect changing importance
- **User Story**: As a user, I want to reorder my priorities throughout the day as situations change
- **Acceptance Criteria**:
  - Drag and drop functionality for reordering
  - Alternative up/down arrow buttons for accessibility
  - Visual feedback during reordering
  - Instant save to local storage

### 4. Data Import/Export
- **Primary Function**: Export current data to JSON file and import from JSON file
- **User Story**: As a user, I want to backup my data and move it between devices/browsers
- **Acceptance Criteria**:
  - Export button downloads current data as JSON file
  - Import button allows uploading JSON file to restore data
  - Data validation on import
  - Merge or replace options on import

## Technical Requirements

### Frontend Framework
- **Next.js** with React
- TypeScript for type safety
- Tailwind CSS for styling

### Data Storage
- **Local Storage** for all data persistence
- JSON structure for easy export/import
- Data persistence across browser sessions

### Performance Requirements
- Page load time < 2 seconds
- Smooth animations (60fps)
- Responsive design (mobile-first)

## UX/UI Requirements

### Design Principles
- **Simplicity**: Minimal cognitive load
- **Delight**: Smooth animations and micro-interactions
- **Intuitive**: No learning curve required
- **Focus**: Clear visual hierarchy

### Key UX Elements
- Clean, minimalist interface
- Satisfying check-off animations
- Smooth drag-and-drop interactions
- Pleasant color scheme (calming but energizing)
- Clear typography with good readability
- Mobile-responsive design

### User Flow
1. **Landing**: User sees today's priority list (empty on first visit)
2. **Add Priority**: Click "+" or input field to add new priority
3. **Manage**: Drag to reorder, click to add sub-note
4. **Complete**: Check off completed items with satisfying animation
5. **Export/Import**: Access data management in settings/menu

## Data Structure
```json
{
  "date": "2025-08-18",
  "priorities": [
    {
      "id": "uuid",
      "text": "Priority item",
      "order": 1,
      "completed": false,
      "subnote": "Single sub-note content",
      "createdAt": "timestamp",
      "completedAt": "timestamp"
    }
  ]
}
```

## Success Metrics
- Daily active usage
- Number of priorities completed per day
- User retention (return usage)
- Time spent in app (should be minimal - efficiency indicator)

## Future Considerations (Post-MVP)
- Backend integration for sync across devices
- Calendar integration
- Multiple days view
- Simple analytics

## Deployment
- GitHub Pages for static hosting
- Simple CI/CD pipeline for updates

---

**Next Steps**: Upon approval, proceed with Next.js setup and core functionality implementation.