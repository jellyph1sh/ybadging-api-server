const express = require("express");
const StudentsRouter = express.Router();
const students = require ("../controllers/StudentsControllers.js")

StudentsRouter.put('/update/rfid', students.updateRFID);
StudentsRouter.post('/find',students.findStudentRFID)
StudentsRouter.get('/',students.index)
StudentsRouter.put("/rfid/status", students.updateStudentStatusRFID);
StudentsRouter.get("/lesson", students.studentsForLesson);
StudentsRouter.get("/add", students.createStudent);
StudentsRouter.put("/status", students.updateStudentStatus);



module.exports = StudentsRouter;
