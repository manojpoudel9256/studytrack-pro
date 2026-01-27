const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Register
router.post("/register", upload.single("profile_picture"), authController.register);

// Login
router.post("/login", authController.login);

// Get Current User
router.get("/me", authMiddleware.verifyToken, authController.getMe);
router.post("/upload-avatar", authMiddleware.verifyToken, upload.single("profile_picture"), authController.uploadAvatar);
router.put("/update", authMiddleware.verifyToken, authController.updateProfile);

module.exports = router;
