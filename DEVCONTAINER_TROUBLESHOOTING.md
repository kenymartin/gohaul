# DevContainer Troubleshooting Guide

## Common Issues and Solutions

### 1. Container Build Failures

**Problem**: Container fails to build or start
**Solutions**:
```bash
# Clean up Docker completely
docker system prune -a --volumes
docker-compose -f .devcontainer/docker-compose.yml down --volumes

# Rebuild from scratch
docker-compose -f .devcontainer/docker-compose.yml up --build --force-recreate
```

### 2. Port Conflicts

**Problem**: Ports 5432, 5433, 3000, or 3001 are already in use
**Solutions**:
```bash
# Find and stop conflicting containers
docker ps -a | grep -E "(5432|5433|3000|3001)"
docker stop $(docker ps -q --filter "publish=5432")
docker stop $(docker ps -q --filter "publish=5433")

# Or use our cleanup script
./dev.ps1  # Windows
./dev.sh   # Linux/Mac
```

### 3. Database Connection Issues

**Problem**: Cannot connect to PostgreSQL database
**Solutions**:
1. Check if database container is running:
   ```bash
   docker-compose -f .devcontainer/docker-compose.yml ps
   ```

2. Check database logs:
   ```bash
   docker-compose -f .devcontainer/docker-compose.yml logs db
   ```

3. Test database connection:
   ```bash
   docker exec -it gohaul-db-1 psql -U gohaul -d gohaul
   ```

### 4. Permission Issues

**Problem**: Permission denied errors in container
**Solutions**:
1. Fix file permissions:
   ```bash
   chmod +x .devcontainer/startup.sh
   chmod +x dev.sh
   ```

2. Rebuild container with correct permissions:
   ```bash
   docker-compose -f .devcontainer/docker-compose.yml build --no-cache
   ```

### 5. Node Modules Issues

**Problem**: Dependencies not installing or outdated
**Solutions**:
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules packages/*/node_modules
   pnpm install
   ```

2. In container:
   ```bash
   docker exec -it gohaul-backend-1 bash
   cd /workspace
   pnpm install --frozen-lockfile
   ```

### 6. Prisma Issues

**Problem**: Database schema not synced or Prisma client outdated
**Solutions**:
1. Regenerate Prisma client:
   ```bash
   cd packages/backend
   pnpm prisma:generate
   pnpm prisma:push
   ```

2. Reset database (WARNING: This will delete all data):
   ```bash
   cd packages/backend
   pnpm prisma:reset
   ```

## Step-by-Step Recovery Process

If you're experiencing multiple issues, follow this complete recovery process:

### Step 1: Complete Cleanup
```bash
# Stop all containers
docker-compose -f .devcontainer/docker-compose.yml down --volumes

# Remove all Docker resources
docker system prune -a --volumes

# Clean local files
rm -rf node_modules packages/*/node_modules
```

### Step 2: Fix Permissions
```bash
chmod +x .devcontainer/startup.sh
chmod +x dev.sh
```

### Step 3: Rebuild Everything
```bash
# Use our development script
./dev.ps1  # Windows PowerShell
# OR
./dev.sh   # Linux/Mac/WSL
```

### Step 4: Verify Setup
```bash
# Check container status
docker-compose -f .devcontainer/docker-compose.yml ps

# Check logs
docker-compose -f .devcontainer/docker-compose.yml logs

# Test database connection
docker exec -it gohaul-db-1 psql -U gohaul -d gohaul -c "SELECT version();"
```

## Alternative: Manual Setup Without DevContainer

If devcontainer continues to cause issues, you can run the project manually:

### 1. Start Database Only
```bash
docker run -d \
  --name gohaul-postgres \
  -e POSTGRES_DB=gohaul \
  -e POSTGRES_USER=gohaul \
  -e POSTGRES_PASSWORD=gohaul \
  -p 5433:5432 \
  postgres:16-alpine
```

### 2. Update Environment
Create `packages/backend/.env`:
```env
DATABASE_URL="postgresql://gohaul:gohaul@localhost:5433/gohaul?schema=public"
JWT_SECRET="your_jwt_secret_here"
PORT=3001
NODE_ENV=development
```

### 3. Install Dependencies
```bash
pnpm install
cd packages/shared && pnpm build && cd ../..
cd packages/backend && pnpm prisma:generate && pnpm prisma:push
```

### 4. Start Services
```bash
# Terminal 1: Backend
cd packages/backend
pnpm dev

# Terminal 2: Frontend
cd packages/frontend
pnpm dev
```

## Getting Help

If you're still experiencing issues:

1. Check the container logs:
   ```bash
   docker-compose -f .devcontainer/docker-compose.yml logs --tail=50
   ```

2. Check the specific error in VS Code:
   - Open Command Palette (Ctrl+Shift+P)
   - Run "Dev Containers: Show Container Log"

3. Share the specific error message for targeted help.

## Environment Verification

Use this checklist to verify your environment:

- [ ] Docker Desktop is running
- [ ] No other services using ports 3000, 3001, 5432, 5433
- [ ] pnpm is installed globally
- [ ] All scripts have execute permissions
- [ ] No antivirus blocking Docker operations
- [ ] Sufficient disk space (at least 2GB free)
- [ ] Windows: WSL2 is properly configured (if using WSL) 