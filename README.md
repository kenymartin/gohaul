# 🚛 GoHaul - Logistics Marketplace Platform

GoHaul is a modern, full-stack logistics marketplace that connects customers who need to ship items with transporters who can deliver them. Built with React, Node.js, and PostgreSQL, featuring an eBay-inspired design for familiar user experience.

![GoHaul Platform](https://via.placeholder.com/800x400/0066CC/FFFFFF?text=GoHaul+Logistics+Platform)

## ✨ Features

### 🎯 Core Functionality
- **Shipment Management**: Post, browse, and manage shipments
- **Competitive Bidding**: Transporters can bid on shipments
- **Real-time Tracking**: Track shipments throughout delivery
- **User Authentication**: Secure JWT-based authentication
- **Role-based Access**: Customer and Transporter roles
- **Messaging System**: Communication between users

### 🎨 User Experience
- **eBay-inspired Design**: Familiar, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live notifications and status updates
- **Advanced Search**: Filter and sort shipments
- **Dashboard Analytics**: Comprehensive user dashboards

### 🔧 Technical Features
- **Microservices Architecture**: Scalable backend design
- **Database Migrations**: Prisma ORM with PostgreSQL
- **API Documentation**: Comprehensive REST API
- **Docker Support**: Containerized deployment
- **Health Monitoring**: Built-in health checks
- **Security**: Input validation, rate limiting, CORS

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│  (PostgreSQL)   │
│   Port: 3001    │    │   Port: 4000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for navigation
- React Hook Form for forms
- Zustand for state management

**Backend:**
- Node.js with Express
- TypeScript for type safety
- Prisma ORM with PostgreSQL
- JWT for authentication
- Zod for validation
- bcryptjs for password hashing

**Infrastructure:**
- Docker & Docker Compose
- Nginx for reverse proxy
- Redis for caching (production)
- GitHub Actions for CI/CD

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/gohaul.git
cd gohaul
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the database:**
```bash
docker-compose up -d postgres
```

4. **Set up environment variables:**
```bash
# Backend
cd packages/backend
cp .env.example .env
# Edit .env with your database credentials
```

5. **Run database migrations:**
```bash
cd packages/backend
npx prisma migrate dev
```

6. **Start the development servers:**
```bash
# From root directory
npm run dev
```

7. **Access the application:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:4000
- API Documentation: http://localhost:4000/api/docs

## 📚 API Documentation

### Authentication Endpoints

```bash
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

### Shipment Endpoints

```bash
GET    /api/shipments           # Get all shipments
POST   /api/shipments           # Create shipment
GET    /api/shipments/:id       # Get shipment by ID
PATCH  /api/shipments/:id       # Update shipment
GET    /api/shipments/my        # Get user's shipments
GET    /api/shipments/available # Get available shipments
```

### Bidding Endpoints

```bash
POST   /api/bids                    # Create bid
GET    /api/bids/my                 # Get user's bids
GET    /api/bids/shipment/:id       # Get bids for shipment
PATCH  /api/bids/:id/accept         # Accept bid
PATCH  /api/bids/:id/reject         # Reject bid
```

## 🎨 User Interface

### Customer Flow
1. **Register/Login** as Customer
2. **Post Shipment** with details
3. **Receive Bids** from transporters
4. **Accept Best Bid** 
5. **Track Shipment** progress
6. **Rate Transporter** after delivery

### Transporter Flow
1. **Register/Login** as Transporter
2. **Browse Available Shipments**
3. **Place Competitive Bids**
4. **Manage Accepted Jobs**
5. **Update Delivery Status**
6. **Receive Payment & Ratings**

## 🔧 Development

### Project Structure

```
gohaul/
├── packages/
│   ├── frontend/          # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── stores/
│   │   └── public/
│   ├── backend/           # Node.js backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   └── prisma/
│   └── shared/            # Shared types/utilities
├── docker-compose.yml     # Development setup
├── docker-compose.prod.yml # Production setup
└── docs/                  # Documentation
```

### Available Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build            # Build all packages
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Testing
npm run test             # Run all tests
npm run test:frontend    # Frontend tests
npm run test:backend     # Backend tests

# Linting
npm run lint             # Lint all packages
npm run lint:fix         # Fix linting issues
```

## 🚀 Deployment

### Production Deployment

1. **Configure environment:**
```bash
cp .env.example .env.production
# Edit production environment variables
```

2. **Deploy with Docker:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Run migrations:**
```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Cloud Platforms

- **AWS**: ECS, RDS, ElastiCache
- **Google Cloud**: Cloud Run, Cloud SQL
- **DigitalOcean**: App Platform, Managed Database
- **Heroku**: Web dynos, Postgres add-on

## 🧪 Testing

### Running Tests

```bash
# All tests
npm run test

# Frontend tests
npm run test:frontend

# Backend tests  
npm run test:backend

# E2E tests
npm run test:e2e
```

### Test Coverage

- Unit tests for services and utilities
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for commit messages
- Jest for testing
- Comprehensive documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

### Getting Help

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/yourusername/gohaul/issues)
- 💬 [Discussions](https://github.com/yourusername/gohaul/discussions)
- 📧 Email: support@gohaul.com

### Reporting Issues

When reporting issues, please include:

- Operating system and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 🗺️ Roadmap

### Version 2.0
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Insurance options
- [ ] Route optimization

### Version 2.1
- [ ] AI-powered pricing suggestions
- [ ] Automated matching system
- [ ] Advanced tracking with IoT
- [ ] Carbon footprint tracking
- [ ] API marketplace

## 👥 Team

- **Frontend Development**: React, TypeScript, TailwindCSS
- **Backend Development**: Node.js, Express, Prisma
- **DevOps**: Docker, CI/CD, Cloud deployment
- **Design**: eBay-inspired UI/UX

## 🙏 Acknowledgments

- eBay for design inspiration
- Open source community for amazing tools
- Contributors and beta testers
- Logistics industry professionals for insights

---

**Built with ❤️ for the logistics community**

[⬆ Back to top](#-gohaul---logistics-marketplace-platform) 