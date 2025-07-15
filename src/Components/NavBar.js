// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ username, token, setUsername, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUsername("");
    setToken("");
    navigate("/");
  };

  return (
    <div className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold">EduTracker</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">👤 {username}</span>
        <button
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
