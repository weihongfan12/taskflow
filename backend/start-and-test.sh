#!/bin/bash
set -e

echo "========================================"
echo "TaskFlow Backend - Setup & Test Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function print_status {
    echo -e "${GREEN}[✓]${NC} $1"
}

function print_error {
    echo -e "${RED}[✗]${NC} $1"
}

function print_info {
    echo -e "${YELLOW}[→]${NC} $1"
}

# Check prerequisites
print_info "Checking prerequisites..."
command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed."; exit 1; }
command -v npx >/dev/null 2>&1 || { print_error "npx is required but not installed."; exit 1; }
command -v psql >/dev/null 2>&1 || print_error "PostgreSQL client not found (optional)"

print_status "Prerequisites check passed"

# Install dependencies
print_info "Installing dependencies..."
npm ci
print_status "Dependencies installed"

# Generate Prisma client
print_info "Generating Prisma client..."
npx prisma generate
print_status "Prisma client generated"

# Build the project
print_info "Building project..."
npm run build
print_status "Build completed"

# Check if database is available (optional)
print_info "Checking database connection..."
if command -v psql &>/dev/null; then
    PGPASSWORD=password psql -h localhost -U taskflow_user -d taskflow_db -c "SELECT 1" &>/dev/null && \
        print_status "Database connection successful" || \
        print_error "Database connection failed (you may need to run migrations first)"
else
    print_info "Skipping database check (psql not available)"
fi

# Display instructions
echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the server:"
echo "  npm start         # production mode"
echo "  npm run dev       # development mode"
echo ""
echo "To run database migrations:"
echo "  npx prisma migrate dev --name migration-name"
echo ""
echo "To access the API:"
echo "  http://localhost:3001/api/health"
echo ""
echo "For full API documentation, see API.md"
echo "========================================"
