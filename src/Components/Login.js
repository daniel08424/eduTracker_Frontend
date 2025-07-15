// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUsername, setToken }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://edutracker-server.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setUsername(form.username);
        setToken(data.token);
        navigate("/courses");
      } else {
        alert(data.message || "❌ Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "🔄 Please wait..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        New user?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-blue-500 cursor-pointer underline"
        >
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
