# Chop Chop ⚡️

A delightful and intuitive daily priority management app built with Next.js. Simple, effective time management without the complexity of existing tools.

## Features ✨

- **Daily Priority List** - Add and manage your daily priorities
- **Single Sub-notes** - Add one contextual note per priority item  
- **Drag & Drop Reordering** - Visually reorganize priorities by importance
- **Smart Completion** - Check off completed items with satisfying animations
- **Local Storage** - All data persists automatically in your browser
- **Import/Export** - Backup and restore data via JSON files
- **Mobile Responsive** - Works beautifully on all devices
- **Delightful UX** - Smooth animations and micro-interactions

## Tech Stack 🛠

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **@dnd-kit** for drag and drop
- **Heroicons** for UI icons

## Getting Started 🚀

1. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd chop_chop
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage 📋

1. **Add Priorities** - Click the "+" button or text area to add new daily priorities
2. **Reorder** - Drag items up/down or use arrow buttons to change priority order
3. **Add Context** - Click any priority to expand and add a sub-note
4. **Complete Items** - Check off completed priorities (they move to the bottom)
5. **Export/Import** - Use the export/import buttons to backup or restore your data

## Deployment 🌐

### GitHub Pages
1. **Build the app:**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to GitHub Pages:**
   - Push your code to GitHub
   - Go to repository Settings > Pages
   - Select source branch (usually `main`)
   - Your app will be available at `https://yourusername.github.io/chop_chop`

### Vercel (Recommended)
1. **Connect to Vercel:**
   - Push code to GitHub
   - Connect your repository at [vercel.com](https://vercel.com)
   - Automatic deployments on every push

### Other Platforms
The app builds to static files and can be deployed on:
- Netlify
- Surge.sh  
- Firebase Hosting
- Any static hosting service

## Data Management 💾

- **Local Storage**: All data is stored locally in your browser
- **Export**: Download your priorities as a JSON file for backup
- **Import**: Upload a JSON file to restore previous data
- **Daily Reset**: Each day starts with a fresh priority list

## Keyboard Shortcuts ⌨️

- **Enter**: Save priority or sub-note
- **Escape**: Cancel editing
- **Tab/Shift+Tab**: Navigate between elements
- **Space**: Toggle priority completion
- **Arrow Keys**: Navigate in drag-and-drop mode

## Browser Support 🌍

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing 🤝

This is a personal productivity app, but feel free to fork and customize for your needs!

## License 📄

MIT License - feel free to use this for personal or commercial projects.

---

**Made with ❤️ for simple, effective productivity**