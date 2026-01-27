const express = require("express");
const router = express.Router();
const recordController = require("../controllers/record.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Protected routes
router.get("/leaderboard", verifyToken, recordController.getLeaderboard);
router.get("/", verifyToken, recordController.getAll);
router.post("/", verifyToken, recordController.create);
router.put("/:id", verifyToken, recordController.update);
router.delete("/:id", verifyToken, recordController.remove);

module.exports = router;
