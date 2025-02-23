const express = require("express");
const { saveResponses, getUserResponses,deleteAll } = require("../controllers/questionController");

const router = express.Router();

router.post("/", saveResponses);
router.get("/:userId", getUserResponses);
router.delete("/", deleteAll);


module.exports = router;
