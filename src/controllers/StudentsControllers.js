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
