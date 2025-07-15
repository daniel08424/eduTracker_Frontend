# 🎓 EduTracker – Smart E-learning Activity Monitor

EduTracker is a e-learning platform designed to intelligently monitor user activity such as lesson reading, video watching, and network status to ensure effective and engaging learning. It provides a smart way to track time spent on lessons, resume incomplete lessons, and mark them complete automatically when the expected time is reached.

---

## 🚀 Features

- ✅ Authentication system (Signup/Login)
- 📘 Course listing with tracking icons
- ⏳ Auto time-tracking per lesson
- 💾 Backend progress save & resume
- 👁️ Lesson "seen" tracking using visibility
- 🌐 Low-network detection for UX optimization
- 🔒 Token-based route protection

---
## 🛠️ APIs and Web APIs Used

### 1. **Background Tasks API (setInterval / clearInterval)**
Used to **track and save user reading time** every 10 seconds, ensuring that progress is not lost if the page is closed or the user disconnects.

### 2. **Intersection Observer API**
Tracks whether the lesson content is **actually being viewed on the screen**, preventing false progress counts.

### 3. **Network Information API**
Used to detect **network quality** and optimize tracking behavior for users on slow connections.

### 4. **Custom Backend APIs** (`https://edutracker-server.onrender.com`)
- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Login and receive a token.
- `GET /api/progress/:username`: Get progress list for all lessons.
- `GET /api/progress/:username/:lessonId`: Get progress for a specific lesson.
- `POST /api/progress`: Save or update user progress.

---

## 🧪 How This Project Works

1. User signs up or logs in. The backend returns a token.
2. Token and username are passed as props instead of using `localStorage`.
3. Courses are listed. Each course links to a `CourseDetail` page.
4. On lesson view:
   - Visibility is tracked using Intersection Observer API.
   - Check the Network Strength (Good Network, Bad Network) with Network Information API
   - Time is tracked using setInterval by using Background Task API.
   - Every 10s, progress is saved to backend.
   - Once enough time is spent, the lesson is marked complete.
5. Navbar displays username and logout button.

---

## 💻 How to Run Frontend Locally

# Step 1: Clone the repository
git clone https://github.com/yourusername/edutracker.git
cd edutracker

# Step 2: Install dependencies
npm install

# Step 3: Start the development server
npm start
