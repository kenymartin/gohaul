FROM node:20-alpine

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

# Copy shared package files and build it first
COPY packages/shared ./packages/shared
RUN cd packages/shared && npm install && npm run build

# Install backend dependencies
WORKDIR /app/packages/backend
RUN npm install

# Copy backend files
COPY packages/backend ./

# Generate Prisma client
RUN npm run prisma:generate

CMD ["npm", "run", "dev"] 