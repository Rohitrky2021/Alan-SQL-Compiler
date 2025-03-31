"use client";

import styles from "./header.module.css";
import { X, Menu } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./theme-toggle";

export default function Header({ loadTime }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <h1>SQL Query Runner</h1>
          {loadTime && (
            <span className={styles.loadTime}>
              Page load time: {loadTime.toFixed(2)}ms
            </span>
          )}
        </div>
        <div className={styles.mobileMenuButton}>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <ul>
            <li>
              <ThemeToggle />
            </li>
            <li>
              <a
                href="https://github.com/Rohitrky2021/Alan-SQL-Compiler"
                target="_blank"
                rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Rohitrky2021/Alan-SQL-Compiler?tab=readme-ov-file#sql-query-runner"
                target="_blank"
                rel="noopener noreferrer">
                Documentation
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
