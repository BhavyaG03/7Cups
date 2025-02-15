const express = require("express");
const { saveResponses, getUserResponses } = require("../controllers/questionController");

const router = express.Router();

router.post("/", saveResponses);
router.get("/:userId", getUserResponses);

module.exports = router;
