const express = require("express");
const router = express.Router();
const { submitListenerFeedback, getListenerFeedbackForRoom,deleteAll } = require("../controllers/listenerFeedbackController");

router.post("/", submitListenerFeedback);
router.get("/:room_id", getListenerFeedbackForRoom);
router.delete("/", deleteAll);
module.exports = router;
