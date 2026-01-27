# StudyTrack Pro 🚀

StudyTrack Pro is a modern, full-stack web application designed to help students and professionals track their study hours, analyze their productivity, and stay motivated through gamification.

![Dashboard Preview](screenshots/screenshot.png)
*(See `screenshots/screenshot.png` for the preview!)*

---

## ✨ Features

### 📊 Dashboard & Analytics
- **Visual Analytics**: Interactive bar and pie charts to visualize study trends.
- **Stats Overview**: Quick summary of total hours, tasks completed, and current streak.
- **Activity History**: Detailed log of all study sessions with filtering options.

### ⏱️ Focus Tools
- **Built-in Timer**: A dedicated focus timer to track live study sessions.
- **Real-time Logging**: Automatically creates a record when the timer stops.

### 🏆 Gamification
- **Leaderboard**: Compete with other users based on study time (XP).
- **Ranking System**: Earn ranks and badges as you study more.
- **Dynamic Scoring**: 1 minute of study = 10 XP.

### 👤 User Profile
- **Personalized Profile**: View your level, join date, and stats.
- **Custom Avatar**: Upload your own profile picture (supports crop & resize).
- **Edit Details**: Easily update your name, email, and password.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion (Animations), Recharts (Charts), Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.
- **Authentication**: JWT (JSON Web Tokens), BCrypt (Password Hashing).
- **File Handling**: Multer (Image Uploads).

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js installed.
- MySQL installed and running (e.g., via XAMPP).

### 1. Database Setup
1. Open your MySQL client (e.g., phpMyAdmin).
2. Create a new database named `studytrack_db`.
3. Import the `database/schema.sql` file to create the tables.

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your DB credentials & JWT_SECRET
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app should now be running at `http://localhost:5173`.

---

## 📂 Project Structure

```
studytrack-pro/
├── backend/            # Express API & Database Logic
│   ├── controllers/    # API Controllers
│   ├── routes/         # API Routes
│   └── uploads/        # User uploaded images
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── pages/      # Main Application Pages
│   │   └── api/        # API Integration
│   └── index.css       # Tailwind Imports
├── database/           # SQL Schema
├── design/             # Architecture & Planning Docs
└── screenshots/        # Project Images
```

---

## 🔒 Security
- Passwords are hashed using **bcrypt**.
- API endpoints are protected using **JWT**.
- File uploads are validated and renamed for security.

---

## 🤝 Contributing
Feel free to fork this repository and submit pull requests. Any improvements are welcome!

---

**Happy Studying! 📚**