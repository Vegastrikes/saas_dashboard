import { Router } from "express";
import { pool } from "../db/pool";
import { requireAuth } from "../middleware/auth";
import { createProjectSchema, updateProjectSchema, listProjectsQuerySchema } from "../projects/schemas";

export const projectsRoutes = Router();

projectsRoutes.use(requireAuth);

// GET /projects?status=&page=&pageSize=
projectsRoutes.get("/", async (req, res) => {
  const parsed = listProjectsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() });
  }

  const { status, page, pageSize } = parsed.data;
  const ownerId = req.user!.sub;

  const offset = (page - 1) * pageSize;

  const whereClauses: string[] = ["owner_id = $1"];
  const params: any[] = [ownerId];

  if (status) {
    params.push(status);
    whereClauses.push(`status = $${params.length}`);
  }

  const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

  const countSql = `SELECT COUNT(*)::int AS count FROM projects ${whereSql}`;
  const countResult = await pool.query(countSql, params);
  const total = countResult.rows[0]?.count ?? 0;

  params.push(pageSize, offset);
  const listSql = `
    SELECT id, name, status, owner_id, created_at, updated_at
    FROM projects
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;
  const listResult = await pool.query(listSql, params);

  return res.json({
    items: listResult.rows,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
});

// POST /projects
projectsRoutes.post("/", async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const ownerId = req.user!.sub;
  const { name, status } = parsed.data;

  const result = await pool.query(
    `INSERT INTO projects (name, status, owner_id)
     VALUES ($1, $2, $3)
     RETURNING id, name, status, owner_id, created_at, updated_at`,
    [name, status ?? "active", ownerId]
  );

  return res.status(201).json({ project: result.rows[0] });
});

// GET /projects/:id
projectsRoutes.get("/:id", async (req, res) => {
  const ownerId = req.user!.sub;
  const id = req.params.id;

  const result = await pool.query(
    `SELECT id, name, status, owner_id, created_at, updated_at
     FROM projects
     WHERE id = $1 AND owner_id = $2`,
    [id, ownerId]
  );

  const project = result.rows[0];
  if (!project) return res.status(404).json({ error: "Project not found" });

  return res.json({ project });
});

// PUT /projects/:id
projectsRoutes.put("/:id", async (req, res) => {
  const parsed = updateProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const ownerId = req.user!.sub;
  const id = req.params.id;

  const fields: string[] = [];
  const values: any[] = [];

  if (parsed.data.name !== undefined) {
    values.push(parsed.data.name);
    fields.push(`name = $${values.length}`);
  }
  if (parsed.data.status !== undefined) {
    values.push(parsed.data.status);
    fields.push(`status = $${values.length}`);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  values.push(id, ownerId);

  const result = await pool.query(
    `UPDATE projects
     SET ${fields.join(", ")}, updated_at = now()
     WHERE id = $${values.length - 1} AND owner_id = $${values.length}
     RETURNING id, name, status, owner_id, created_at, updated_at`,
    values
  );

  const project = result.rows[0];
  if (!project) return res.status(404).json({ error: "Project not found" });

  return res.json({ project });
});

// DELETE /projects/:id
projectsRoutes.delete("/:id", async (req, res) => {
  const ownerId = req.user!.sub;
  const id = req.params.id;

  const result = await pool.query(
    `DELETE FROM projects
     WHERE id = $1 AND owner_id = $2
     RETURNING id`,
    [id, ownerId]
  );

  if (result.rowCount === 0) return res.status(404).json({ error: "Project not found" });

  return res.status(204).send();
});
