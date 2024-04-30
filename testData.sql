INSERT INTO users (firstname,lastname ,email, password, permission)
VALUES 
    ("John","Doe","john.doe@test.fr","$2b$10$6A4Tvy.1d3FPBr5f/zwA7ekYuVf0agstW4qJrTCUhSUn7GxfXCWzO",0),
    ("Mathilde","Aragon","mathilde.aragon@test.fr","$2b$10$6A4Tvy.1d3FPBr5f/zwA7ekYuVf0agstW4qJrTCUhSUn7GxfXCWzO",0),
    ("Bob","Lenon","bob.lenon@test.fr","$2b$10$6A4Tvy.1d3FPBr5f/zwA7ekYuVf0agstW4qJrTCUhSUn7GxfXCWzO",1),
    ("Dimitri","Dupuit","Dimitri.Dupuit@test.fr","$2b$10$6A4Tvy.1d3FPBr5f/zwA7ekYuVf0agstW4qJrTCUhSUn7GxfXCWzO",1);

INSERT INTO classrooms (name)
VALUES 
    ("102"),
    ("304"),
    ("205"),
    ("101");

INSERT INTO promos (name,grade)
VALUES 
    ("info",1),
    ("info",2),
    ("archi",1),
    ("archi",2),
    ("commerce",1),
    ("commerce",2),
    ("audio",1),
    ("audio",2);

INSERT INTO students (firstname,lastname ,email, RFID, id_promo)
VALUES 
    ("Alice", "Smith", "alice.smith@test.fr", "BE 12 3C CD", 1),
    ("Bob", "Johnson", "bob.johnson@test.fr", "CF 23 4D DE", 1),
    ("Emily", "Williams", "emily.williams@test.fr", "DF 34 5E EF", 2),
    ("Michael", "Brown", "michael.brown@test.fr", "EA 45 6F FA", 2),
    ("Sophia", "Jones", "sophia.jones@test.fr", "FB 56 7A AB", 3),
    ("William", "Davis", "william.davis@test.fr", "GC 67 8B BC", 3),
    ("Emma", "Miller", "emma.miller@test.fr", "HD 78 9C CD", 4),
    ("James", "Wilson", "james.wilson@test.fr", "IE 89 AB DE", 4),
    ("Olivia", "Taylor", "olivia.taylor@test.fr", "JF 90 BC EF", 5),
    ("Daniel", "Anderson", "daniel.anderson@test.fr", "KG 01 CD FA", 5),
    ("Isabella", "Martinez", "isabella.martinez@test.fr", "LH 78 2D BC", 6),
    ("Ethan", "Hernandez", "ethan.hernandez@test.fr", "MI 89 3E CD", 6),
    ("Ava", "Garcia", "ava.garcia@test.fr", "NJ 90 4F DE", 7),
    ("Alexander", "Lopez", "alexander.lopez@test.fr", "OK 01 5A EF", 7);


INSERT INTO lessons (name,date_start, date_end ,id_classroom, id_promo)
VALUES 
    ("UX Design", "02/04/2024 15:00:00", "02/04/2024 16:00:00", 1,2),
    ("Introduction to Programming", "03/04/2024 09:00:00", "03/04/2024 11:00:00", 3, 1),
    ("Data Structures and Algorithms", "05/04/2024 10:00:00", "05/04/2024 12:00:00", 2, 3),
    ("Digital Marketing Strategies", "07/04/2024 14:00:00", "07/04/2024 16:00:00", 3, 4),
    ("Business Ethics", "09/04/2024 13:00:00", "09/04/2024 15:00:00", 1, 5),
    ("Creative Writing Workshop", "11/04/2024 15:00:00", "11/04/2024 17:00:00", 2, 6);

INSERT INTO users_lessons (id_user,id_lesson)
VALUES 
    (1,1),
    (2,2),
    (3,3),
    (4,4),
    (1,5),
    (2,6);

INSERT INTO students_status (id_lesson, id_students, status)
VALUES 
    (1, 2, TRUE),
    (2, 3, TRUE),
    (3, 4, FALSE),
    (4, 5, TRUE),
    (5, 6, FALSE),
    (6, 7, TRUE),
    (1, 8, FALSE),
    (2, 9, TRUE),
    (3, 10, FALSE),
    (4, 11, TRUE),
    (5, 12, TRUE),
    (6, 13, FALSE),
    (1, 14, TRUE);