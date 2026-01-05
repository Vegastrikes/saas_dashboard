import { Router } from "express";
import { pool } from "../db/pool";
import { hashPassword, verifyPassword } from "../auth/password";
import { signAccessToken } from "../auth/jwt";
import { loginSchema, registerSchema } from "../auth/schemas";
import { requireAuth } from "../middleware/auth";

export const authRoutes = Router();

/**
 * POST /auth/register
 * body: { email, password }
 */
authRoutes.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const email = parsed.data.email.toLowerCase();
  const passwordHash = await hashPassword(parsed.data.password);

  try {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, role, created_at`,
      [email, passwordHash]
    );

    const user = result.rows[0];
    const token = signAccessToken({ sub: String(user.id), email: user.email, role: user.role });

    return res.status(201).json({ user, token });
  } catch (err: any) {
    // unique violation (email already exists)
    if (err?.code === "23505") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /auth/login
 * body: { email, password }
 */
authRoutes.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password;

  const result = await pool.query(
    `SELECT id, email, role, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  const row = result.rows[0];
  if (!row) return res.status(401).json({ error: "Invalid email or password" });

  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid email or password" });

  const user = { id: row.id, email: row.email, role: row.role, created_at: row.created_at };
  const token = signAccessToken({ sub: String(user.id), email: user.email, role: user.role });

  return res.json({ user, token });
});

/**
 * GET /auth/me
 * header: Authorization: Bearer <token>
 */
authRoutes.get("/me", requireAuth, async (req, res) => {
  const userId = req.user!.sub;

  const result = await pool.query(
    `SELECT id, email, role, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  const user = result.rows[0];
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json({ user });
});
