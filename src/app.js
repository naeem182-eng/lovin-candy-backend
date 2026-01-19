import express from "express";

import { router as apiRoutes } from "./routes/index.js";

export const app = express();

app.use(express.json());

app.use("/api", apiRoutes);

// error handling
app.use((req, res, next) => {
  const error = new Error (`Not found: ${req.method} ${req.originalUrl}`)
  error.name = "NotFoundError"
  error.status = 404
  next(error);
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: err.stack,
  })
})
