const express = require('express');
const app = express();
app.use(express.json());
const router = require("./src/routes/routes");


app.use("/", router);

app.get('/', (req, res) => {
    res.send('Simple API homepage');
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})