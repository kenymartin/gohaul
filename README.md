# GoHaul

A modern logistics platform for efficient cargo transportation.

## Features

- User authentication and authorization
- Shipment management
- Real-time tracking
- Bidding system
- Messaging system
- Role-based access control

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Development**: Docker, VS Code Dev Containers

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [VS Code](https://code.visualstudio.com/)
- [VS Code Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gohaul.git
   cd gohaul
   ```

2. Open the project in VS Code:
   ```bash
   code .
   ```

3. When prompted, click "Reopen in Container" or use the command palette (F1) and select "Remote-Containers: Reopen in Container"

4. The development environment will be set up automatically. This includes:
   - Installing dependencies
   - Setting up the database
   - Generating Prisma client
   - Starting the development servers

5. Access the applications:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

## Development

- The project uses pnpm workspaces for managing packages
- Frontend code is in `packages/frontend`
- Backend code is in `packages/backend`
- Shared types and utilities are in `packages/shared`

### Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages
- `pnpm test` - Run tests
- `pnpm lint` - Run linters
- `pnpm setup` - Setup development environment

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/gohaul?schema=public

# JWT
JWT_SECRET=your_jwt_secret_here

# Ports
PORT=3000
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT 