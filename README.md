# 🤖 Summarizer

> A powerful Chrome extension with a robust backend API for intelligent text summarization using multiple LLM providers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Extension Setup](#-extension-setup)
- [Backend Setup](#-backend-setup)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Chrome Extension
- 🎯 **Smart Text Selection**: Highlight any text on any webpage to summarize
- 🔊 **Text-to-Speech**: Built-in read aloud functionality with pause/resume controls
- 🔐 **Encrypted API Keys**: Secure storage of your LLM provider API keys
- 🎨 **Modern UI**: Clean, intuitive interface with dark mode support
- 📊 **Usage Tracking**: Anonymous telemetry for usage statistics
- 🌍 **Multi-language Support**: Summarize and output in multiple languages

### Backend API
- 🔒 **Secure Authentication**: JWT-based user authentication with bcrypt password hashing
- 📈 **Usage Limits**: Configurable daily/monthly limits for free and paid tiers
- 💳 **Stripe Integration**: Ready-to-use subscription management
- 📊 **Admin Dashboard**: Comprehensive statistics and monitoring endpoints
- 🔄 **Multiple LLM Providers**: Support for Groq, OpenAI, and Google Gemini
- 🐳 **Docker Ready**: Complete Docker Compose setup for easy deployment
- 📝 **Comprehensive Logging**: Structured JSON logging for all operations
- 🛡️ **Security Headers**: CORS, CSP, and other security best practices

## 🏗️ Architecture

```
summarizer/
├── extension/              # Chrome Extension (Manifest V3)
│   ├── manifest.json      # Extension configuration
│   ├── content.js         # Content script for text selection
│   ├── background.js      # Service worker for API calls
│   ├── options.html       # Settings page
│   └── popup.html         # Extension popup
│
├── backend/               # Node.js/Express API
│   ├── api/              # API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   ├── admin/        # Admin & monitoring endpoints
│   │   ├── extension/    # Extension-specific endpoints
│   │   └── subscription/ # Stripe subscription endpoints
│   ├── lib/              # Shared libraries
│   │   ├── config.js     # Centralized configuration
│   │   ├── auth.js       # Authentication utilities
│   │   ├── db.js         # Database connection pool
│   │   └── cors.js       # CORS and security headers
│   ├── schema.sql        # PostgreSQL database schema
│   ├── server.js         # Express server
│   └── Dockerfile        # Docker configuration
│
└── docker-compose.yml    # Docker Compose setup
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose (for backend)
- PostgreSQL 16 (if not using Docker)
- Chrome/Chromium browser

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/summarizer.git
cd summarizer
```

### 2. Start Backend with Docker

```bash
# Copy environment file
cp .env.example .env

# Generate secure tokens
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ADMIN_STATS_TOKEN=' + require('crypto').randomBytes(32).toString('hex'))"

# Add tokens to .env file and configure your LLM API key
# Edit .env and add:
# - JWT_SECRET=<generated-token>
# - ADMIN_STATS_TOKEN=<generated-token>
# - GROQ_API_KEY=<your-groq-key> (or GEMINI_API_KEY or OPENAI_API_KEY)

# Start services
docker compose up -d

# Check logs
docker logs summarizer-backend-1 -f
```

### 3. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder
5. The extension icon should appear in your toolbar

### 3.1 Configure Extension Backend URL (from env)

Chrome extensions cannot read `.env` at runtime. Instead, the backend base URL is baked into `extension/config.js` during packaging.

1. Set the env var and generate the config:

```bash
export EXTENSION_BACKEND_BASE_URL="http://localhost:9090"
node scripts/generate-extension-config.js
```

2. Reload the extension in `chrome://extensions`.

Notes:

- For local development use `http://localhost:9090`
- For production use your public URL, e.g. `https://api.yourdomain.com`

### 4. Configure Extension

1. Right-click the extension icon → **Options**
2. Choose your LLM provider (Groq, OpenAI, or Gemini)
3. Enter your API key
4. Select a model
5. Click **Save**

### 5. Test It Out

1. Navigate to any webpage
2. Highlight some text
3. Click the summarize button that appears
4. View your AI-generated summary!

## 🔧 Extension Setup

### Supported LLM Providers

#### Groq (Recommended for Free Tier)
- **Provider**: `groq`
- **Model**: `llama-3.1-8b-instant`
- **Get API Key**: [console.groq.com](https://console.groq.com)

#### Google Gemini
- **Provider**: `gemini`
- **Model**: `gemini-2.5-flash`
- **Get API Key**: [aistudio.google.com](https://aistudio.google.com)

#### OpenAI
- **Provider**: `openai`
- **Model**: `gpt-4o-mini` or `gpt-3.5-turbo`
- **Get API Key**: [platform.openai.com](https://platform.openai.com)

### Extension Features

- **Bullet Summary**: Toggle for bullet-point format
- **Output Language**: Choose summary language (auto-detect or specific)
- **Read Aloud**: Built-in TTS with controls
- **Encrypted Storage**: API keys stored securely in Chrome sync storage

## 🖥️ Backend Setup

### Local Development (Without Docker)

```bash
cd backend

# Install dependencies
npm install

# Setup PostgreSQL database
createdb summarizer
psql summarizer < schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start server
npm start
```

### Docker Development

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Restart backend only
docker compose restart backend

# Stop all services
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v
```

### Database Management

```bash
# Access PostgreSQL
docker exec -it summarizer-postgres-1 psql -U summarizer -d summarizer

# Run migrations
docker exec -it summarizer-postgres-1 psql -U summarizer -d summarizer -f /docker-entrypoint-initdb.d/01-schema.sql

# Backup database
docker exec summarizer-postgres-1 pg_dump -U summarizer summarizer > backup.sql

# Restore database
docker exec -i summarizer-postgres-1 psql -U summarizer summarizer < backup.sql
```

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:9090`
- **Production**: `https://your-domain.com`

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "plan": "free"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

### Summarization Endpoints

#### Authenticated Summarize
```bash
POST /api/summarize
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "text": "Your text to summarize...",
  "model": "llama-3.1-8b-instant"
}
```

#### Extension Summarize (Anonymous)
```bash
POST /api/extension/summarize
Content-Type: application/json

{
  "text": "Your text to summarize...",
  "installId": "unique-install-id",
  "provider": "groq",
  "model": "llama-3.1-8b-instant",
  "bulletSummary": false,
  "outputLanguage": "auto"
}
```

### Admin Endpoints

All admin endpoints require `Authorization: Bearer <ADMIN_STATS_TOKEN>`

#### Health Check
```bash
GET /api/admin/health
Authorization: Bearer <admin-token>

Response:
{
  "ok": true,
  "timestamp": "2026-02-05T10:00:00.000Z",
  "uptime": 3600,
  "database": {
    "connected": true,
    "responseTime": 15,
    "connections": 3
  },
  "memory": {
    "heapUsed": 45,
    "heapTotal": 60
  }
}
```

#### Statistics
```bash
GET /api/admin/stats?days=30
Authorization: Bearer <admin-token>
```

#### Total Users
```bash
GET /api/admin/total-users
Authorization: Bearer <admin-token>
```

#### Query Statistics
```bash
GET /api/admin/total-queries
GET /api/admin/free-queries
GET /api/admin/own-key-queries
Authorization: Bearer <admin-token>
```

### Swagger Documentation

Interactive API documentation available at:
```
http://localhost:9090/api-docs
```

## ⚙️ Configuration

### Environment Variables

See `.env.example` for all available configuration options.

#### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Security (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=<64-char-hex-string>
ADMIN_STATS_TOKEN=<64-char-hex-string>

# LLM Provider (at least one)
GROQ_API_KEY=<your-key>
# OR
GEMINI_API_KEY=<your-key>
# OR
OPENAI_API_KEY=<your-key>
```

#### Optional Variables

```bash
# Server
NODE_ENV=production
PORT=9090
APP_URL=https://your-domain.com

# Database Pool
DB_POOL_MAX=10
DB_POOL_MIN=2

# CORS
CORS_ORIGIN=https://your-frontend.com

# Usage Limits
FREE_DAILY_LIMIT=5
PAID_MONTHLY_LIMIT=500
EXTENSION_DAILY_LIMIT=5

# Stripe (for subscriptions)
STRIPE_SECRET_KEY=<your-key>
STRIPE_WEBHOOK_SECRET=<your-secret>
STRIPE_PRICE_MONTHLY_ID=<price-id>
STRIPE_PRICE_YEARLY_ID=<price-id>
```

## 🛠️ Development

### Running Tests

```bash
cd backend
npm test
```

### Code Style

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Database Migrations

```bash
# Create migration
npm run migrate:create <migration-name>

# Run migrations
npm run migrate:up

# Rollback migration
npm run migrate:down
```

### Debugging

Enable debug logging:
```bash
LOG_LEVEL=debug
LOG_SQL_QUERIES=true
```

View logs:
```bash
# Backend logs
docker logs summarizer-backend-1 -f

# Filter by component
docker logs summarizer-backend-1 | jq 'select(.component=="db")'

# Filter by level
docker logs summarizer-backend-1 | jq 'select(.level=="error")'
```

## 🚢 Deployment

### Docker Production Deployment

```bash
# Build production image
docker compose -f docker-compose.prod.yml build

# Start production services
docker compose -f docker-compose.prod.yml up -d

# Configure reverse proxy (nginx/caddy)
# Point to localhost:9090
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd backend
vercel

# Set environment variables in Vercel dashboard
# Add all variables from .env.example
```

### Environment-Specific Configuration

**Production Checklist:**
- ✅ Set `NODE_ENV=production`
- ✅ Use strong `JWT_SECRET` (64+ characters)
- ✅ Configure specific `CORS_ORIGIN` (not `*`)
- ✅ Enable `DB_SSL=true` for managed databases
- ✅ Set up database backups
- ✅ Configure monitoring and alerts
- ✅ Use environment-specific API keys
- ✅ Enable rate limiting
- ✅ Set up SSL/TLS certificates

## 🔒 Security

### Security Features

- ✅ **JWT Authentication**: Secure token-based auth with configurable expiration
- ✅ **Password Hashing**: bcrypt with configurable rounds (default: 12)
- ✅ **SQL Injection Protection**: Parameterized queries throughout
- ✅ **CORS Configuration**: Configurable allowed origins
- ✅ **Security Headers**: X-Frame-Options, CSP, HSTS, etc.
- ✅ **Input Validation**: Comprehensive validation on all endpoints
- ✅ **Rate Limiting**: Usage limits per user/install
- ✅ **Encrypted Storage**: Extension API keys encrypted in Chrome storage
- ✅ **Environment Validation**: Required variables checked on startup

### Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Rotate secrets regularly** - Especially in production
3. **Use strong passwords** - Minimum 8 characters enforced
4. **Enable SSL in production** - Set `DB_SSL=true`
5. **Monitor logs** - Check for unauthorized access attempts
6. **Keep dependencies updated** - Run `npm audit` regularly
7. **Use specific CORS origins** - Avoid `*` in production
8. **Implement rate limiting** - Protect against abuse
9. **Regular backups** - Automate database backups
10. **Security headers** - Already configured in CORS module

### Reporting Security Issues

Please report security vulnerabilities to: security@yourdomain.com

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com) - Fast LLM inference
- [Google Gemini](https://ai.google.dev) - Powerful AI models
- [OpenAI](https://openai.com) - GPT models
- [Express.js](https://expressjs.com) - Web framework
- [PostgreSQL](https://www.postgresql.org) - Database
- [Docker](https://www.docker.com) - Containerization

## 📞 Support

- 📧 Email: aedemirsen@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/summarizer/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/summarizer/discussions)

