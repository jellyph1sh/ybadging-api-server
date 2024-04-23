const express = require('express');
const app = express();
app.use(express.json());
const router = require("./src/routes/UserRoutes");
const StudentsRouter = require ("./src/routes/StudentsRoute")
const lessonsRouter = require ("./src/routes/LessonsRoutes")

app.use("/api/user", router);
app.use("/api/students", StudentsRouter);
app.use("/api/lessons", lessonsRouter);

app.get('/', (req, res) => {
    res.send('Simple API homepage');
})

app.get('/api', (req,res) => {    res.send("Liste des parkings")});

app.listen(3000, () => {
    console.log("Server running on port 3000");
})