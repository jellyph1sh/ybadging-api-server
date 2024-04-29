const Database = require("../../database.js");
const DB_PATH = "./database.db";

exports.getAllPromos = async (req, res) => {
  try {
    const result = await Database.Read(
      DB_PATH,
      "SELECT id, name, grade FROM promos"
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

exports.getPromoAttendanceCounts = async (req, res) => {
  const { id } = req.query; // ID de la promo

  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: false,
      error: "Valid promo ID is required",
    });
  }
  try {
    const result = await Database.Read(
      DB_PATH,
      `
      SELECT 
        SUM(CASE WHEN ss.status = 1 THEN 1 ELSE 0 END) AS total_presences,
        SUM(CASE WHEN ss.status = 0 THEN 1 ELSE 0 END) AS total_absences
      FROM 
        students_status AS ss
      JOIN
        students AS s ON ss.id_students = s.id
      WHERE 
        s.id_promo = ?
      `,
      id // Utilisation du token de liaison pour éviter l'injection SQL
    );

    if (!result || result.length === 0) {
      return res.status(404).json({
        status: false,
        error: "Promo not found or no data available",
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
    console.error("Error retrieving promo attendance counts:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while retrieving promo attendance counts",
    });
  }
};


