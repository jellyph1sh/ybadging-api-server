const Database = require("../../database.js");
const DB_PATH = "./database.db";



exports.UserSelect = async (req, res) => {
    console.log("Fetching users");
    try {
        let users = await Database.Read(
            DB_PATH,
            "SELECT * FROM users"
        );
        res.json({ users: users });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
};


exports.UserInsert = async (req, res) => {
  const insert = req.body;
  const err = await Database.Write(
    DB_PATH,
    "INSERT INTO classrooms(name) VALUES(?);",
    insert.name
  );
  if (err != null) {
    console.error(err);
    res.json({ status: false });
    return;
  }
  console.log("has been successfully add");
  res.json({ status: true });
};
