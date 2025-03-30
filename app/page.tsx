"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import QueryEditor from "@/components/query-editor"
import ResultsTable from "@/components/results-table"
import QuerySelector from "@/components/query-selector"
import { useQuery } from "@/context/query-context"
import styles from "./page.module.css"
import { measureLoadTime } from "@/lib/utils"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"

export default function Home() {
  const { currentQuery, executeQuery } = useQuery()
  const [loadTime, setLoadTime] = useState<number | null>(null)

  useEffect(() => {
    // Execute default query on initial load
    executeQuery()

    // Measure page load time
    const time = measureLoadTime()
    setLoadTime(time)
  }, [executeQuery])

  return (
    <main className={styles.main}>
      <Header loadTime={loadTime} />
      <div className={styles.container}>
        <QuerySelector />
        <div className={styles.content}>
          <QueryEditor />
          <ResultsTable  />
        </div>
      </div>
      <KeyboardShortcuts />
    </main>
  )
}

