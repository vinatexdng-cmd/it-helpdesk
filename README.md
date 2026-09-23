# Vinatex IT Helpdesk WebApp

Webapp Next.js dành cho IT Helpdesk, có Knowledge Base, Ticket/Incident, SLA, Audit Log và AI Copilot.

## Chạy local
```bash
pnpm install
pnpm dev
```

## PostgreSQL
Thiết lập `DATABASE_URL`, sau đó chạy:
```bash
psql "$DATABASE_URL" -f db/schema.sql
```
Schema chỉ dùng PostgreSQL/pgcrypto, không yêu cầu `pg_search`.

## Authentication & RBAC
Session dùng cookie HTTP-only, ký HMAC-SHA256 và có thời hạn 8 giờ.

- `user`: tạo, xem và comment ticket của chính mình.
- `it`: xem và xử lý toàn bộ ticket.
- `admin`: toàn quyền nghiệp vụ hiện tại.

Bắt buộc cấu hình `AUTH_SECRET` dài tối thiểu 32 ký tự trên Vercel.

Để tạo tài khoản ban đầu, tạo password hash bằng Node.js rồi INSERT vào bảng `users`. Không commit password/hash vào Git:
```js
const { randomBytes, scryptSync } = require("node:crypto");
const password = "THAY_MAT_KHAU";
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(salt.toString("hex") + ":" + hash.toString("hex"));
```

Sau khi có hash:
```sql
INSERT INTO users(email,name,password_hash,role)
VALUES ('it-admin@vinatex.local','IT Admin','SALT:HASH','admin');
```

## SLA
Bảng `sla_policies` được tạo cùng schema với mặc định:
- Critical: 60 phút
- High: 240 phút
- Normal: 480 phút
- Low: 1440 phút

Đây là giá trị mặc định vận hành; có thể điều chỉnh:
```sql
UPDATE sla_policies SET target_minutes=120 WHERE priority='Critical';
```
Ticket mới tự tính `sla_due_at` theo priority nếu không truyền thời hạn riêng.

## Deploy Vercel
Thiết lập:
- `DATABASE_URL`
- `AUTH_SECRET`
- `GITHUB_REPOSITORY`
- `GITHUB_BRANCH`
- `GITHUB_TOKEN` nếu repository private
- `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` nếu dùng AI Copilot.

Không đưa password hoặc API key vào client-side environment.

## Tính năng hiện có
- Dashboard thống kê ticket theo quyền.
- Ticket/Incident CRUD cơ bản.
- Ticket number atomic theo năm.
- SLA tự tính theo priority.
- Audit log khi tạo/cập nhật/comment.
- Authentication + RBAC.
- Knowledge Base từ GitHub.
- AI Helpdesk Copilot có trích nguồn KB.
