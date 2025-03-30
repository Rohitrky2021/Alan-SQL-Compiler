"use client"

import { useState } from "react"
import { useQuery } from "@/context/query-context"
import styles from "./export-results.module.css"
import { Download, FileText, Table, BarChart2, Check } from "lucide-react"

type ExportFormat = "csv" | "json" | "sql"

export default function ExportResults() {
  const { currentQuery } = useQuery()
  const [showDropdown, setShowDropdown] = useState(false)
  const [exportSuccess, setExportSuccess] = useState<ExportFormat | null>(null)

  const hasResults = currentQuery.results && currentQuery.results.length > 0

  const exportData = (format: ExportFormat) => {
    if (!currentQuery.results || currentQuery.results.length === 0) return

    let content = ""
    let filename = `query-results-${new Date().toISOString().slice(0, 10)}`
    let mimeType = ""

    switch (format) {
      case "csv":
        content = convertToCSV(currentQuery.results)
        filename += ".csv"
        mimeType = "text/csv"
        break
      case "json":
        content = JSON.stringify(currentQuery.results, null, 2)
        filename += ".json"
        mimeType = "application/json"
        break
      case "sql":
        content = convertToSQL(currentQuery.results)
        filename += ".sql"
        mimeType = "application/sql"
        break
    }

    // Create a blob and download it
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Show success message
    setExportSuccess(format)
    setTimeout(() => setExportSuccess(null), 2000)
    setShowDropdown(false)
  }

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return ""

    const headers = Object.keys(data[0])
    const headerRow = headers.join(",")

    const rows = data.map((row) => {
      return headers
        .map((header) => {
          const value = row[header]
          // Handle values with commas by wrapping in quotes
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(",")
    })

    return [headerRow, ...rows].join("\n")
  }

  const convertToSQL = (data: any[]): string => {
    if (data.length === 0) return ""

    const tableName = "exported_results"
    const headers = Object.keys(data[0])

    let sql = `CREATE TABLE ${tableName} (\n`
    sql += headers.map((header) => `  ${header} VARCHAR(255)`).join(",\n")
    sql += "\n);\n\n"

    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header]
        return typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value
      })

      sql += `INSERT INTO ${tableName} (${headers.join(", ")}) VALUES (${values.join(", ")});\n`
    })

    return sql
  }

  if (!hasResults) return null

  return (
    <div className={styles.container}>
      <button
        className={styles.exportButton}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Export results"
        aria-expanded={showDropdown}
      >
        <Download size={16} />
        <span>Export</span>
      </button>

      {showDropdown && (
        <div className={styles.dropdown}>
          <button className={styles.dropdownItem} onClick={() => exportData("csv")}>
            <Table size={16} />
            <span>Export as CSV</span>
            {exportSuccess === "csv" && <Check size={16} className={styles.successIcon} />}
          </button>
          <button className={styles.dropdownItem} onClick={() => exportData("json")}>
            <BarChart2 size={16} />
            <span>Export as JSON</span>
            {exportSuccess === "json" && <Check size={16} className={styles.successIcon} />}
          </button>
          <button className={styles.dropdownItem} onClick={() => exportData("sql")}>
            <FileText size={16} />
            <span>Export as SQL</span>
            {exportSuccess === "sql" && <Check size={16} className={styles.successIcon} />}
          </button>
        </div>
      )}
    </div>
  )
}

