const express = require("express");
const router = express.Router();

const test = require("../controllers/test.js");

router.get("/testSelect", test.testSelect);
router.post("/testInsert", test.testInsert);

module.exports = router;
