-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 08 Jun 2025 pada 18.24
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fitcheckdb_mysql`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bmirecords`
--

CREATE TABLE `bmirecords` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `height` decimal(5,2) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `bmi` decimal(4,1) NOT NULL,
  `category` varchar(50) NOT NULL,
  `exercise` text NOT NULL,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bmirecords`
--

INSERT INTO `bmirecords` (`id`, `userId`, `name`, `age`, `weight`, `height`, `gender`, `bmi`, `category`, `exercise`, `date`) VALUES
(1, 2, 'Nadila', 24, 55.00, 165.00, 'female', 20.2, 'Normal weight', 'Pertahankan gaya hidup aktif. Lakukan olahraga rutin seperti kardio (jogging, berenang) 3-5 kali seminggu dan latihan kekuatan 2-3 kali seminggu.', '2025-06-08 21:31:32'),
(2, 2, 'Risma', 21, 47.00, 160.00, 'female', 18.4, 'Underweight', 'Fokus pada peningkatan massa otot. Latihan kekuatan dan asupan protein tinggi sangat dianjurkan. Konsultasi gizi untuk penambahan berat badan sehat.', '2025-06-08 22:06:12'),
(3, 2, 'Tisna Rizqiana', 23, 50.00, 163.00, 'male', 18.8, 'Normal weight', 'Pertahankan gaya hidup aktif. Lakukan olahraga rutin seperti kardio (jogging, berenang) 3-5 kali seminggu dan latihan kekuatan 2-3 kali seminggu.', '2025-06-08 23:08:24'),
(4, 2, 'ela', 35, 67.00, 149.00, 'female', 30.2, 'Obesity Class I', 'Kombinasi latihan kardio dan kekuatan. Mulai dengan intensitas rendah hingga sedang, tingkatkan perlahan. Penting untuk konsisten dan didampingi profesional.', '2025-06-08 23:11:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `age`, `gender`, `createdAt`) VALUES
(1, 'Risma Rahmatul Ummah', 'rismarahmatulummah1@gmail.com', '$2a$10$K59qbo0pYYppoLGYwMlX3.qL3VPr5UVT1woJ2oPL3JgyO9Dw9fFSC', 22, 'female', '2025-06-08 21:27:46'),
(2, 'nadila', 'nadila@gmail.com', '$2a$10$bjpodDy8cAcDAjKRIvbT3OucmWDj.wkbwQBLlO4I4hFDcHtawtqBi', 23, 'female', '2025-06-08 21:30:19'),
(3, 'ama', 'ama@gmail.com', '$2a$10$R1./PPDBcpaCo6pS803OWegdYNQflgxK0cofbsTU9gVV7hTtuepw2', 22, 'female', '2025-06-08 23:12:40');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bmirecords`
--
ALTER TABLE `bmirecords`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bmirecords`
--
ALTER TABLE `bmirecords`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bmirecords`
--
ALTER TABLE `bmirecords`
  ADD CONSTRAINT `bmirecords_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
