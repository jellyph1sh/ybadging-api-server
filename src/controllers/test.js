const Database = require("../../database.js");
const DB_PATH = "./database.db";

const moment = require("moment");



exports.testSelect = async (req, res) => {
    console.log("test")
  let users = await Database.Write(
    DB_PATH,
    "SELECT * FROM users"
  );
  res.json({ user: users });
};


exports.testInsert = async (req, res) => {
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
