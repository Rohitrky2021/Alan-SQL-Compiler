"use client"

import { useEffect, useRef } from "react"
import { useQuery } from "@/context/query-context"
import styles from "./query-editor.module.css"
import { EditorState } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { sql } from "@codemirror/lang-sql"
import { indentWithTab } from "@codemirror/commands"
import { oneDark } from "@codemirror/theme-one-dark"

// Import minimal set of extensions
import { lineNumbers, highlightActiveLine } from "@codemirror/view"
import { history } from "@codemirror/commands"
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language"

export default function QueryEditor() {
  const { currentQuery, setCurrentQuery, executeQuery } = useQuery()
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    // Clean up previous editor instance
    if (viewRef.current) {
      viewRef.current.destroy()
    }

    // Create a new editor instance with minimal extensions
    const state = EditorState.create({
      doc: currentQuery.sql,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        syntaxHighlighting(defaultHighlightStyle),
        sql(),
        oneDark,
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCurrentQuery({
              ...currentQuery,
              sql: update.state.doc.toString(),
            })
          }
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [currentQuery])

  const handleExecute = () => {
    executeQuery()
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>SQL Query</h2>
        <button className={styles.executeButton} onClick={handleExecute}>
          Execute Query
        </button>
      </div>
      <div className={styles.editor} ref={editorRef}></div>
      <div className={styles.editorFooter}>
        <p>Press Ctrl+Enter to execute query</p>
      </div>
    </div>
  )
}

