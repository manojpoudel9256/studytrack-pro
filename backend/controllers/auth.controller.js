const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const heicConvert = require("heic-convert");

const processProfilePicture = async (file) => {
    if (!file) return null;

    const ext = path.extname(file.filename).toLowerCase();
    if (ext === '.heic' || ext === '.heif') {
        try {
            const inputBuffer = fs.readFileSync(file.path);
            const outputBuffer = await heicConvert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 1
            });

            const newFilename = file.filename.replace(/\.(heic|heif)$/i, '.jpg');
            const newPath = path.join(file.destination, newFilename);

            fs.writeFileSync(newPath, outputBuffer);
            fs.unlinkSync(file.path); // Remove original HEIC

            return `/uploads/${newFilename}`;
        } catch (error) {
            console.error("HEIC conversion failed:", error);
            // Fallback: return original if conversion fails (though browser won't show it)
            return `/uploads/${file.filename}`;
        }
    }
    return `/uploads/${file.filename}`;
};

// REGISTER
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        if (results.length > 0) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const insertQuery =
            "INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)";

        db.query(insertQuery, [name, email, hashedPassword, profile_picture], (err) => {
            if (err) return res.status(500).json({ message: err.message });

            return res.status(201).json({
                message: "User registered successfully",
            });
        });
    });
};

// LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const user = results[0];

        const isPasswordValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profile_picture: user.profile_picture
            },
        });
    });
};

// GET CURRENT USER
exports.getMe = (req, res) => {
    // req.user is set by auth middleware
    const query = "SELECT id, name, email, profile_picture, created_at FROM users WHERE id = ?";

    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];
        res.json(user);
    });
};

// UPLOAD AVATAR (UPDATE)
exports.uploadAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const profile_picture = await processProfilePicture(req.file);
    const query = "UPDATE users SET profile_picture = ? WHERE id = ?";

    db.query(query, [profile_picture, req.user.id], (err) => {
        if (err) return res.status(500).json({ message: err.message });

        res.json({
            message: "Profile picture updated successfully",
            profile_picture
        });
    });
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user.id; // From middleware

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    if (name.length > 25) {
        return res.status(400).json({ message: "Name must be 25 characters or less" });
    }

    // Check for email duplicates if email is changing
    const checkEmailQuery = "SELECT * FROM users WHERE email = ? AND id != ?";
    db.query(checkEmailQuery, [email, userId], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        if (results.length > 0) {
            return res.status(409).json({ message: "Email already in use" });
        }

        // Prepare update
        let updateQuery = "UPDATE users SET name = ?, email = ? WHERE id = ?";
        let queryParams = [name, email, userId];

        if (password) {
            // Include password update if provided
            const hashedPassword = bcrypt.hashSync(password, 10);
            updateQuery = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
            queryParams = [name, email, hashedPassword, userId];
        }

        db.query(updateQuery, queryParams, (updateErr) => {
            if (updateErr) return res.status(500).json({ message: updateErr.message });

            res.json({ message: "Profile updated successfully" });
        });
    });
};
