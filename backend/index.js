import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // Updated import

// Utilities
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

// Connect to Database
connectDB().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

const allowedOrigins = ["https://e-commerce-frontend-iota-hazel.vercel.app"];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Enable if you need to pass cookies
};

app.use(cors(corsOptions));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Static file serving
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Server running on port: ${port}`));

export default app; // Use ES module syntax
