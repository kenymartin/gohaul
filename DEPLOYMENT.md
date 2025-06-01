# GoHaul Deployment Guide

This guide covers deploying GoHaul to production environments using Docker and Docker Compose.

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 2GB+ RAM
- 10GB+ disk space

### Environment Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd gohaul
```

2. **Create environment file:**
```bash
cp .env.example .env.production
```

3. **Configure environment variables:**
```bash
# Database
POSTGRES_PASSWORD=your_secure_postgres_password

# Redis
REDIS_PASSWORD=your_secure_redis_password

# JWT Secret (generate a strong secret)
JWT_SECRET=your_jwt_secret_key_here

# API URL for frontend
VITE_API_URL=https://yourdomain.com/api
```

### Production Deployment

1. **Build and start services:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. **Run database migrations:**
```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

3. **Verify deployment:**
```bash
curl http://localhost/health
```

## 🏗️ Architecture

### Services

- **Frontend**: React SPA served by Nginx
- **Backend**: Node.js API with Express
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Load Balancer**: Nginx reverse proxy

### Network Architecture

```
Internet → Nginx (Load Balancer) → Frontend/Backend → Database/Redis
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://gohaul:password@postgres:5432/gohaul

# Redis
REDIS_URL=redis://:password@redis:6379

# Security
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production

# Server
PORT=4000
```

#### Frontend
```bash
VITE_API_URL=https://api.yourdomain.com
```

### SSL/TLS Setup

1. **Obtain SSL certificates** (Let's Encrypt recommended):
```bash
certbot certonly --standalone -d yourdomain.com
```

2. **Copy certificates to nginx directory:**
```bash
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
```

3. **Update nginx configuration** to enable HTTPS.

## 📊 Monitoring & Health Checks

### Health Endpoints

- **Frontend**: `GET /health`
- **Backend**: `GET /api/health`
- **Database**: Built-in PostgreSQL health checks
- **Redis**: Built-in Redis health checks

### Monitoring Commands

```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f [service-name]

# Check resource usage
docker stats
```

## 🔄 Updates & Maintenance

### Rolling Updates

1. **Pull latest changes:**
```bash
git pull origin main
```

2. **Rebuild and deploy:**
```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

3. **Run migrations if needed:**
```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Database Backups

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U gohaul gohaul > backup.sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U gohaul gohaul < backup.sql
```

## 🛡️ Security

### Security Checklist

- [ ] Use strong passwords for all services
- [ ] Enable SSL/TLS encryption
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Use non-root users in containers
- [ ] Implement rate limiting
- [ ] Regular backups

### Firewall Configuration

```bash
# Allow HTTP/HTTPS
ufw allow 80
ufw allow 443

# Allow SSH (if needed)
ufw allow 22

# Enable firewall
ufw enable
```

## 📈 Scaling

### Horizontal Scaling

The application supports horizontal scaling:

1. **Scale backend services:**
```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

2. **Scale frontend services:**
```bash
docker-compose -f docker-compose.prod.yml up -d --scale frontend=2
```

### Load Balancing

Nginx automatically load balances between multiple instances.

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Check PostgreSQL service status
   - Verify DATABASE_URL format
   - Ensure database is accessible

2. **Frontend not loading:**
   - Check nginx configuration
   - Verify build process completed
   - Check browser console for errors

3. **API errors:**
   - Check backend logs
   - Verify environment variables
   - Test database connectivity

### Debug Commands

```bash
# Check container logs
docker-compose -f docker-compose.prod.yml logs backend

# Access container shell
docker-compose -f docker-compose.prod.yml exec backend sh

# Test database connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U gohaul -d gohaul -c "SELECT 1;"
```

## 🚀 Cloud Deployment

### AWS ECS

1. Push images to ECR
2. Create ECS task definitions
3. Configure load balancer
4. Set up RDS for database

### Google Cloud Run

1. Build and push to Container Registry
2. Deploy to Cloud Run
3. Configure Cloud SQL
4. Set up load balancer

### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy with managed database

## 📞 Support

For deployment issues:

1. Check logs first
2. Review this documentation
3. Check GitHub issues
4. Contact support team

---

**Note**: Always test deployments in a staging environment before production. 