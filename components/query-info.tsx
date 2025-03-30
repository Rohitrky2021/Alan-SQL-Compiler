"use client"

import { useQuery } from "@/context/query-context"
import styles from "./query-info.module.css"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface QueryInfoProps {
  isCollapsed?: boolean
}

export default function QueryInfo({ isCollapsed }: QueryInfoProps) {
  const { currentQuery } = useQuery()
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={`${styles.container} ${isExpanded ? "" : styles.collapsed} ${isCollapsed ? styles.sidebarCollapsed : ""}`}
    >
      <div className={styles.header} onClick={toggleExpand}>
        <h2>Query Details</h2>
        <button className={styles.toggleButton}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Name</span>
          <span className={styles.value}>{currentQuery.name}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Category</span>
          <span className={styles.value}>{currentQuery.category}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Created</span>
          <span className={styles.value}>{formatDate(currentQuery.created)}</span>
        </div>
        {currentQuery.lastRun && (
          <div className={styles.infoItem}>
            <span className={styles.label}>Last Run</span>
            <span className={styles.value}>{currentQuery.lastRun}</span>
          </div>
        )}
        <div className={styles.infoItem}>
          <span className={styles.label}>Description</span>
          <p className={styles.description}>{currentQuery.description}</p>
        </div>
      </div>
    </div>
  )
}

