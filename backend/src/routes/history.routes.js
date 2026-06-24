const express = require("express");
const historyController = require("../controllers/history.controller");

const router = express.Router();

router.post("/", historyController.logHistory);
router.get("/", historyController.getHistory);
router.get("/weekly", historyController.getWeeklyHistory);

module.exports = router;