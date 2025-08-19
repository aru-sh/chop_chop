# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Chop Chop is a simple daily priority management app built with Next.js. It allows users to create, reorder, and manage daily priorities with single sub-notes per item. Data is stored locally in the browser with import/export capabilities.

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture
This is a Next.js 15 app using the App Router pattern with the following key structure:

### Core Data Management
- **Local Storage Pattern**: All data persists in browser localStorage via `useLocalStorage` hook
- **Priority Management**: `usePriorities` hook provides all CRUD operations for priorities
- **Data Structure**: Each day's data includes date and array of Priority objects with id, text, order, completed status, subnote, and timestamps

### Key Components
- `PriorityItem`: Displays individual priority with expansion for sub-notes
- `SortablePriorityItem`: Drag-and-drop wrapper using @dnd-kit
- `AddPriority`: Input component for adding new priorities  
- `ImportExport`: Data backup/restore functionality
- `Toast`: Notification system

### Type Definitions
Located in `src/types/index.ts`:
- `Priority`: Core data model for priority items
- `DayData`: Container for date and priorities array

### Styling & Interactions
- Tailwind CSS for styling
- Framer Motion for animations
- @dnd-kit for drag-and-drop reordering
- Heroicons for UI icons

### Path Aliases
- `@/*` maps to `./src/*` for clean imports

## Data Flow
1. `useLocalStorage` manages persistence and provides export/import
2. `usePriorities` handles all priority operations (add, update, delete, reorder)
3. Components consume data via these hooks
4. All changes auto-save to localStorage

## Key Features
- Drag-and-drop priority reordering
- Single expandable sub-note per priority
- Mark priorities complete (moves to bottom with animation)
- JSON export/import for data backup
- Mobile-responsive design