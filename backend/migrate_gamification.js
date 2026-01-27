const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const createScoresTable = `
CREATE TABLE IF NOT EXISTS scores (
    user_id INT PRIMARY KEY,
    total_xp INT DEFAULT 0,
    level INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to database.");

    db.query(createScoresTable, (err, result) => {
        if (err) {
            console.error("Error creating scores table:", err);
        } else {
            console.log("Scores table created or already exists.");
        }
        db.end();
    });
});
