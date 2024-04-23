const express = require("express");
const router = express.Router();
const userLessonsController = require("../controllers/UsersLessonsControllers");

// Assurez-vous que `userLessonsController` contient la fonction `addUserToLesson`
router.post("/add", userLessonsController.addUserToLesson);

module.exports = router;
