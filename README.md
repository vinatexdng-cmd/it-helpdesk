# Vinatex IT Helpdesk WebApp

Webapp Next.js dành cho IT Helpdesk, đọc Knowledge Base, troubleshooting cases và scripts trực tiếp từ repository.

## Chạy local
```bash
pnpm install
pnpm dev
```

## Deploy Vercel
Import repository vào Vercel và dùng mặc định Next.js. Thiết lập GITHUB_REPOSITORY, GITHUB_BRANCH và GITHUB_TOKEN. GITHUB_TOKEN chỉ được dùng server-side.

## Roadmap
- Ticket/Incident + SLA
- PostgreSQL persistence
- SSO + RBAC
- Audit log
- AI Helpdesk có trích nguồn KB
- Ticket -> Knowledge Base