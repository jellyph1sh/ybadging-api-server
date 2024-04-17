CREATE TABLE users (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   firstname TEXT,
   lastname TEXT,
   email TEXT,
   password TEXT,
   permission INTEGER
);

CREATE TABLE classrooms (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT
);

CREATE TABLE promos (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT,
   grade INTEGER
);

CREATE TABLE students (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   firstname TEXT,
   lastname TEXT,
   email TEXT,
   RFID TEXT,
   id_promo INTEGER,
   FOREIGN KEY(id_promo) REFERENCES promos(id)
);

CREATE TABLE lessons (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT,
   date_start TEXT,
   date_end TEXT,
   id_classroom INTEGER,
   id_promo INTEGER,
   FOREIGN KEY(id_classroom) REFERENCES classrooms(id),
   FOREIGN KEY(id_promo) REFERENCES promos(id)
);

CREATE TABLE users_lessons (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   id_user INTEGER,
   id_lesson INTEGER,
   FOREIGN KEY(id_user) REFERENCES users(id),
   FOREIGN KEY(id_lesson) REFERENCES lessons(id)
);

CREATE TABLE students_status (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   id_lesson INTEGER,
   id_students INTEGER,
   status BOOLEAN,
   FOREIGN KEY(id_lesson) REFERENCES lessons(id),
   FOREIGN KEY(id_students) REFERENCES students(id)
);



