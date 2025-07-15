import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UseIntersectionObserver } from "../Hooks/UseIntersectionObserver";
import { UseNetworkStatus } from "../Hooks/UseNetworkStatus";
import { useLocation } from "react-router-dom";

const courseDetails = {
  "course-1": {
    id: "lesson-1",
    title: "Introduction to EduTracker",
    description: "Welcome to your first lesson. Let's begin!",
    timeToSpend: 2,
    content: `
      Welcome to EduTracker, your smart learning companion designed to monitor, guide, and enhance your digital learning journey.
      In today’s fast-paced world of online education, it’s easy to lose track of what you’ve learned, how long you’ve engaged, or whether you’ve truly completed a lesson. That’s where EduTracker comes in.
      EduTracker is built with one mission in mind: to make every second of learning count. Whether you're reading a blog post, watching a tutorial, or completing a lesson, EduTracker intelligently monitors your progress in real time. 
      With background tasks, network awareness, and precise time tracking, it ensures that your efforts are not only recorded but used to improve your outcomes.
      From tracking your reading time to analyzing your video watch history, EduTracker helps you build consistency, stay motivated, and ultimately finish what you start.
      So, if you're ready to take control of your learning like never before, dive in and let EduTracker help you learn smarter.
    `
  },
  "course-2": {
    id: "lesson-2",
    title: "Tracking in Action",
    description: "This lesson demonstrates progress tracking features.",
    timeToSpend: 2,
    content: `
      Imagine reading a lesson online — you start motivated but get interrupted by a notification or slow network. When you return later, wouldn’t it be great if your progress was saved automatically? That’s exactly what EduTracker does.
      In this lesson, we’ll show you how tracking works in action.
      The moment you begin reading or watching content, EduTracker’s intelligent timer kicks in. Using technologies like the Intersection Observer API, it knows when you're actively viewing a blog post.
      Thanks to the Network Information API, it adjusts behavior based on your internet connection — skipping heavy tasks on low bandwidth to give you a smooth experience.
      If you leave the page, close the tab, or lose connection, EduTracker saves your current progress to the backend. When you come back, it resumes exactly where you left off. No more guessing how much you’ve done or starting over.
      Once you spend the required amount of time on a blog or video, the lesson is automatically marked as completed — no manual steps needed.
      EduTracker doesn’t just track your activity — it empowers your commitment. It turns passive browsing into goal-oriented learning.
    `
  }
};


const CourseDetail = ({ username, token }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef();
  const [timeSpentMinutes, setTimeSpentMinutes] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [viewed, setViewed] = useState(false);
  const isLowData = UseNetworkStatus();
  const [refresh, setRefresh] = useState(Date.now());

  const course = courseDetails[courseId];

  useEffect(() => {
    if (!username || !token) {
      navigate("/");
    }
  }, [username, token, navigate]);

  useEffect(() => {
    setRefresh(Date.now());
  }, [location.key]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!username || !course?.id) return;
      try {
        const res = await fetch(
          `https://edutracker-server.onrender.com/api/progress/${username}/${course.id}`
        );
        if (res.ok) {
          const data = await res.json();
          const minutes = data.timeSpent;
          setTimeSpentMinutes(minutes);
          if (minutes >= course.timeToSpend) setIsCompleted(true);
        }
      } catch (err) {
        console.error("Error fetching progress", err);
      }
    };

    fetchProgress();
  }, [refresh, username, course?.id]);

  useEffect(() => {
    if (!username || !course?.id) return;

    const id = setInterval(() => {
      setTimeSpentMinutes((prev) => prev + 1);
    }, 60000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, [username, course?.id, isCompleted]);

  useEffect(() => {
    if (!username || !course?.id) return;

    const interval = setInterval(() => {
      saveProgress(timeSpentMinutes);
    }, 10000);

    return () => clearInterval(interval);
  }, [timeSpentMinutes, username, course?.id]);

  const saveProgress = async (timeInSeconds) => {
    try {
      const completed = timeSpentMinutes >= course.timeToSpend;
      const response = await fetch(
        "https://edutracker-server.onrender.com/api/progress",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: username,
            lessonId: course.id,
            timeSpent: timeInSeconds,
            completed,
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        if (completed) {
          setIsCompleted(true);
          clearInterval(intervalId);
        }
      }
    } catch (err) {
      console.error("❌ Failed to save progress", err);
    }
  };

  UseIntersectionObserver(ref, () => {
    if (!viewed) setViewed(true);
  });

  if (!course) return <div className="p-8">❌ Course not found</div>;

  return (
    <div>
      <div ref={ref} className="p-8 max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">{course.title}</h2>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">⏳ Estimated Time: {course.timeToSpend} min</span>
          <span className={`text-sm px-2 py-1 rounded ${isLowData ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
            {isLowData ? "Low Network" : "Good Network"}
          </span>
        </div>

        <p className="text-gray-600 leading-relaxed">{course.description}</p>
        <p className="text-sm text-blue-700">
          ⏱️ Time Spent: <strong>{timeSpentMinutes}</strong> min
        </p>

        {viewed && <p className="text-blue-500 text-sm">👁️ Lesson viewed</p>}
        {submitted && <p className="text-green-500 text-sm">✅ Progress saved</p>}
        {isCompleted && <p className="text-purple-600 text-sm font-medium">🎉 Lesson completed!</p>}

        <div className="prose prose-sm max-w-none text-justify">
          <p>{course.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
