"use client"

import { useState } from "react"
import { useQuery } from "@/context/query-context"
import styles from "./sql-explainer.module.css"
import { HelpCircle, X } from "lucide-react"

export default function SqlExplainer() {
  const { currentQuery } = useQuery()
  const [showExplanation, setShowExplanation] = useState(false)

  // This would normally be generated by an AI model
  // For this demo, we'll use a simple explanation based on the query
  const getExplanation = () => {
    const sql = currentQuery.sql.toLowerCase()

    if (sql.includes("select") && sql.includes("from")) {
      const explanation = [
        {
          part: "SELECT statement",
          explanation: "This query retrieves data from the database.",
        },
      ]

      if (sql.includes("join")) {
        explanation.push({
          part: "JOIN clause",
          explanation: "The query combines data from multiple tables based on related columns.",
        })
      }

      if (sql.includes("where")) {
        explanation.push({
          part: "WHERE clause",
          explanation: "The query filters results based on specific conditions.",
        })
      }

      if (sql.includes("group by")) {
        explanation.push({
          part: "GROUP BY clause",
          explanation: "The query aggregates results into groups based on specified columns.",
        })
      }

      if (sql.includes("having")) {
        explanation.push({
          part: "HAVING clause",
          explanation: "The query filters grouped results based on aggregate conditions.",
        })
      }

      if (sql.includes("order by")) {
        explanation.push({
          part: "ORDER BY clause",
          explanation: "The query sorts results based on specified columns.",
        })
      }

      if (sql.includes("limit")) {
        explanation.push({
          part: "LIMIT clause",
          explanation: "The query restricts the number of rows returned.",
        })
      }

      return explanation
    }

    return [
      {
        part: "SQL Query",
        explanation: "This is a SQL query that interacts with the database.",
      },
    ]
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.explainerButton}
        onClick={() => setShowExplanation(!showExplanation)}
        aria-label="Explain SQL query"
      >
        <HelpCircle size={16} />
        <span>Explain Query</span>
      </button>

      {showExplanation && (
        <div className={styles.explanationModal}>
          <div className={styles.explanationContent}>
            <div className={styles.explanationHeader}>
              <h3>SQL Query Explanation</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowExplanation(false)}
                aria-label="Close explanation"
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.explanationBody}>
              <div className={styles.queryPreview}>
                <pre>{currentQuery.sql}</pre>
              </div>
              <div className={styles.explanationList}>
                {getExplanation().map((item, index) => (
                  <div key={index} className={styles.explanationItem}>
                    <h4>{item.part}</h4>
                    <p>{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

