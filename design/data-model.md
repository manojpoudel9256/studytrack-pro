# Data Model Diagram – StudyTrack Pro

## Overview
This document describes the database structure used in StudyTrack Pro.
The system uses a relational database (MySQL) with two main tables:
- users
- records

Each record belongs to exactly one user.

---

## Entities

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Records Table
```sql
CREATE TABLE records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration INT NOT NULL, -- in minutes
    memo TEXT,
    record_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Scores Table (Gamification)
```sql
CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_xp INT DEFAULT 0,
    level INT DEFAULT 1,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Relationships

- One **User** can have **many Records**
- Each **Record** belongs to **one User**

Relationship type:
```bash
Users (1) ────── (N) Records
- `records.user_id` references `users.id`
- Foreign key ensures data integrity
```
## Design Considerations

- User authentication is handled at the application level using JWT
- Data access is restricted so users can only access their own records
- Records are deleted or updated only if the logged-in user owns them

---

## Normalization
- Data is normalized to avoid duplication
- User information is stored only in the users table
- Record information is stored separately and linked via foreign key

