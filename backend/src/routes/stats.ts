import { Router } from "express";
import { pool } from "../db/pool";
import { requireAuth } from "../middleware/auth";

export const statsRoutes = Router();

statsRoutes.use(requireAuth);

// GET /stats
statsRoutes.get("/", async (req, res) => {
  const ownerId = req.user!.sub;

  const result = await pool.query(
    `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'active')::int AS active,
      COUNT(*) FILTER (WHERE status = 'paused')::int AS paused,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
    FROM projects
    WHERE owner_id = $1
    `,
    [ownerId]
  );

  return res.json(result.rows[0]);
});
