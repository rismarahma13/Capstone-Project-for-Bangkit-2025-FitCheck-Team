// FITCHECK/server/app.js
const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("../config/db");
let db;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB()
  .then((pool) => {
    db = pool;
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use(express.static(path.join(__dirname, "..", "public")));

    const authRoutes = require("../routes/auth");
    const bmiRoutes = require("../routes/bmi");

    app.use("/api/auth", authRoutes);
    app.use("/api/bmi", bmiRoutes);

    // Pastikan baris ini tidak ada kesalahan penulisan, misalnya app.get('/*', ...), dll.
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "public", "index.html"));
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access app at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start server due to database connection error:",
      err
    );
    process.exit(1);
  });
