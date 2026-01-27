const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function migrate() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database...");

        // Check if column exists
        const [rows] = await connection.execute("SHOW COLUMNS FROM users LIKE 'profile_picture'");

        if (rows.length === 0) {
            await connection.execute("ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL");
            console.log("✅ Added 'profile_picture' column to 'users' table.");
        } else {
            console.log("ℹ️ Column 'profile_picture' already exists.");
        }

        await connection.end();
    } catch (error) {
        console.error("❌ Migration failed:", error.message);
    }
}

migrate();
