const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
require("./db");

const authRoutes = require("./routes/auth.routes");
const recordRoutes = require("./routes/record.routes");
const weatherRoutes = require("./routes/weather.routes");


const app = express();

app.use(cors());
app.use(express.json()); // ✅ MUST be here
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/weather", weatherRoutes);

app.get("/", (req, res) => {
    res.send("StudyTrack Pro API is running");
});

// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File is too large. Max limit is 5MB." });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // Unknown error
        console.error(err);
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
