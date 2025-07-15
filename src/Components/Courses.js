import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const courses = [
  { id: "course-1", LessonId: "lesson-1", title: "Introduction to EduTracker" },
  { id: "course-2", LessonId: "lesson-2", title: "Tracking in Action" },
];

const Courses = ({ username, token }) => {
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    if (!username || !token) {
      navigate("/");
      return;
    }
  }, [username, token, navigate]);

  useEffect(() => {
    const fetchProgresses = async () => {
      try {
        const res = await fetch(
          `https://edutracker-server.onrender.com/api/progress/${username}`
        );
        if (res.ok) {
          const data = await res.json();
          const completed = data
            .filter((p) => p.completed)
            .map((p) => p.lessonId);
          setCompletedLessons(completed);
        }
      } catch (err) {
        console.error("❌ Error fetching progress list:", err);
      }
    };

    if (username) fetchProgresses();
  }, [username]);

  return (
    <div>
      <div className="max-w-3xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
        <ul className="space-y-4">
          {courses.map((course) => (
            <li
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              className="cursor-pointer text-blue-600 hover:underline text-lg"
            >
              📘 {course.title}
              {completedLessons.includes(course.LessonId) && (
                <span className="text-green-600 ml-2">✅</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Courses;
