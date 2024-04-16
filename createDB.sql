CREATE TABLE users (
   id INTEGER,
   firstname TEXT,
   lastname TEXT,
   email TEXT,
   password TEXT,
   permission INTEGER,
   PRIMARY KEY(id)
);

CREATE TABLE classrooms (
   id INTEGER,
   name TEXT,
   PRIMARY KEY(id)
);

CREATE TABLE promos (
   id INTEGER,
   name TEXT,
   grade INTEGER,
   PRIMARY KEY(id)
);

CREATE TABLE students (
   id INTEGER,
   firstname TEXT,
   lastname TEXT,
   email TEXT,
   RFID TEXT,
   id_promo INTEGER,
   FOREIGN KEY(id_promo) REFERENCES promos(id)
);

CREATE TABLE lessons (
   id INTEGER,
   name TEXT,
   date_start TEXT,
   date_end TEXT,
   id_classroom INTEGER,
   id_promo INTEGER,
   FOREIGN KEY(id_classroom) REFERENCES classrooms(id),
   FOREIGN KEY(id_promo) REFERENCES promos(id)
);

CREATE TABLE users_lessons (
   id INTEGER,
   id_user INTEGER,
   id_lesson INTEGER,
   FOREIGN KEY(id_user) REFERENCES users(id),
   FOREIGN KEY(id_lesson) REFERENCES lessons(id)
);

CREATE TABLE students_status (
   id INTEGER,
   id_lesson INTEGER,
   id_students INTEGER,
   status BOOLEAN,
   FOREIGN KEY(id_lesson) REFERENCES lessons(id),
   FOREIGN KEY(id_students) REFERENCES students(id)
);



