"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import styles from "./theme-toggle.module.css"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light")
    setTheme(initialTheme)

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    // Save preference to localStorage
    localStorage.setItem("theme", newTheme)

    // Toggle dark class on html element
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}

