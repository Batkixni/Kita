"use client";

import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = saved === "dark" || (!saved && systemDark);

    if (shouldBeDark) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <button
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid rgba(128, 128, 128, 0.5)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          color: "#333",
          flexShrink: 0,
        }}
        aria-label="Toggle theme"
      >
        ☾
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        border: "1px solid rgba(128, 128, 128, 0.5)",
        backgroundColor: isDark
          ? "rgba(30, 30, 30, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        color: isDark ? "#fff" : "#333",
        flexShrink: 0,
      }}
      aria-label="Toggle theme"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
