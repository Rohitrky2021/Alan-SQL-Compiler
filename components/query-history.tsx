"use client"

import { useQuery } from "@/context/query-context"
import styles from "./query-history.module.css"
import { Clock, X } from "lucide-react"
import { useState } from "react"
import { timeAgo } from "@/lib/utils"

export default function QueryHistory() {
  const { queryHistory, clearHistory, rerunHistoryQuery } = useQuery()
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div className={styles.container}>
      <button
        className={styles.historyButton}
        onClick={() => setShowHistory(!showHistory)}
        aria-label="Query history"
        aria-expanded={showHistory}
      >
        <Clock size={16} />
        <span>History</span>
        {queryHistory.length > 0 && <span className={styles.badge}>{queryHistory.length}</span>}
      </button>

      {showHistory && (
        <div className={styles.historyPanel}>
          <div className={styles.historyHeader}>
            <h3>Query History</h3>
            <div className={styles.historyActions}>
              <button className={styles.clearButton} onClick={clearHistory} disabled={queryHistory.length === 0}>
                Clear All
              </button>
              <button className={styles.closeButton} onClick={() => setShowHistory(false)} aria-label="Close history">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className={styles.historyList}>
            {queryHistory.length === 0 ? (
              <div className={styles.emptyHistory}>
                <p>No query history yet</p>
              </div>
            ) : (
              queryHistory.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyItemHeader}>
                    <span className={styles.historyItemName}>{item.name}</span>
                    <span className={styles.historyItemTime}>{timeAgo(item.timestamp)}</span>
                  </div>
                  <div className={styles.historyItemSql}>{item.sql}</div>
                  <button
                    className={styles.rerunButton}
                    onClick={() => {
                      rerunHistoryQuery(item.id)
                      setShowHistory(false)
                    }}
                  >
                    Run Again
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

