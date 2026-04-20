# TaskFlow Backend API

This is the backend server for TaskFlow, providing RESTful API for task management and user authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 15
- Docker & Docker Compose (optional)

### Environment Variables
Copy `.env.example` to `.env` and update the values:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

## 📦 Installation

```bash
cd backend
npm ci
npx prisma generate
```

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run database migrations
npx prisma migrate dev --name migration-name

# Generate Prisma client
npx prisma generate
```

## 🐳 Docker Deployment

```bash
# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 API Documentation

See [API.md](API.md) for detailed API documentation.

## 🔒 Security

- JWT authentication with bcrypt password hashing
- Rate limiting (100 requests per 15 minutes per IP)
- SQL injection protection via Prisma ORM
- CORS configuration
- HTTPS recommended for production

## 🐛 Troubleshooting

- Database connection issues: Check DATABASE_URL in .env
- Prisma schema mismatch: Run `npx prisma generate`
- Port conflicts: Change PORT in .env
- CORS errors: Verify FRONTEND_URL matches your frontend origin

## 📄 License

MIT
