// history.routes.js
const express = require("express");
const historyController = require("../controllers/history.controller");
const authUser = require("../middlewares/auth.middleware"); // ✅ add this

const router = express.Router();

router.post("/", authUser, historyController.logHistory);       // ✅
router.get("/", authUser, historyController.getHistory);        // ✅
router.get("/weekly", authUser, historyController.getWeeklyHistory); // ✅

module.exports = router;