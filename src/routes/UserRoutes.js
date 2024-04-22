const express = require("express");
const router = express.Router();

const user = require("../controllers/UserControllers.js");

router.get("/", user.UserSelect);
router.post("/add", user.UserInsert);

// router.get('/api/:route', (req, res) => {
//     const routeParam = req.params.route;

//   if (isNaN(routeParam)) {
//     return res.status(400).send('Le paramètre de route doit être un nombre.');
//   }

//   next(); // Si c'est un nombre, continuez vers le contrôleur
// }, exampleController.handleGetRequest);

module.exports = router;
