const express = require("express");
const router = express.Router();
const { submitListenerFeedback, getListenerFeedbackForRoom } = require("../controllers/listenerFeedbackController");

router.post("/", submitListenerFeedback);
router.get("/:room_id", getListenerFeedbackForRoom);

module.exports = router;
