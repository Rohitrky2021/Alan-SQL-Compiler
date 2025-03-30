"use client"

import { useEffect } from "react"
import { useQuery } from "@/context/query-context"
import styles from "./keyboard-shortcuts.module.css"
import { X } from "lucide-react"
import { useState } from "react"

export default function KeyboardShortcuts() {
  const { executeQuery } = useQuery()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Execute query with Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        executeQuery()
        e.preventDefault()
      }

      // Show keyboard shortcuts with Shift+?
      if (e.shiftKey && e.key === "?") {
        setShowModal(true)
        e.preventDefault()
      }

      // Close modal with Escape
      if (e.key === "Escape" && showModal) {
        setShowModal(false)
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [executeQuery, showModal])

  return (
    <>
      <button className={styles.shortcutsButton} onClick={() => setShowModal(true)} aria-label="Keyboard shortcuts">
        <kbd>?</kbd>
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Keyboard Shortcuts</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeButton} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.shortcutGroup}>
                <h3>Query Execution</h3>
                <div className={styles.shortcut}>
                  <div className={styles.keys}>
                    <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
                  </div>
                  <div className={styles.description}>Execute current query</div>
                </div>
              </div>

              <div className={styles.shortcutGroup}>
                <h3>Navigation</h3>
                <div className={styles.shortcut}>
                  <div className={styles.keys}>
                    <kbd>Shift</kbd> + <kbd>?</kbd>
                  </div>
                  <div className={styles.description}>Show keyboard shortcuts</div>
                </div>
                <div className={styles.shortcut}>
                  <div className={styles.keys}>
                    <kbd>Esc</kbd>
                  </div>
                  <div className={styles.description}>Close dialogs</div>
                </div>
              </div>

              <div className={styles.shortcutGroup}>
                <h3>Editor</h3>
                <div className={styles.shortcut}>
                  <div className={styles.keys}>
                    <kbd>Tab</kbd>
                  </div>
                  <div className={styles.description}>Indent code</div>
                </div>
                <div className={styles.shortcut}>
                  <div className={styles.keys}>
                    <kbd>Shift</kbd> + <kbd>Tab</kbd>
                  </div>
                  <div className={styles.description}>Unindent code</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

