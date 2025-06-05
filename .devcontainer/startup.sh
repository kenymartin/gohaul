#!/bin/bash
set -e

echo "🚀 Starting GoHaul development environment..."

# Navigate to workspace
cd /workspace

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
else
  echo "✅ Dependencies already installed"
fi

echo "✅ Basic setup complete!"
echo "To start development:"
echo "  - Backend: cd packages/backend && pnpm dev"
echo "  - Frontend: cd packages/frontend && pnpm dev"
echo ""

# Execute the passed command
exec "$@" 