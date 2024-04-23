const Database = require("../../database.js");
const DB_PATH = "./database.db";

// Endpoint pour récupérer toutes les leçons
exports.index = async (req, res) => {
  try {
    let lessons = await Database.Read(
      DB_PATH,
      "SELECT * FROM lessons"
    );
    res.json({ lessons: lessons });
  } catch (error) {
    console.error("Error retrieving lessons:", error);
    res.status(500).json({ error: "Error retrieving lessons" });
  }
};

// Endpoint pour créer une leçon
exports.createLesson = async (req, res) => {
  const { name, date_start, date_end, id_classroom, id_promo } = req.body;

  if (!name || !date_start || !date_end || !id_classroom || !id_promo) {
    return res.status(400).json({
      status: false,
      error: "All fields are required: name, date_start, date_end, id_classroom, id_promo",
    });
  }

  try {
    // Créer la leçon
    const result = await Database.Write(
      DB_PATH,
      "INSERT INTO lessons (name, date_start, date_end, id_classroom, id_promo) VALUES (?, ?, ?, ?, ?)",
      name, date_start, date_end, id_classroom, id_promo
    );

    if (result instanceof Error) {
      throw result;
    }

    // Récupérer l'ID de la leçon nouvellement créée
    const newLesson = await Database.Read(
      DB_PATH,
      "SELECT MAX(id) AS id FROM lessons"
    );
    const lessonId = newLesson[0].id;
    console.log (lessonId)

    // Ajouter les étudiants de la promo à la table des statuts
    await addPromoToStatus(id_promo, lessonId);

    return res.status(201).json({
      status: true,
      message: "Lesson created successfully",
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return res.status(500).json({
      status: false,
      error: "Erreur interne lors de la création de la leçon",
    });
  }
};

// Fonction pour ajouter les étudiants d'une promo à la table des statuts
const addPromoToStatus = async (id_promo, id_lesson) => {
  try {
    const students = await Database.Read(
      DB_PATH,
      "SELECT id FROM students WHERE id_promo = ?",
      id_promo
    );

    if (students.length === 0) {
      console.error("Aucun étudiant trouvé pour la promo donnée");
      return;
    }

    const queries = students.map((student) => {
      return Database.Write(
        DB_PATH,
        "INSERT INTO students_status (id_lesson, id_students, status) VALUES (?, ?, ?)",
        id_lesson,
        student.id,
        false
      );
    });

    await Promise.all(queries);
    console.log("Tous les étudiants de la promo ont été ajoutés au statut de la leçon");
  } catch (error) {
    console.error("Erreur lors de l'ajout des étudiants au statut:", error);
  }
};
