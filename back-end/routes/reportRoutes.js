const express = require("express");
const { submitReport, getAllReports, blockUser } = require("../controllers/reportController");

const router = express.Router();
router.post("/", submitReport);
router.get("/", getAllReports);
router.put("/block/:reportId", blockUser);

module.exports = router;
