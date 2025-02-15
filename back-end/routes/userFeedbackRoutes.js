const express = require("express");
const router = express.Router();
const { submitFeedback, getRoomFeedback } = require("../controllers/userFeedbackController");

router.post("/", submitFeedback);
router.get("/:room_id", getRoomFeedback);

module.exports = router;
