const mysql = require("mysql2/promise"); // Menggunakan promise API untuk async/await

const connectDB = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT, // tambahkan ini
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log("✅ MySQL Connected successfully");
    return pool;
  } catch (err) {
    console.error("❌ MySQL connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
