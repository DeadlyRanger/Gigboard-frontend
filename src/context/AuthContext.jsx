import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      // If user saved a preference, use it; otherwise check system dark mode
      if (savedTheme) return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  // 2. Sync theme with the HTML document and LocalStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3. Toggle Function
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const login = async ({ email, password }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      // Assuming your API returns user data, update state accordingly
      setUser({ ...res.data.user, loggedIn: true });
    } catch (err) {
      throw err; // Let the component handle the error message
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
      setUser(null); // Clear user anyway to be safe
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, toggleTheme }}>
      {/* The outer div ensures the background color 
         fills the screen even if the page content is short 
      */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export default AuthProvider;