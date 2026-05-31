"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/Button";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    // Read stored value or default to dark
    const stored = localStorage.getItem("socialpilot-theme");
    if (stored === "light") {
      setTheme("light");
      document.documentElement.classList.add("light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.add("light");
      localStorage.setItem("socialpilot-theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("socialpilot-theme", "dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 rounded-xl hover:bg-white/10 text-muted hover:text-white transition-colors"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5 text-amber-400" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-indigo-500" />
      )}
    </Button>
  );
}
