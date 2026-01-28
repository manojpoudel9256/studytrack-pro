const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const db = require("./db");
const bcrypt = require("bcryptjs");

const seedAdminCount = async () => {
    try {
        console.log("🚀 Starting database seed...");

        // 1. Check if admin exists
        const adminEmail = "admin@gmail.com";
        const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [adminEmail]);

        let userId;

        if (users.length > 0) {
            console.log("ℹ️ Admin user already exists.");
            userId = users[0].id;
        } else {
            console.log("🆕 Creating admin user...");
            const hashedPassword = await bcrypt.hash("admin", 10);
            const [result] = await db.promise().query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                ["Admin User", adminEmail, hashedPassword]
            );
            userId = result.insertId;
            console.log(`✅ Admin user created with ID: ${userId}`);
        }

        // 2. Generate Realistic Study Data (Past 30 Days)
        console.log("📅 Generating study records...");

        const categories = ["Programming", "Math", "Reading", "Science", "Writing"];
        const subjects = {
            "Programming": ["React Basics", "Node.js API", "Advanced CSS", "Database Design", "Algorithm Practice"],
            "Math": ["Linear Algebra", "Calculus Review", "Statistics", "Geometry Problems"],
            "Reading": ["History Book", "Technical Documentation", "Novel Study", "Research Papers"],
            "Science": ["Physics Mechanics", "Chemistry Lab", "Biology Notes"],
            "Writing": ["Essay Draft", "Journaling", "Creative Writing"]
        };

        const categoriesJa = ["プログラミング", "数学", "読書", "科学", "ライティング"];
        const subjectsJa = {
            "プログラミング": ["Reactの基礎", "Node.js API開発", "高度なCSS", "データベース設計", "アルゴリズム練習"],
            "数学": ["線形代数", "微積分復習", "統計学", "幾何学問題"],
            "読書": ["歴史書", "技術ドキュメント", "小説", "研究論文"],
            "科学": ["物理学（力学）", "化学実験", "生物学ノート"],
            "ライティング": ["エッセイ下書き", "日記", "クリエイティブライティング"]
        };

        const records = [];
        const today = new Date();

        // Loop through last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Random number of sessions per day (0 to 3)
            const sessionsPerDay = Math.floor(Math.random() * 4);

            // Skip some days to be realistic
            if (Math.random() > 0.8) continue;

            for (let j = 0; j < sessionsPerDay; j++) {
                // Mix English and Japanese (50% chance)
                const useJapanese = Math.random() > 0.5;

                let category, subject, memo;

                if (useJapanese) {
                    category = categoriesJa[Math.floor(Math.random() * categoriesJa.length)];
                    const possibleSubjects = subjectsJa[category];
                    subject = possibleSubjects[Math.floor(Math.random() * possibleSubjects.length)];
                    memo = `${subject}の勉強セッション`;
                } else {
                    category = categories[Math.floor(Math.random() * categories.length)];
                    const possibleSubjects = subjects[category];
                    subject = possibleSubjects[Math.floor(Math.random() * possibleSubjects.length)];
                    memo = `Study session for ${subject}`;
                }

                const duration = Math.floor(Math.random() * (120 - 15 + 1)) + 15; // 15 to 120 mins

                records.push([userId, subject, category, duration, memo, dateStr]);
            }
        }

        if (records.length > 0) {
            const query = "INSERT INTO records (user_id, title, category, duration, memo, record_date) VALUES ?";
            await db.promise().query(query, [records]);
            console.log(`✅ Successfully inserted ${records.length} study records for Admin.`);
        } else {
            console.log("ℹ️ No records to insert.");
        }

        console.log("🎉 Seeding complete!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedAdminCount();
