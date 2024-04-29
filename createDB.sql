-- Table des utilisateurs
CREATE TABLE users (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   firstname TEXT NOT NULL,
   lastname TEXT NOT NULL,
   email TEXT NOT NULL UNIQUE,
   password TEXT NOT NULL,
   permission INTEGER DEFAULT 1
);

-- Table des salles de classe
CREATE TABLE classrooms (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL UNIQUE
);

-- Table des promotions
CREATE TABLE promos (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL,
   grade INTEGER
);

-- Table des étudiants
CREATE TABLE students (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   firstname TEXT NOT NULL,
   lastname TEXT NOT NULL,
   email TEXT NOT NULL UNIQUE,
   RFID TEXT UNIQUE,
   id_promo INTEGER,
   FOREIGN KEY(id_promo) REFERENCES promos(id) ON DELETE SET NULL
);

-- Table des leçons
CREATE TABLE lessons (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL,
   date_start TEXT NOT NULL,
   date_end TEXT NOT NULL,
   id_classroom INTEGER,
   id_promo INTEGER,
   FOREIGN KEY(id_classroom) REFERENCES classrooms(id) ON DELETE SET NULL,
   FOREIGN KEY(id_promo) REFERENCES promos(id) ON DELETE SET NULL
);

-- Table des associations entre utilisateurs et leçons
CREATE TABLE users_lessons (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   id_user INTEGER,
   id_lesson INTEGER,
   FOREIGN KEY(id_user) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY(id_lesson) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Table des statuts des étudiants pour les leçons
CREATE TABLE students_status (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   id_lesson INTEGER,
   id_students INTEGER,
   status BOOLEAN,
   FOREIGN KEY(id_lesson) REFERENCES lessons(id) ON DELETE CASCADE,
   FOREIGN KEY(id_students) REFERENCES students(id) ON DELETE CASCADE
);
