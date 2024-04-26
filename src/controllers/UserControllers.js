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

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      error: "Email and password are required",
    });
  }
  
  try {
    const user = await Database.Read(
      DB_PATH,
      "SELECT * FROM users WHERE email = ?",
      email
    );
    if (user.length === 0) {
      return res.status(404).json({
        status: false,
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch && !password == user[0].password) {
      return res.status(401).json({
        status: false,
        error: "Incorrect password",
      });
    }
    res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        id: user[0].id,
        firstname: user[0].firstname,
        lastname: user[0].lastname,
        email: user[0].email,
        permission: user[0].permission,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: false,
      error: "Internal server error during login",
    });
  }
};