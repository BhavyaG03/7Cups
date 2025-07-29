const express = require("express");
const { saveResponses, getUserResponses, getLatestUserResponses, deleteAll } = require("../controllers/questionController");

const router = express.Router();

router.post("/", saveResponses);
router.get("/:userId", getUserResponses);
router.get("/latest/:userId", getLatestUserResponses);
router.delete("/", deleteAll);


module.exports = router;
