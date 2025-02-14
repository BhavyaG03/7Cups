const express = require("express");
const router = express.Router();
const snapController = require("../controllers/snapController");

// Routes
router.post("/", snapController.createSnap);
router.get("/", snapController.getAllSnaps);
router.get("/:id", snapController.getSnapById);
router.delete("/:id", snapController.deleteSnap);

module.exports = router;
