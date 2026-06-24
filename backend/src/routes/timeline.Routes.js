// routes/timeline.routes.js — make sure this exists
const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/auth.middleware');
const { updateTimelineNote } = require('../controllers/timeline.controller');

// ✅ Must be PATCH, not PUT or POST
router.patch('/:id', authUser, updateTimelineNote);


module.exports = router;