const express = require("express");
const route = express.Router();
const Lessons = require ("../controllers/LessonsControllers.js")


route.post('/add',Lessons.createLesson);
route.get('/',Lessons.index);
route.get('/getLessons',Lessons.getLessons);


module.exports = route;