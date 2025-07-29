# --- Build Stage ---
FROM node:22 AS builder

WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json ./
RUN npm ci --verbose

# Copy source and build
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install "serve" globally to serve static build
RUN npm install -g serve

# Copy only the built static files
COPY --from=builder /app/build ./build

# Expose the port serve will listen on
EXPOSE 3000

# Start static file server
CMD ["serve", "-s", "build", "-l", "3000"]
