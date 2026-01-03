# Deployment Guide

This guide covers deploying The Lakeinator OSINT platform to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
- [Security Hardening](#security-hardening)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Python 3.8+ installed
- Node.js 18+ installed
- Domain name (for production)
- SSL certificate (recommended)
- Reverse proxy (nginx/Apache)

## Environment Setup

### Backend Environment Variables

Create `/server/.env`:

```bash
# Required
API_HOST=0.0.0.0
API_PORT=8000

# Optional API Keys
SHODAN_API_KEY=your_key_here

# Production Settings
ENVIRONMENT=production
LOG_LEVEL=warning
```

### Frontend Environment Variables

Create `/client/.env.production`:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Deployment Options

### Option 1: Traditional Server

#### Backend Deployment

1. **Install dependencies:**
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Run with Gunicorn (recommended for production):**
```bash
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

3. **Create systemd service** (`/etc/systemd/system/lakeinator-api.service`):
```ini
[Unit]
Description=The Lakeinator API
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/path/to/the-lakeinator/server
Environment="PATH=/path/to/the-lakeinator/server/venv/bin"
ExecStart=/path/to/the-lakeinator/server/venv/bin/gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable lakeinator-api
sudo systemctl start lakeinator-api
```

#### Frontend Deployment

1. **Build the application:**
```bash
cd client
npm install
npm run build
```

2. **Run production server:**
```bash
npm start
```

Or use PM2:
```bash
npm install -g pm2
pm2 start npm --name "lakeinator-frontend" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable HTTPS with Let's Encrypt:
```bash
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

### Option 2: Docker Deployment

#### Backend Dockerfile

Create `/server/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

EXPOSE 8000

CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

#### Frontend Dockerfile

Create `/client/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

#### Docker Compose

Create `/docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "8000:8000"
    environment:
      - API_HOST=0.0.0.0
      - API_PORT=8000
    env_file:
      - ./server/.env
    restart: unless-stopped
    
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

#### Vercel (Frontend)

1. Connect your GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your API endpoint
4. Deploy

#### Railway/Render (Backend)

1. Connect repository
2. Set runtime to Python
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables
6. Deploy

## Security Hardening

### Backend Security

1. **Update CORS origins** in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific domain
    allow_credentials=True,
    allow_methods=["GET"],  # Only needed methods
    allow_headers=["*"],
)
```

2. **Add rate limiting:**
```bash
pip install slowapi
```

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/recon")
@limiter.limit("10/minute")
async def run_recon(request: Request, target: str):
    # Implementation
```

3. **Environment variable validation:**
```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    shodan_api_key: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
```

4. **Add security headers:**
```python
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

app.add_middleware(SecurityHeadersMiddleware)
```

### Frontend Security

Update `next.config.ts`:
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};
```

## Monitoring

### Health Checks

Set up automated health checks:

```bash
# Cron job to check API health
*/5 * * * * curl -f http://localhost:8000/ || systemctl restart lakeinator-api
```

### Logging

Backend logging setup:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/lakeinator/api.log'),
        logging.StreamHandler()
    ]
)
```

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- Better Uptime
- StatusCake

## Troubleshooting

### Common Issues

**Backend not starting:**
```bash
# Check logs
journalctl -u lakeinator-api -n 50

# Test manually
cd server
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend build failures:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**API connection errors:**
- Verify CORS settings
- Check firewall rules
- Ensure API URL is correct in frontend
- Verify SSL certificates

**High memory usage:**
- Reduce number of workers
- Enable request timeout
- Implement caching
- Monitor for memory leaks

## Backup and Recovery

### Database Backups

If using PostgreSQL:
```bash
pg_dump -U username -d lakeinator > backup.sql
```

### Configuration Backups

```bash
# Backup environment files
tar -czf lakeinator-config-$(date +%Y%m%d).tar.gz server/.env client/.env.production
```

### Disaster Recovery

1. Keep encrypted backups off-site
2. Document restoration procedures
3. Test recovery process regularly
4. Maintain version control for all code

## Performance Optimization

### Backend

- Use connection pooling for databases
- Implement Redis caching
- Enable gzip compression
- Optimize async operations

### Frontend

- Enable Next.js ISR (Incremental Static Regeneration)
- Optimize images
- Implement code splitting
- Use CDN for static assets

## Scaling

### Horizontal Scaling

Use load balancer (nginx):
```nginx
upstream backend {
    server localhost:8000;
    server localhost:8001;
    server localhost:8002;
}
```

### Caching Strategy

Implement Redis:
```python
import redis
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(ttl=300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{args}:{kwargs}"
            cached = redis_client.get(key)
            if cached:
                return json.loads(cached)
            result = await func(*args, **kwargs)
            redis_client.setex(key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator
```

---

For additional support, consult the main README or open an issue on GitHub.
