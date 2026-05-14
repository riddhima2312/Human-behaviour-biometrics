"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hbb-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    return savedTheme ? savedTheme === "dark" : prefersDark;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((previous) => {
      const next = !previous;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  };

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:scale-105 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
