import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// TODO: mount routes
// app.use("/auth", authRoutes);
// app.use("/projects", projectsRoutes);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
