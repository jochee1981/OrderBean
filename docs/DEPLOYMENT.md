# 배포 가이드

## 목차

1. [프로덕션 환경 준비](#프로덕션-환경-준비)
2. [Docker 배포](#docker-배포)
3. [수동 배포](#수동-배포)
4. [CI/CD 설정](#cicd-설정)
5. [모니터링](#모니터링)

## 프로덕션 환경 준비

### 필수 요구사항

- **서버**: Ubuntu 20.04+ 또는 AWS EC2
- **도메인**: SSL 인증서 (Let's Encrypt 권장)
- **데이터베이스**: PostgreSQL 15+ (AWS RDS 권장)
- **캐시**: Redis 7+ (AWS ElastiCache 권장)
- **스토리지**: AWS S3 (이미지 저장)
- **CDN**: Cloudflare (선택사항)

### 환경 변수 설정

#### Backend (.env)

```bash
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/orderbean

# Redis
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=24h

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=orderbean-images-prod

# Toss Payments
TOSS_PAYMENTS_SECRET_KEY=your_production_secret_key

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# SendGrid
SENDGRID_API_KEY=your_api_key

# CORS
CORS_ORIGIN=https://orderbean.com
```

#### Frontend (.env.production)

```bash
VITE_API_URL=https://api.orderbean.com/api/v1
VITE_WS_URL=wss://api.orderbean.com
```

## Docker 배포

### 1. 프로덕션 Docker Compose

`docker-compose.prod.yml` 생성:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    depends_on:
      - backend
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    restart: always

volumes:
  postgres_data:
  redis_data:
```

### 2. 프로덕션 Dockerfile

#### Backend (Dockerfile.prod)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm run prisma:generate

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
```

#### Frontend (Dockerfile.prod)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. 배포 실행

```bash
# 프로덕션 환경 변수 설정
export DB_USER=orderbean
export DB_PASSWORD=secure_password
export DB_NAME=orderbean

# 배포
docker-compose -f docker-compose.prod.yml up -d

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

## 수동 배포

### 1. 서버 준비

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL 설치
sudo apt install postgresql postgresql-contrib -y

# Redis 설치
sudo apt install redis-server -y

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2
```

### 2. Backend 배포

```bash
# 프로젝트 클론
git clone <repository-url>
cd OrderBean/backend

# 의존성 설치
npm ci --production

# 환경 변수 설정
cp env.example .env
# .env 파일 편집

# Prisma 설정
npm run prisma:generate
npm run prisma:migrate deploy

# 빌드
npm run build

# PM2로 실행
pm2 start dist/index.js --name orderbean-backend
pm2 save
pm2 startup
```

### 3. Frontend 배포

```bash
cd ../frontend

# 의존성 설치
npm ci

# 빌드
npm run build

# Nginx 설정
sudo cp -r dist/* /var/www/html/
```

### 4. Nginx 설정

`/etc/nginx/sites-available/orderbean`:

```nginx
server {
    listen 80;
    server_name orderbean.com www.orderbean.com;

    # SSL 리다이렉트
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name orderbean.com www.orderbean.com;

    ssl_certificate /etc/letsencrypt/live/orderbean.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/orderbean.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Nginx 활성화
sudo ln -s /etc/nginx/sites-available/orderbean /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL 인증서 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx -y

# SSL 인증서 발급
sudo certbot --nginx -d orderbean.com -d www.orderbean.com

# 자동 갱신 설정
sudo certbot renew --dry-run
```

## CI/CD 설정

### GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: |
          cd backend
          npm test
      
      - name: Build
        run: |
          cd backend
          npm run build
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/orderbean/backend
            git pull
            npm ci --production
            npm run prisma:migrate deploy
            pm2 restart orderbean-backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build
        run: |
          cd frontend
          npm run build
      
      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "frontend/dist/*"
          target: "/var/www/html"
```

## 모니터링

### PM2 모니터링

```bash
# 프로세스 상태 확인
pm2 status

# 로그 확인
pm2 logs orderbean-backend

# 모니터링 대시보드
pm2 monit

# 메트릭 확인
pm2 describe orderbean-backend
```

### 로그 관리

```bash
# 로그 로테이션 설정
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 헬스 체크

```bash
# 헬스 체크 엔드포인트
curl http://localhost:3000/health

# 응답:
# {"status":"ok","timestamp":"2024-12-15T14:30:00Z"}
```

### 데이터베이스 백업

```bash
# 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U orderbean orderbean > /backup/orderbean_$DATE.sql

# cron 설정 (매일 자정)
0 0 * * * /path/to/backup.sh
```

## 성능 최적화

### Nginx 캐싱

```nginx
# 정적 파일 캐싱
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN 설정

Cloudflare를 사용하는 경우:
1. DNS 설정: A 레코드를 서버 IP로 설정
2. SSL/TLS: Full (strict) 모드
3. 캐싱 규칙 설정

## 보안 체크리스트

- [ ] 환경 변수에 민감한 정보 저장
- [ ] JWT 시크릿 키 강력하게 설정
- [ ] HTTPS 사용
- [ ] CORS 설정 확인
- [ ] Rate limiting 활성화
- [ ] SQL injection 방지 (Prisma 사용)
- [ ] XSS 방지 (입력 검증)
- [ ] 정기적인 보안 업데이트
- [ ] 방화벽 설정
- [ ] 로그 모니터링

