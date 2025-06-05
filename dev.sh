#!/bin/bash

echo "🚀 Starting GoHaul Development Environment"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f .devcontainer/docker-compose.yml down

# Remove any conflicting containers on ports
echo "🧹 Cleaning up port conflicts..."
docker ps -q --filter "publish=5432" | xargs -r docker stop
docker ps -q --filter "publish=5433" | xargs -r docker stop

# Start the development environment
echo "🏗️ Building and starting services..."
docker-compose -f .devcontainer/docker-compose.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Show service status
echo "📊 Service Status:"
docker-compose -f .devcontainer/docker-compose.yml ps

# Show logs
echo "📝 Recent logs:"
docker-compose -f .devcontainer/docker-compose.yml logs --tail=20

echo ""
echo "✅ Development environment is ready!"
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend will be available at: http://localhost:3001"
echo "🗄️ Database is available at: localhost:5433"
echo ""
echo "To view logs: docker-compose -f .devcontainer/docker-compose.yml logs -f"
echo "To stop: docker-compose -f .devcontainer/docker-compose.yml down" 