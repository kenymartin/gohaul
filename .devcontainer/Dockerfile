FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    openssh-client \
    python3 \
    make \
    g++

# Install pnpm and typescript globally
RUN npm install -g pnpm typescript

# Create app directory
WORKDIR /workspace

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build shared package
RUN cd packages/shared && pnpm build

# Ensure backend devDependencies are installed
RUN cd packages/backend && pnpm install --filter @gohaul/backend...

# Generate Prisma client
RUN cd packages/backend && pnpm prisma:generate

# Expose ports
EXPOSE 3000 3001

# Set default command
CMD ["pnpm", "dev"] 