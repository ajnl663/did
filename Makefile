# DID Workers - Makefile
.PHONY: up down seed test bench lint apk dev-portals dev-mobile clean

# Ports
PORTALS_PORT = 3000
MOBILE_PORT = 8081

# Docker Compose
COMPOSE_FILE = infra/docker-compose.yml

# Default target
all: up

# Start full dev environment (portals + mock API)
up:
	@echo "Starting DID Workers development environment..."
	@docker-compose -f $(COMPOSE_FILE) up -d
	@echo "Waiting for services to be healthy..."
	@sleep 10
	@echo "Services started!"
	@echo "  Portals: http://localhost:$(PORTALS_PORT)"
	@echo "  Mock API: http://localhost:3001"

# Stop dev environment
down:
	@docker-compose -f $(COMPOSE_FILE) down

# Seed demo data
seed:
	@echo "Seeding demo data..."
	@cd packages/mock-api && pnpm seed

# Run all tests
test:
	@echo "Running tests..."
	@pnpm -r test

# Run benchmarks
bench:
	@echo "Running benchmarks..."
	@cd research/benchmarks && python run_benchmarks.py

# Lint all packages
lint:
	@pnpm lint

# Build Android APK
apk:
	@echo "Building Android APK..."
	@cd apps/mobile && pnpm build:android

# Development servers
dev-portals:
	@cd apps/portals && pnpm dev

dev-mobile:
	@cd apps/mobile && pnpm start

# Install dependencies
install:
	@which pnpm >/dev/null 2>&1 || npm install -g pnpm
	@pnpm install

# Clean build artifacts
clean:
	@pnpm -r exec rm -rf dist build .turbo node_modules/.cache
	@rm -rf apps/portals/dist apps/mobile/dist

# Type check
typecheck:
	@pnpm typecheck

# Generate OpenAPI specs
openapi:
	@cd packages/mock-api && pnpm build

# Demo mode - starts everything for demo
demo: up seed
	@echo "Demo environment ready!"
	@echo "Run 'make dev-portals' in one terminal"
	@echo "Run 'make dev-mobile' in another terminal"

# CI commands
ci-install: install
ci-test: test
ci-lint: lint
ci-build: openapi

# Help
help:
	@echo "DID Workers - Available commands:"
	@echo "  make up          - Start full dev environment"
	@echo "  make down        - Stop dev environment"
	@echo "  make seed        - Seed demo data"
	@echo "  make test        - Run all tests"
	@echo "  make bench       - Run benchmarks"
	@echo "  make lint        - Lint all packages"
	@echo "  make apk         - Build Android APK"
	@echo "  make dev-portals - Start portals dev server"
	@echo "  make dev-mobile  - Start mobile dev server"
	@echo "  make install     - Install dependencies"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make typecheck   - Type check all packages"
	@echo "  make demo        - Start demo environment"
	@echo "  make help        - Show this help"