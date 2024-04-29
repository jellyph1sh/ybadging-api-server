const express = require("express");
const router = express.Router();
const promosController = require("../controllers/PromosControllers"); 

router.get("/", promosController.getAllPromos);
router.get("/promo-attendance/", promosController.getPromoAttendanceCounts)

module.exports = router;
