const express = require("express");
const StudentsRouter = express.Router();
const students =require ("../controllers/StudentsControllers.js")

StudentsRouter.put('/rfid', students.updateRFID);

module.exports = StudentsRouter;
