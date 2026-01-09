import express from "express";
import cors from "cors";

import { authRoutes } from "./routes/auth";
import { projectsRoutes } from "./routes/projects";
import { statsRoutes } from "./routes/stats";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/projects", projectsRoutes);
app.use("/stats", statsRoutes);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
