# 🧠 Leet Master

**Leet Master** is a full-featured coding problem-solving platform inspired by platforms like LeetCode and HackerRank. Built during a high-intensity cohort program, it’s designed to help users learn and practice Data Structures and Algorithms through structured challenges, real-time feedback, and competitive tracking.

---

## 🚀 Features

- ✅ Practice DSA problems with custom test cases  
- ✍️ Built-in code editor with support for multiple languages  
- 📂 Problems organized by tags, topics, and difficulty  
- 📈 Track solved problems and view detailed submission history  
- 🏆 User ranking and leaderboard  
- 💬 Hints, constraints, and editorials for in-depth learning  
- 🔐 Secure authentication and profile system  

---

## 🛠 Tech Stack

### Frontend
- React + TypeScript
- TailwindCSS (with custom dark/light themes)
- ShadCN UI Components

### Backend
- Node.js + Express
- PostgreSQL + Drizzle ORM
- Redis (optional for caching)
- JWT-based Authentication

### Judge Integration
- [Judge0](https://judge0.com/) API for code execution

---

## 📸 Demo & Screenshots

---
![Screenshot 2025-06-08 143944](https://github.com/user-attachments/assets/83998783-3841-48aa-bac8-67d473093f6e)
![Screenshot 2025-06-08 143935](https://github.com/user-attachments/assets/7fe741a0-7439-47c0-9c45-d0d02928dbe4)
![Screenshot 2025-06-08 144001](https://github.com/user-attachments/assets/ba3afc6d-6f22-4c96-a9db-22e1edff61ef)
![Screenshot 2025-06-08 144023](https://github.com/user-attachments/assets/fb19a390-ed69-4287-a654-97d8098c885c)

## 🧪 Local Setup

### Prerequisites
- Node.js >= 18.x  
- PostgreSQL  
- Docker (optional, for local Judge0)  

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/leet-master.git
cd leet-master

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Fill in your DB credentials, JWT secret, Judge0 keys, etc.

# 4. Run migrations (if using Drizzle)
npm run db:push

# 5. Start the development server
npm run dev
