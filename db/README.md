# PostgreSQL schema

Chạy file này trên PostgreSQL/Neon/Supabase sau khi tạo database.

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Không sử dụng pg_search; schema dùng PostgreSQL chuẩn.