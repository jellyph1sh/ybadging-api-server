const Database = require("../../database.js");
const DB_PATH = "./database.db";

exports.getAllClassrooms = async (req, res) => {
  try {
    const result = await Database.Read(
      DB_PATH,
      "SELECT id, name FROM classrooms"
    );
    if (result instanceof Error) {
      throw result;
    }
    res.status(200).json({
      status: true,
      classrooms: result,
    });
  } catch (error) {
    console.error("Error retrieving classrooms:", error);
    res.status(500).json({
      status: false,
      error: "Internal server error while retrieving classrooms",
    });
  }
};
