const Database = require("../../database.js");
const DB_PATH = "./database.db";
const moment = require("moment");


exports.index = async (req, res) => {
  try {
    let students = await Database.Read(
        DB_PATH,
        "SELECT * FROM students"
    );
    res.json({ students: students });
  } catch (error) {
      console.error("Erreur lors de la récupération des étudient:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des étudient" });
  }
}

exports.createStudent = async (req, res) => {
  const { firstname, lastname, email, RFID = null, idPromo } = req.body;
  if (!firstname || !lastname || !email || !idPromo) {
    return res.status(400).json({
      status: false,
      error: "Missing required fields: firstname, lastname, email, idPromo",
    });
  }

  try {
    const result = await Database.Write(
      DB_PATH,
      "INSERT INTO students (firstname, lastname, email, RFID, id_promo) VALUES (?, ?, ?, ?, ?)",
      firstname, lastname, email, RFID, idPromo
    );
    if (result instanceof Error) {
      throw result;
    }
    return res.status(201).json({
      status: true,
      message: "Student created successfully",
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while creating student",
    });
  }
};

exports.studentsForLesson = async (req, res) => {
  const idLesson = req.query;

  if (!idLesson) {
    return res.status(400).json({
      status: false,
      error: "idLesson is required",
    });
  }

  try {
    const result = await Database.Read(
      DB_PATH,
      `SELECT 
         students.id,
         students.firstname,
         students.lastname,
         students_status.status
       FROM 
         students
       LEFT JOIN 
         students_status 
       ON 
         students.id = students_status.id_students 
       WHERE 
         students_status.id_lesson = ?`,
      idLesson.id
    );

    if (result instanceof Error) {
      throw result;
    }

    return res.status(200).json({
      status: true,
      students: result,
    });
  } catch (error) {
    console.error("Error retrieving students for lesson:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while retrieving students for lesson",
    });
  }
};


exports.updateStudentStatus = async (req, res) => {
  const { idLesson, idStudent, status } = req.body;

  if (idLesson === undefined || idStudent === undefined || status === undefined) {
    return res.status(400).json({
      status: false,
      error: "Required fields: idLesson, idStudent, status",
    });
  }

  try {
    const result = await Database.Write(
      DB_PATH,
      "UPDATE students_status SET status = ? WHERE id_lesson = ? AND id_students = ?",
      status, idLesson, idStudent
    );

    if (result instanceof Error) {
      throw result;
    }
    return res.status(200).json({
      status: true,
      message: "Student status updated successfully",
    });
  } catch (error) {
    console.error("Error updating student status:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while updating student status",
    });
  }
};

//_________________________________________________________________
//rfid


exports.updateRFID = async (req, res) => {
  // Check if id and RFID are provided
  const { id, rfid } = req.body;
  if (!id || !rfid) {
    return res.status(400).json({
      status: false,
      error: "You must provide a student ID and a new RFID",
    });
  }
  try {
    const result = await Database.Write(
      DB_PATH,
      "UPDATE students SET RFID = ? WHERE id = ?",
      rfid,
      id
    );

    if (result instanceof Error) {
      throw result;
    }
    console.log("RFID successfully updated for student", id);
    return res.status(200).json({
      status: true,
      message: "RFID successfully updated",
    });
  } catch (error) {
    console.error("Error updating RFID:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while updating RFID",
    });
  }
};

exports.findStudentRFID = async (req, res) => {
  const { rfid } = req.body; 
  if (!rfid) {
    return res.status(400).json({
      status: false,
      error: "RFID is required to find a student",
    });
  }
  try {
    const student = await Database.Read(
      DB_PATH,
      "SELECT * FROM students WHERE RFID = ?",
      rfid
    );
    if (student.length === 0) {
      return res.status(200).json({
        status: false,
        error: "No student found with this RFID",
      });
    }
    return res.status(200).json({
      status: true,
      student: student[0],
    });
  } catch (error) {
    console.error("Error finding student by RFID:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while finding student by RFID",
    });
  }
};

exports.updateStudentStatusRFID = async (req, res) => {
  const { rfid } = req.body;
  if (!rfid) {
    return res.status(400).json({
      status: false,
      error: "RFID is required",
    });
  }
  try {
    const student = await Database.Read(
      DB_PATH,
      "SELECT id FROM students WHERE RFID = ?",
      rfid
    );
    if (student.length === 0) {
      return res.status(404).json({
        status: false,
        error: "No student found with the given RFID",
      });
    }
    const studentId = student[0].id;
    // Trouver la leçon en cours (où la date actuelle est entre date_start et date_end)
    const currentTime = moment().format("DD/MM/YYYY HH:mm:ss");
    const ongoingLesson = await Database.Read(
      DB_PATH,
      "SELECT id FROM lessons WHERE date_start <= ? AND date_end >= ?",
      currentTime,
      currentTime
    );

    if (ongoingLesson.length === 0) {
      return res.status(404).json({
        status: false,
        error: "No lesson in progress",
      });
    }
    const lessonId = ongoingLesson[0].id;
    const result = await Database.Write(
      DB_PATH,
      "UPDATE students_status SET status = ? WHERE id_lesson = ? AND id_students = ?",
      true, // Marque comme présent
      lessonId,
      studentId
    );

    if (result instanceof Error) {
      throw result;
    }

    return res.status(200).json({
      status: true,
      message: "Student status updated for the ongoing lesson",
    });
  } catch (error) {
    console.error("Error updating student status:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while updating student status",
    });
  }
};

exports.getAttendanceCounts = async (req, res) => {
  const { studentId } = req.params; // Récupération de l'ID de l'élève depuis l'URL

  if (!studentId || isNaN(studentId)) {
    return res.status(400).json({
      status: false,
      error: "Valid student ID is required",
    });
  }

  try {
    const result = await Database.Read(
      DB_PATH,
      `
      SELECT 
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS total_presences,
        SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS total_absences
      FROM 
        students_status
      WHERE 
        id_students = ?
      `,
      studentId
    );

    if (!result || result.length === 0) {
      return res.status(404).json({
        status: false,
        error: "Student not found",
      });
    }

    const { total_presences, total_absences } = result[0];

    res.status(200).json({
      status: true,
      data: {
        total_presences,
        total_absences,
      },
    });
  } catch (error) {
    console.error("Error retrieving attendance counts:", error);
    res.status(500).json({
      status: false,
      error: "Internal server error while retrieving attendance counts",
    });
  }
};