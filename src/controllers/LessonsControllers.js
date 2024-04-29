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

exports.getLessons = async (req, res) => {
  try {
     let result = await Database.Read(
      DB_PATH,
      `SELECT
      DISTINCT lessons.id AS id,
      lessons.name AS name,
      lessons.date_start AS dateStart,
      lessons.date_end AS dateEnd,
      promos.name AS namePromo,
      classrooms.name AS nameClassroom
    FROM
      lessons
    LEFT JOIN classrooms ON lessons.id_classroom = classrooms.id
    LEFT JOIN promos ON lessons.id_promo = promos.id
    LEFT JOIN users_lessons ON lessons.id = users_lessons.id_lesson
    LEFT JOIN users ON users_lessons.id_user = users.id`
    );
    if (result instanceof Error) {
      throw result;
    }
    
    result = await printProf(result);
    return res.status(200).json({
      status: true,
      lessons: result,
    });
  } catch (error) {
    console.error("Error retrieving lesson data:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while retrieving lesson data",
    });
  }
};

exports.getOneLesson  = async (req, res) => {
  const idLesson = req.query;
  if (!idLesson) {
    return res.status(400).json({
      status: false,
      error: "All fields are required: idLesson ",
    });
  }
  try {
    let result = await Database.Read(
      DB_PATH,
      `SELECT
      DISTINCT lessons.id AS id,
      lessons.name AS name,
      lessons.date_start AS dateStart,
      lessons.date_end AS dateEnd,
      promos.name AS namePromo,
      classrooms.name AS nameClassroom
    FROM
      lessons
      LEFT JOIN classrooms ON lessons.id_classroom = classrooms.id
      LEFT JOIN promos ON lessons.id_promo = promos.id
      LEFT JOIN users_lessons ON lessons.id = users_lessons.id_lesson
      LEFT JOIN users ON users_lessons.id_user = users.id
     WHERE lessons.id = ?`,
     idLesson.id
    );
    result = await printProf(result);
    if (result instanceof Error) {
      throw result;
    }
    return res.status(200).json({
      status: true,
      lessons: result,
    });
  } catch (error) {
    console.error("Error retrieving lesson data:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while retrieving lesson data",
    });
  }
};

exports.getLessonOnProf  = async (req, res) => {
  const iduser = req.query;
  if (!iduser) {
    return res.status(400).json({
      status: false,
      error: "All fields are required: iduser ",
    });
  }
  try {
    let result = await Database.Read(
      DB_PATH,
      `SELECT
      lessons.id AS id,
      lessons.name AS name,
      lessons.date_start AS dateStart,
      lessons.date_end AS dateEnd,
      promos.name AS namePromo,
      classrooms.name AS nameClassroom
    FROM
      lessons
      LEFT JOIN classrooms ON lessons.id_classroom = classrooms.id
      LEFT JOIN promos ON lessons.id_promo = promos.id
      LEFT JOIN users_lessons ON lessons.id = users_lessons.id_lesson
      LEFT JOIN users ON users_lessons.id_user = users.id
     WHERE users.id = ?`,
     iduser.id
    );
    result = await printProf(result);
    if (result instanceof Error) {
      throw result;
    }
    return res.status(200).json({
      status: true,
      lessons: result,
    });
  } catch (error) {
    console.error("Error retrieving lesson data:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while retrieving lesson data",
    });
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
    const result = await Database.Write(
      DB_PATH,
      "INSERT INTO lessons (name, date_start, date_end, id_classroom, id_promo) VALUES (?, ?, ?, ?, ?)",
      name, date_start, date_end, id_classroom, id_promo
    );

    if (result instanceof Error) {
      throw result;
    }
    const newLesson = await Database.Read(
      DB_PATH,
      "SELECT MAX(id) AS id FROM lessons"
    );
    const lessonId = newLesson[0].id;
    await addPromoToStatus(id_promo, lessonId);
    return res.status(201).json({
      status: true,
      message: "Lesson created successfully",
      lessonId : lessonId,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return res.status(500).json({
      status: false,
      error: "Erreur interne lors de la création de la leçon",
    });
  }
};

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

exports.deleteLesson = async (req, res) => {
  let idLesson = req.query; // Supposons que l'identifiant est passé via l'URL
  idLesson = idLesson.idLesson
  console.log(idLesson)
  if (!idLesson || isNaN(idLesson)) {
    return res.status(400).json({
      status: false,
      error: "Valid idLesson is required",
    });
  }
  
  console.log("Deleting lesson with id:", idLesson); // Confirmer que l'ID est correct
  try {
    const result = await Database.Write(
      DB_PATH,
      "DELETE FROM lessons WHERE id = ?",
      idLesson
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        status: false,
        error: "Lesson not found",
      });
    }
    if (!result || result.changes === 0) {
      console.log("No changes made, lesson not found or deletion failed");
      return res.status(404).json({
        status: false,
        error: "Lesson not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({
      status: false,
      error: "Internal server error while deleting lesson",
    });
  }
};

async function printProf(result) {
  // Pour chaque élément du tableau `result`
  for (const lesson of result) {
    const id = lesson.id; // Identifiant de la leçon

    try {
      // Requête pour récupérer les professeurs associés à une leçon
      const professorsResult = await Database.Read(
        DB_PATH,
        `SELECT
          users.firstname || ' ' || users.lastname AS professor
        FROM
          users_lessons
        JOIN
          users ON users.id = users_lessons.id_user
        WHERE 
          users_lessons.id_lesson = ?`,
        id // Paramètre de liaison
      );
       
      if (professorsResult && professorsResult.length > 0) {
        // Premier professeur
        lesson.professor1 = professorsResult[0].professor;

        if (professorsResult.length > 1) {
          // Deuxième professeur (si présent)
          lesson.professor2 = professorsResult[1].professor;
        } else {
          lesson.professor2 = null;
        }
      } else {
        lesson.professor1 = null; // Si aucun professeur n'est trouvé
        lesson.professor2 = null;
      }
    } catch (error) {
      console.error("Error retrieving professors:", error);
    }
  }
  return result
}
