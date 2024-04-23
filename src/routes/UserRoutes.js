const express = require("express");
const router = express.Router();

const user = require("../controllers/UserControllers.js");

router.get("/", user.UserSelect);
router.get("/professor", user.getAllProfessors);
router.post("/add", user.addUser);


module.exports = router;
