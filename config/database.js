// config/database.js
const { Sequelize } = require("sequelize"); // Mengimpor kelas Sequelize

// Menentukan environment (lingkungan) aplikasi. Jika tidak diatur, defaultnya adalah 'development'.
const env = process.env.NODE_ENV || "development";

let dbConfig; // Variabel untuk menyimpan konfigurasi database yang akan digunakan

// Konfigurasi database akan selalu diambil dari Environment Variables (process.env).
// Ini berlaku baik untuk lingkungan development (lokal) maupun production (Render.com).
dbConfig = {
  username: process.env.DB_USER, // Nama pengguna database, diambil dari variabel lingkungan DB_USER
  password: process.env.DB_PASSWORD, // Kata sandi database, diambil dari variabel lingkungan DB_PASSWORD
  database: process.env.DB_NAME, // Nama database, diambil dari variabel lingkungan DB_NAME
  host: process.env.DB_HOST, // Host database, diambil dari variabel lingkungan DB_HOST
  dialect: "mysql", // Dialek database yang digunakan adalah MySQL
  port: process.env.DB_PORT || 3306, // Port database, diambil dari DB_PORT atau default 3306
  define: {
    timestamps: true, // Sequelize secara otomatis menambahkan kolom createdAt dan updatedAt
    underscored: true, // Menggunakan gaya penamaan snake_case untuk kolom (misal: created_at)
  },
  // Mengaktifkan logging SQL (menampilkan query di konsol) hanya saat di lingkungan development
  logging: env === "development",
};

// Membuat instance Sequelize dengan konfigurasi yang sudah ditentukan
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    define: dbConfig.define,
    logging: dbConfig.logging,
    // dialectOptions: { // Opsi tambahan untuk koneksi, jika diperlukan (misalnya SSL untuk beberapa penyedia hosting)
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false
    //   }
    // }
  }
);

// Fungsi asinkron untuk melakukan autentikasi (tes koneksi) ke database
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Mencoba terhubung ke database
    console.log("MySQL Connected successfully"); // Pesan sukses jika koneksi berhasil
  } catch (error) {
    console.error(
      `Failed to start server due to database connection error: ${error.message}`
    ); // Pesan error jika koneksi gagal
    process.exit(1); // Menghentikan proses aplikasi jika koneksi database gagal
  }
};

// Mengekspor instance sequelize dan fungsi connectDB agar dapat digunakan di bagian lain aplikasi
module.exports = { sequelize, connectDB };
