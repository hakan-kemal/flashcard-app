# Flashcard App

> Full-stack flashcard application for studying with progress tracking. Built as a [Frontend Mentor](https://www.frontendmentor.io/challenges/flashcard-app) challenge solution.

## 🚀 Quick Start

```bash
# Install all dependencies
bun install

# Generate Prisma client and push database schema
bun run db:push

# Start development servers
bun run dev:client    # Frontend at http://localhost:5173
bun run dev:server    # Backend at http://localhost:3001
```

## 📁 Monorepo Structure

This is a Bun workspace monorepo containing both client and server applications:

```
flashcard-app/
├── client/           # React Router v7 frontend
│   ├── app/         # Application source
│   └── README.md    # Client documentation
├── server/          # Fastify backend
│   ├── prisma/      # Database schema
│   ├── src/         # Server source
│   └── dev.db       # SQLite database
└── package.json     # Workspace configuration
```

## 🛠️ Tech Stack

### Frontend (Client)

- **Framework:** React Router v7 with SSR
- **Language:** TypeScript (strict mode)
- **State:** Zustand + TanStack Query
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Build:** Vite

### Backend (Server)

- **Runtime:** Bun
- **Framework:** Fastify
- **Database:** SQLite (dev) / PostgreSQL (prod ready)
- **ORM:** Prisma
- **Language:** TypeScript

## 📦 Available Scripts

### Development

```bash
bun run dev:client      # Start React Router dev server
bun run dev:server      # Start Fastify API server
```

### Build & Production

```bash
bun run build          # Build client for production
bun run start:client   # Start production client server
bun run start:server   # Start production API server
```

### Database

```bash
bun run db:generate    # Generate Prisma client
bun run db:push        # Push schema to database (no migration)
bun run db:migrate     # Create and run migrations
bun run db:studio      # Open Prisma Studio GUI
```

### Type Checking

```bash
bun run typecheck      # Run TypeScript checks
```

### Cleanup

```bash
bun run clean          # Remove all node_modules and build files
```

## ✨ Features

- ✅ Create, edit, and delete flashcards
- ✅ Organize cards by category
- ✅ Study mode with card flipping animations
- ✅ Progress tracking (known count 0-5)
- ✅ Category filtering and sorting
- ✅ Search functionality
- ✅ Data persistence with SQLite
- ✅ RESTful API with Fastify
- ✅ Type-safe with TypeScript & Prisma

## 🗄️ API Endpoints

The server exposes the following REST endpoints at `http://localhost:3001`:

### Flashcards

- `GET /api/flashcards` - Get all flashcards (optional ?category filter)
- `GET /api/flashcards/:id` - Get single flashcard
- `POST /api/flashcards` - Create new flashcard
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Delete flashcard

### Progress

- `POST /api/flashcards/:id/increment` - Increment known count
- `POST /api/flashcards/:id/reset` - Reset known count to 0

### Categories & Health

- `GET /api/categories` - Get all categories with card counts
- `GET /health` - Health check endpoint

## 📚 Documentation

- **[Client README](./client/README.md)** - Detailed frontend documentation
- **[Architecture Guide](./client/ARCHITECTURE.md)** - Technical implementation details

## 🚧 Roadmap

- [ ] User authentication
- [ ] Cloud database sync
- [ ] Spaced repetition algorithm
- [ ] Study sessions with timer
- [ ] Import/export flashcard decks
- [ ] Collaborative decks

## 🧪 Future Enhancements

- **Database:** Easy migration from SQLite to PostgreSQL (Prisma schema stays the same)
- **Deployment:** Ready for Railway, Fly.io, or Vercel
- **Auth:** Prepared for JWT or session-based authentication
- **Multi-tenant:** Schema supports future user isolation

## 📝 License

MIT

---

Built with ❤️ using Bun, React Router, Fastify, and Prisma
