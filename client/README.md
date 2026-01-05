# Flashcard App

> A modern, interactive flashcard application for studying and tracking learning progress. Built as a [Frontend Mentor](https://www.frontendmentor.io/challenges/flashcard-app) challenge solution.

![Flashcard App Preview](./app/assets/images/preview.jpg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Development](#development)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

## 🎯 Overview

This flashcard application allows users to create, organize, and study flashcards with advanced features like progress tracking, filtering, and study statistics. The app is built with modern web technologies and follows best practices for maintainable, scalable code.

### Challenge Requirements

Users can:

- ✅ Create, edit, and delete flashcards with questions, answers, and categories
- ✅ Study flashcards one at a time with flip animations
- ✅ Track mastery progress (0-5 scale) for each card
- ✅ Filter flashcards by category and hide mastered cards
- ✅ Shuffle cards for randomized study
- ✅ View study statistics (total, mastered, in progress, not started)
- ✅ Navigate with keyboard shortcuts
- ✅ See responsive layouts for mobile, tablet, and desktop
- ✅ Receive toast notifications for CRUD operations

## ✨ Features

### Core Functionality

- **Flashcard Management**: Full CRUD operations with form validation
- **Study Mode**: Interactive single-card view with flip animations
- **Progress Tracking**: 6-level mastery system (0-5 knownCount)
- **Smart Filtering**: Multi-category selection with real-time counts
- **Search**: Filter cards by question or answer content
- **Shuffle Mode**: Randomized study order for better retention
- **Statistics Dashboard**: Visual progress indicators and counts

### Technical Features

- **Server-Side Rendering (SSR)**: Fast initial page loads with React Router v7
- **Optimistic Updates**: Instant UI feedback using TanStack Query
- **Persistent Storage**: localStorage with seamless migration path to backend
- **Type Safety**: Full TypeScript coverage with strict mode
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Keyboard navigation and ARIA attributes
- **Toast Notifications**: User feedback for all actions

## 🛠 Tech Stack

### Core Framework

- **[React Router v7](https://reactrouter.com/)** - Full-stack React framework with SSR
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### State Management & Data Fetching

- **[TanStack Query v5](https://tanstack.com/query)** - Server state management with caching and optimistic updates
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight client state management for UI
- **localStorage** - Client-side persistence (migration-ready for backend)

### UI & Styling

- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for card flips and transitions
- **[Sonner](https://sonner.emilkowal.ski/)** - Beautiful toast notifications

### Development Tools

- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[nanoid](https://github.com/ai/nanoid)** - Unique ID generation
- **[React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)** - Query debugging

## 📁 Project Structure

```
client/
├── app/                    # Application source
│   ├── app.css            # Global styles & Tailwind config
│   ├── assets/            # Static assets (fonts, images)
│   ├── components/        # React components
│   │   ├── filters/      # Filter components
│   │   ├── flashcard/    # Card components
│   │   ├── forms/        # Form components
│   │   └── ui/           # Reusable UI components
│   ├── data/             # Static data
│   │   └── data.json    # Initial flashcards
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and services
│   │   ├── api/         # Data operations
│   │   └── utils.ts     # Helper functions
│   ├── root.tsx          # Root component with providers
│   ├── routes/           # Page components
│   ├── routes.ts         # Route configuration
│   ├── stores/           # Zustand state stores
│   └── types/            # TypeScript definitions
├── build/                 # Production build output
├── Dockerfile            # Container configuration
├── package.json          # Dependencies and scripts
├── public/               # Static files (served as-is)
├── react-router.config.ts
├── tsconfig.json
└── vite.config.ts
```

### Architecture Highlights

- **Separation of Concerns**: Components, hooks, stores, and API layer are cleanly separated
- **Two-Tier State**: TanStack Query for server state, Zustand for UI state
- **Type Safety**: Strict TypeScript with centralized type definitions
- **Migration Ready**: Easy path from localStorage → React Router actions → Full backend

> 📖 For detailed architecture documentation, design patterns, and implementation details, see [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd flashcard-app/client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Create production build
npm start            # Run production server
npm run typecheck    # Run TypeScript type checking
```

## 🏗 Architecture

### Data Flow Overview

```
User Action → Component → Custom Hook → TanStack Query → API Layer → localStorage
                              ↓
                      Cache Update + Toast
                              ↓
                      Component Re-render
```

### State Management

**TanStack Query (Server State):**

- Flashcard data (CRUD operations)
- Automatic caching and background sync
- Optimistic updates with rollback

**Zustand (Client State):**

- UI state (view mode, modals)
- Filter settings and search
- Study mode navigation

### API Layer

The API layer abstracts data operations, currently using localStorage but designed for easy migration to a backend API. Simply swap the implementation without changing any component code.

```typescript
// Current: localStorage
export async function getFlashcards(): Promise<Flashcard[]> {
  const stored = localStorage.getItem('flashcards');
  return stored ? JSON.parse(stored) : [];
}

// Future: HTTP API (same signature)
export async function getFlashcards(): Promise<Flashcard[]> {
  const res = await fetch('/api/flashcards');
  return res.json();
}
```

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for:**

- Detailed data flow diagrams
- Optimistic update implementation
- Migration strategy (localStorage → React Router → Backend)
- Code organization patterns
- Development guidelines

### Code Style

- **TypeScript**: Strict mode enabled, no implicit any
- **Component Structure**: Functional components with hooks
- **Naming Conventions**:
  - Components: PascalCase (`FlashCard.tsx`)
  - Hooks: camelCase with `use` prefix (`useFlashcards.ts`)
  - Utilities: camelCase (`formatDate`)
  - Types: PascalCase (`Flashcard`)

### Adding New Features

1. **Define Types**: Start with TypeScript interfaces in `types/`
2. **Create API Functions**: Add data operations in `lib/api/`
3. **Build Hooks**: Wrap API calls with TanStack Query in `hooks/`
4. **Create Components**: Build UI components in `components/`
5. **Update Routes**: Integrate into pages in `routes/`

### Testing

```bash
# Type checking
npm run typecheck

# Build check
npm run build
```

### Browser DevTools

- **React Query DevTools**: Inspect queries and mutations (dev only)
- **Zustand DevTools**: Use Redux DevTools extension
- **localStorage**: View in Application tab → Local Storage

## 🚢 Deployment

### Production Build

```bash
npm run build
```

Output structure:

```
build/
├── client/    # Static assets (CSS, JS, images)
└── server/    # Server-side code for SSR
```

### Docker Deployment

```bash
docker build -t flashcard-app .
docker run -p 3000:3000 flashcard-app
```

Deployable to:

- Vercel / Netlify (with adapter)
- Railway / Fly.io
- AWS / Google Cloud / Azure
- Any Node.js hosting

### Environment Variables

Currently none required. When migrating to backend:

```env
VITE_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

## 🔮 Future Enhancements

### Planned Features

- [ ] User authentication (Clerk/Auth.js)
- [ ] PostgreSQL database integration
- [ ] Multi-user support with data sync
- [ ] Import/Export flashcards (CSV, JSON)
- [ ] Spaced repetition algorithm
- [ ] Study streaks and gamification
- [ ] Collaborative study sets
- [ ] Mobile app (React Native/Capacitor)

### Technical Improvements

- [ ] E2E testing with Playwright
- [ ] Unit tests with Vitest
- [ ] Storybook for component library
- [ ] Accessibility audit and improvements
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] PWA support for offline usage
- [ ] Dark mode theme
- [ ] i18n for multiple languages

## 📝 License

This project is part of a Frontend Mentor challenge. See the [Frontend Mentor License](https://www.frontendmentor.io/license).

## 🙏 Acknowledgments

- Challenge by [Frontend Mentor](https://www.frontendmentor.io)
- Built with [React Router](https://reactrouter.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ for learning and growth.
