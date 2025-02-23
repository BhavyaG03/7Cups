const express = require("express");
const router = express.Router();
const { submitFeedback, getRoomFeedback,deleteAll } = require("../controllers/userFeedbackController");

router.post("/", submitFeedback);
router.get("/:room_id", getRoomFeedback);
router.delete("/", deleteAll);


module.exports = router;
