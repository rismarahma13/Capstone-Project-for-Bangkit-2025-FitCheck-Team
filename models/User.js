// FITCHECK/models/User.js
const bcrypt = require("bcryptjs");

const User = {
  // Membuat user baru di tabel `users`
  create: async (db, { name, email, password, age, gender }) => {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const [result] = await db.execute(
      // Gunakan db.execute untuk query dengan prepared statements
      "INSERT INTO users (name, email, password, age, gender) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, age, gender]
    );
    // Mengembalikan objek user yang dibuat, termasuk ID yang di-generate oleh MySQL
    return { id: result.insertId, name, email, age, gender };
  },

  // Mencari user berdasarkan email
  findByEmail: async (db, email) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0]; // Mengembalikan baris pertama (user) atau undefined
  },

  // Mencari user berdasarkan ID
  findById: async (db, id) => {
    // Hanya ambil kolom yang aman (tanpa password)
    const [rows] = await db.execute(
      "SELECT id, name, email, age, gender FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // Membandingkan password yang diinput dengan password ter-hash dari database
  matchPassword: async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  // Mengupdate data user
  update: async (db, id, { name, age, gender }) => {
    await db.execute(
      "UPDATE users SET name = ?, age = ?, gender = ? WHERE id = ?",
      [name, age, gender, id]
    );
    // Untuk kesederhanaan, asumsikan update berhasil dan kembalikan data yang diupdate.
    // Dalam aplikasi nyata, Anda mungkin akan fetch ulang data user.
    return { id, name, age, gender };
  },
};

module.exports = User;
