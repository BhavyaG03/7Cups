const express = require("express");
const { submitReport, getAllReports,blockUser,deleteAll } = require("../controllers/reportController");

const router = express.Router();
router.post("/", submitReport);
router.get("/", getAllReports);
router.put("/block/:reportId", blockUser);
router.delete("/", deleteAll);


module.exports = router;
