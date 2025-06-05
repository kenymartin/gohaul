Write-Host "🚀 Starting GoHaul Development Environment" -ForegroundColor Green

# Stop any existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f .devcontainer/docker-compose.yml down

# Remove any conflicting containers on ports
Write-Host "🧹 Cleaning up port conflicts..." -ForegroundColor Yellow
$containers5432 = docker ps -q --filter "publish=5432"
$containers5433 = docker ps -q --filter "publish=5433"

if ($containers5432) {
    docker stop $containers5432
}
if ($containers5433) {
    docker stop $containers5433
}

# Start the development environment
Write-Host "🏗️ Building and starting services..." -ForegroundColor Blue
docker-compose -f .devcontainer/docker-compose.yml up --build -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Show service status
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker-compose -f .devcontainer/docker-compose.yml ps

# Show logs
Write-Host "📝 Recent logs:" -ForegroundColor Cyan
docker-compose -f .devcontainer/docker-compose.yml logs --tail=20

Write-Host ""
Write-Host "✅ Development environment is ready!" -ForegroundColor Green
Write-Host "🌐 Frontend will be available at: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend will be available at: http://localhost:3001" -ForegroundColor White
Write-Host "🗄️ Database is available at: localhost:5433" -ForegroundColor White
Write-Host ""
Write-Host "To view logs: docker-compose -f .devcontainer/docker-compose.yml logs -f" -ForegroundColor Gray
Write-Host "To stop: docker-compose -f .devcontainer/docker-compose.yml down" -ForegroundColor Gray 