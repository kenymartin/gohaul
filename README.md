# GoHaul

A monorepo project with a React frontend and Node.js backend.

## Project Structure

```
gohaul/
├── packages/
│   ├── frontend/     # React + Vite + TypeScript + TailwindCSS
│   ├── backend/      # Node.js + Express + TypeScript + Prisma
│   └── shared/       # Shared types and utilities
├── docker-compose.yml
└── package.json
```

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- pnpm (recommended) or npm

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development environment:
   ```bash
   # Start with Docker
   npm run docker:up

   # Or start without Docker
   npm run dev
   ```

3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000
   - Prisma Studio: http://localhost:5555

## Development

- Frontend development server: `npm run dev:frontend`
- Backend development server: `npm run dev:backend`
- Database management: `npm run prisma:studio -w backend`

## Environment Variables

Create `.env` files in the respective packages:

### Backend (.env)
```
DATABASE_URL="postgresql://gohaul:gohaul@localhost:5432/gohaul"
PORT=4000
```

## Docker

The project includes Docker support for easy development and deployment:

- `npm run docker:up`: Start all services
- `npm run docker:down`: Stop all services

## License

MIT 