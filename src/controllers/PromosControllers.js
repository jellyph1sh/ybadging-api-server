const Database = require("../../database.js");
const DB_PATH = "./database.db";

exports.getAllPromos = async (req, res) => {
  try {
    const result = await Database.Read(
      DB_PATH,
      "SELECT id, name FROM promos"
    );
    if (result instanceof Error) {
      throw result;
    }
    res.status(200).json({
      status: true,
      promos: result,
    });
  } catch (error) {
    console.error("Error retrieving promos:", error);
    res.status(500).json({
      status: false,
      error: "Internal server error while retrieving promos",
    });
  }
};
