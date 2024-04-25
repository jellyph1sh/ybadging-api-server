const express = require("express");
const router = express.Router();
const userLessonsController = require("../controllers/UsersLessonsControllers");


router.post("/add", userLessonsController.addUserToLesson);

module.exports = router;
