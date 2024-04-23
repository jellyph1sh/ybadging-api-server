const Database = require("../../database.js");
const bcrypt = require("bcrypt");
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

exports.getAllProfessors = async (req, res) => {
  try {
    // Si vous avez un champ de permission pour différencier les professeurs
    const result = await Database.Read(
      DB_PATH,
      "SELECT id, firstname, lastname FROM users WHERE permission = 1" // Par exemple, permission = 1 pour les professeurs
    );

    if (result instanceof Error) {
      throw result;
    }

    res.status(200).json({
      status: true,
      professors: result,
    });
  } catch (error) {
    console.error("Error retrieving professors:", error);
    res.status(500).json({
      status: false,
      error: "Internal server error while retrieving professors",
    });
  }
};

exports.addUser = async (req, res) => {
  const { firstname, lastname, email, password, permission } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({
      status: false,
      error: "Missing required fields: firstname, lastname, email, password",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await Database.Write(
      DB_PATH,
      "INSERT INTO users (firstname, lastname, email, password, permission) VALUES (?, ?, ?, ?, ?)",
      firstname,
      lastname,
      email,
      hashedPassword,
      permission || 1 // Default permission value
    );

    if (result instanceof Error) {
      throw result;
    }

    res.status(201).json({
      status: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      status: false,
      error: "Internal server error while creating user",
    });
  }
};

