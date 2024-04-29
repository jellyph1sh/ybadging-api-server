const express = require('express');
const app = express();
app.use(express.json());
const router = require("./src/routes/UserRoutes");
const StudentsRouter = require ("./src/routes/StudentsRoute")
const lessonsRouter = require ("./src/routes/LessonsRoutes")
const UserLessonRouter = require("./src/routes/UsersLessonsRoute");
const promosRouter = require("./src/routes/PromosRoutes"); 
const classroomsRouter = require("./src/routes/ClassroomRoute");


const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;

  if (!apiKey || apiKey !== "SuSj4MVysaqCGGcHmGu7W1KjMmRRP4YucTUiribkRALwq3vF7ziG80JUbVixoy1B") {
    return res.status(403).json({
      status: false,
      error: "Forbidden: Invalid API key",
    });
  }

  next();
};

//app.use(checkApiKey); 


app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header("Access-Control-Allow-Headers","*");
    next();
  });

app.use("/api/user", router);
app.use("/api/students", StudentsRouter);
app.use("/api/lessons", lessonsRouter);
app.use("/api/userLesson", UserLessonRouter);
app.use("/api/promos", promosRouter);
app.use("/api/classroom", classroomsRouter);


app.get('/', (req, res) => {
    res.send('Simple API homepage');
})

app.get('/api', (req,res) => {    res.send("Liste des parkings")});

app.listen(3001, () => {
    console.log("Server running on port 3001");
})