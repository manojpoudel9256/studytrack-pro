const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const db = require("./db");

const syncLeaderboard = async () => {
    try {
        console.log("🚀 Starting leaderboard sync...");

        // 1. Get all users
        const [users] = await db.promise().query("SELECT id, name FROM users");

        for (const user of users) {
            // 2. Calculate total duration from records
            const [rows] = await db.promise().query(
                "SELECT SUM(duration) as total_duration FROM records WHERE user_id = ?",
                [user.id]
            );

            const totalDuration = rows[0].total_duration || 0;
            const totalXP = totalDuration * 10; // 1 min = 10 XP
            const level = 1 + Math.floor(totalXP / 1000);

            console.log(`👤 User: ${user.name} | Duration: ${totalDuration}m | XP: ${totalXP} | Level: ${level}`);

            // 3. Upsert into scores table
            const query = `
                INSERT INTO scores (user_id, total_xp, level)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE total_xp = VALUES(total_xp), level = VALUES(level)
            `;

            await db.promise().query(query, [user.id, totalXP, level]);
        }

        console.log("✅ Leaderboard synced successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Sync failed:", error);
        process.exit(1);
    }
};

syncLeaderboard();
