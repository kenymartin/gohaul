# GoHaul - Logistics Management Platform

A full-stack TypeScript monorepo project for managing shipments and transportation logistics. The platform connects customers with transporters, enabling efficient shipment management and bidding.

## 🚀 Features

- **User Authentication**
  - JWT-based authentication
  - Role-based access control (Customer/Transporter)
  - Secure password handling

- **Shipment Management**
  - Create and track shipments
  - Real-time status updates
  - Detailed shipment information

- **Bidding System**
  - Transporters can bid on available shipments
  - Customers can review and accept bids
  - Automated notifications

- **Dashboard & Analytics**
  - Shipment statistics
  - Bid tracking
  - Performance metrics

## 🛠 Tech Stack

- **Backend**
  - Node.js + Express
  - TypeScript
  - Prisma ORM
  - PostgreSQL
  - Jest for testing

- **Frontend**
  - React + Vite
  - TypeScript
  - TailwindCSS
  - React Hook Form

- **Shared**
  - Common TypeScript types
  - Shared utilities

## 📦 Project Structure

```
gohaul/
├── packages/
│   ├── backend/         # Node.js + Express backend
│   ├── frontend/        # React + Vite frontend
│   └── shared/          # Shared TypeScript types
├── .devcontainer/       # Development container config
└── docker-compose.yml   # Docker composition
```

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20 or higher
- npm or yarn

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/kenymartin/gohaul.git
   cd gohaul
   ```

2. Start the development containers:
   ```bash
   docker-compose -f .devcontainer/docker-compose.yml up -d
   ```

3. Install dependencies:
   ```bash
   npm install
   cd packages/frontend && npm install
   cd ../backend && npm install
   ```

4. Set up environment variables:
   Create `.env` file in `packages/backend` with:
   ```
   DATABASE_URL="postgresql://gohaul:gohaul@db:5432/gohaul"
   JWT_SECRET="your-super-secret-jwt-key"
   SMTP_HOST="smtp.mailtrap.io"
   SMTP_PORT="2525"
   SMTP_USER="your-mailtrap-user"
   SMTP_PASS="your-mailtrap-password"
   PORT=4000
   NODE_ENV="development"
   ```

5. Run database migrations:
   ```bash
   cd packages/backend
   npx prisma migrate dev
   ```

6. Start the development servers:
   ```bash
   # In packages/backend
   npm run dev

   # In packages/frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Database: localhost:5432

## 🧪 Testing

```bash
# Run backend tests
cd packages/backend
npm test

# Run frontend tests
cd packages/frontend
npm test
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Shipment Endpoints
- `POST /api/shipments` - Create a new shipment
- `GET /api/shipments` - List shipments
- `PATCH /api/shipments/:id/status` - Update shipment status
- `DELETE /api/shipments/:id` - Delete shipment

### Bid Endpoints
- `POST /api/bids` - Create a new bid
- `POST /api/bids/:id/accept` - Accept a bid
- `GET /api/bids/shipment/:shipmentId` - Get bids for a shipment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Keny Martin** - *Initial work* 