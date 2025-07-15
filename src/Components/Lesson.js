import React, { useRef, useState, useEffect } from "react";
import { UseLessonTimer } from "../Hooks/UseLessonTimer.js";
import { UseIntersectionObserver } from "../Hooks/UseIntersectionObserver.js";
import { UseNetworkStatus } from "../Hooks/UseNetworkStatus.js";
import { useNavigate } from "react-router-dom";

const Lesson = ({ id, title, description, videoUrl }) => {
  const ref = useRef();
  const [viewed, setViewed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [username, setUsername] = useState("");
  const isLowData = UseNetworkStatus();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  UseLessonTimer(id, (lessonId, timeSpent) => {
    if (!username) return;

    fetch("https://edutracker-server.onrender.com/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: username, lessonId, timeSpent }),
    }).then(() => setSubmitted(true));
  });

  UseIntersectionObserver(ref, () => {
    if (!viewed) setViewed(true);
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const getEmbedUrl = (url) => {
    const videoId = url.includes("youtu.be/")
      ? url.split("youtu.be/")[1].split("?")[0]
      : url.includes("watch?v=")
      ? url.split("watch?v=")[1].split("&")[0]
      : url;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div
      ref={ref}
      className="bg-white p-6 rounded-xl shadow-md mb-6 transition-transform duration-300 hover:scale-[1.01]"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <span
        className={`text-sm px-2 py-1 rounded ${
          isLowData
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {isLowData ? "Low Network" : "Good Network"}
      </span>

      <p className="text-gray-600 mt-2">{description}</p>

      {isLowData ? (
        <div className="mt-4 w-full aspect-video rounded-md overflow-hidden">
          <iframe
            className="w-full h-full"
            src={getEmbedUrl(videoUrl)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          📵 Video disabled due to low bandwidth.
        </p>
      )}

      {viewed && (
        <p className="text-blue-500 mt-2 text-sm">👁️ Lesson viewed</p>
      )}

      {submitted && (
        <p className="text-green-500 mt-1 text-sm">✅ Progress saved</p>
      )}
    </div>
  );
};

export default Lesson;
