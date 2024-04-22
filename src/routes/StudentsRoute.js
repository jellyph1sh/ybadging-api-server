const express = require("express");
const StudentsRouter = express.Router();
const students = require ("../controllers/StudentsControllers.js")

StudentsRouter.put('/update/rfid', students.updateRFID);
StudentsRouter.post('/find',students.findStudentRFID)
StudentsRouter.get('/',students.index)


module.exports = StudentsRouter;
