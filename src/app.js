import express from "express";
import cors from "cors";
import { router as apiRoutes } from "./routes/index.js";
import categoryRoutes from "./routes/category.routes.js";

export const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://lovin-candy-web.vercel.app"
  ],
  credentials: true // allow cookies to be sent
};

app.use(cors(corsOptions)); 

app.use(express.json());

//health chech
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api", apiRoutes);

app.use("/api/categories", categoryRoutes);

// 404 Handler
app.use((req, res, next) => {
  const error = new Error (`Not found: ${req.method} ${req.originalUrl}`)
  error.name = "NotFoundError"
  error.status = 404
  next(error);
})

// Global error handler
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
