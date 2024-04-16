const Database = require("../../database.js");
const DB_PATH = "./database.db";

const moment = require("moment");



exports.test = async (req, res) => {
    console.log("test")
  let users = await Database.Write(
    DB_PATH,
    "SELECT * FROM users"
  );
  res.json({ user: users });
};
