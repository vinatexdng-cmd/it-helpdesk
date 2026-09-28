import { randomBytes, scryptSync } from "node:crypto";
import pg from "pg";

const { Pool } = pg;

const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const name = String(process.env.ADMIN_NAME || "Vinatex IT Admin").trim();
const password = String(process.env.ADMIN_PASSWORD || "");

if (!email || !email.includes("@")) throw new Error("ADMIN_EMAIL is required");
if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters");

const salt = randomBytes(16);
const passwordHash = salt.toString("hex") + ":" + scryptSync(password, salt, 64).toString("hex");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  const result = await pool.query(
    `INSERT INTO users(email, name, password_hash, role, active)
     VALUES ($1, $2, $3, 'admin', true)
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name,
                   password_hash = EXCLUDED.password_hash,
                   role = 'admin',
                   active = true,
                   updated_at = NOW()
     RETURNING id, email, name, role, active`,
    [email, name, passwordHash],
  );

  console.log("Admin account ready:", result.rows[0]);
} finally {
  await pool.end();
}
