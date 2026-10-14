# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY apps/portals/package.json ./apps/portals/
COPY packages/design-system/package.json ./packages/design-system/
COPY packages/mock-api/package.json ./packages/mock-api/
COPY packages/credential-engine/package.json ./packages/credential-engine/
COPY packages/i18n/package.json ./packages/i18n/

# Install dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build portals (skip TypeScript check for Docker build)
WORKDIR /app/apps/portals
RUN pnpm vite build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/apps/portals/dist /usr/share/nginx/html
COPY apps/portals/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]