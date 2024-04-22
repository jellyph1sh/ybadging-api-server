const Database = require("../../database.js");
const DB_PATH = "./database.db";


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

exports.findStudentRFID = async (req, res) => {
  const { rfid } = req.body; // Utilisation de req.query pour obtenir les paramètres de requête
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
      return res.status(404).json({
        status: false,
        error: "No student found with this RFID",
      });
    }
    return res.status(200).json({
      status: true,
      student: student[0], // Retourne le premier étudiant trouvé
    });
  } catch (error) {
    console.error("Error finding student by RFID:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while finding student by RFID",
    });
  }
};