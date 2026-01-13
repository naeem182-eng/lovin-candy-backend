import { connectDB } from "./config/mongodb.js";
import { app } from "./app.js";

const port = 3000;

try {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
} catch (error) {
  console.error("Startup failed", error);
  process.exit(1);
}