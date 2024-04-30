const express = require("express");
const route = express.Router();
const classroomsController = require("../controllers/ClassroomControllers");

route.get("/", classroomsController.getAllClassrooms);

module.exports = route;
