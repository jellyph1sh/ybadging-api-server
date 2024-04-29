const express = require("express");
const route = express.Router();
const Lessons = require ("../controllers/LessonsControllers.js")


route.post('/add',Lessons.createLesson);
route.get('/',Lessons.index);
route.get('/getLessons',Lessons.getLessons);
route.get('/getOneLesson',Lessons.getOneLesson);
route.get('/getLessonOnProf',Lessons.getLessonOnProf)
route.delete("/:idLesson", Lessons.deleteLesson);


module.exports = route;