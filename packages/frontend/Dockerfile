FROM node:20-alpine

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Copy shared package files and build it first
COPY packages/shared ./packages/shared
RUN cd packages/shared && npm install && npm run build

# Install frontend dependencies
WORKDIR /app/packages/frontend
RUN npm install

# Copy frontend files
COPY packages/frontend ./

CMD ["npm", "run", "dev"] 