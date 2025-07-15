import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Courses from "./Components/Courses";
import CourseDetail from "./Components/CourseDetails";
import Navbar from "./Components/NavBar";

function App() {
  const [username, setUsername] = useState(() => sessionStorage.getItem("username") || "");
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");

  useEffect(() => {
    if (username && token) {
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("token", token);
    }
  }, [username, token]);

  useEffect(() => {
    if (!username || !token) {
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("token");
    }
  }, [username, token]);

  return (
    <div>
      {username && token && (
        <Navbar
          username={username}
          token={token}
          setUsername={setUsername}
          setToken={setToken}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<Login setUsername={setUsername} setToken={setToken} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/courses"
          element={
            token ? (
              <Courses username={username} token={token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/course/:courseId"
          element={
            token ? (
              <CourseDetail username={username} token={token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
