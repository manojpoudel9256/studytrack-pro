const db = require("../db");

// GET all records for logged-in user
exports.getAll = (req, res) => {
    const userId = req.user.id;

    const query =
        "SELECT * FROM records WHERE user_id = ? ORDER BY record_date DESC";

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        return res.json(results);
    });
};

// CREATE new record & Update XP
exports.create = (req, res) => {
    const userId = req.user.id;
    const { title, category, duration, memo, record_date } = req.body;

    if (!title || !duration || !record_date) {
        return res.status(400).json({
            message: "Title, duration, and date are required",
        });
    }

    const insertRecordQuery = `
    INSERT INTO records 
    (user_id, title, category, duration, memo, record_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.query(
        insertRecordQuery,
        [userId, title, category, duration, memo, record_date],
        (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            // Calculate XP (1 min = 10 XP)
            const xpEarned = duration * 10;

            // Upsert Score
            const updateScoreQuery = `
                INSERT INTO scores (user_id, total_xp) 
                VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE total_xp = total_xp + VALUES(total_xp)
            `;

            db.query(updateScoreQuery, [userId, xpEarned], (xpErr) => {
                if (xpErr) {
                    console.error("Failed to update XP:", xpErr);
                    // Don't fail the request if XP fails, just log it
                }

                // Update Level (Simple logic: Level = 1 + XP / 1000)
                const updateLevelQuery = `
                    UPDATE scores SET level = 1 + FLOOR(total_xp / 1000) WHERE user_id = ?
                `;
                db.query(updateLevelQuery, [userId], () => { });

                return res.status(201).json({
                    message: "Record created successfully",
                    xpEarned,
                });
            });
        }
    );
};
// UPDATE record
exports.update = (req, res) => {
    const userId = req.user.id;
    const recordId = req.params.id;
    const { title, category, duration, memo, record_date } = req.body;

    const query = `
    UPDATE records
    SET title=?, category=?, duration=?, memo=?, record_date=?
    WHERE id=? AND user_id=?
  `;

    db.query(
        query,
        [title, category, duration, memo, record_date, recordId, userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Record not found",
                });
            }

            return res.json({
                message: "Record updated successfully",
            });
        }
    );
};

// DELETE record
exports.remove = (req, res) => {
    const userId = req.user.id;
    const recordId = req.params.id;

    const query =
        "DELETE FROM records WHERE id=? AND user_id=?";

    db.query(query, [recordId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Record not found",
            });
        }

        return res.json({
            message: "Record deleted successfully",
        });
    });
};
// GET Leaderboard (Top 10 users by XP)
exports.getLeaderboard = (req, res) => {
    const query = `
      SELECT u.id, u.name, u.profile_picture, s.total_xp, s.level
      FROM users u 
      LEFT JOIN scores s ON u.id = s.user_id 
      WHERE s.total_xp > 0
      ORDER BY s.total_xp DESC 
      LIMIT 10
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(results);
    });
};
