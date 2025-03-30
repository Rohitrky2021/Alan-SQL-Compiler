"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@/context/query-context"
import styles from "./query-selector.module.css"
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import QueryInfo from "@/components/query-info"

export default function QuerySelector() {
  const { queries, selectQuery, currentQuery } = useQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Close sidebar on mobile screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true)
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Get unique categories
  const categories = Array.from(new Set(queries.map((q) => q.category)))

  // Filter queries based on search term and selected category
  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      searchTerm === "" ||
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === null || query.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className={`${styles.container} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
      <button
        className={styles.toggleButton}
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {!isCollapsed && (
        <div className={styles.sidebarContent}>
          <div className={styles.header}>
            <h2>Saved Queries</h2>
            <div className={styles.search}>
              <div className={styles.searchInputWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button className={styles.clearButton} onClick={clearSearch}>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.categories}>
            <button
              className={`${styles.categoryButton} ${selectedCategory === null ? styles.active : ""}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.queryList}>
            {filteredQueries.length === 0 ? (
              <div className={styles.noResults}>No queries found</div>
            ) : (
              filteredQueries.map((query) => (
                <div
                  key={query.id}
                  className={`${styles.queryItem} ${currentQuery.id === query.id ? styles.active : ""}`}
                  onClick={() => selectQuery(query.id)}
                >
                  <div className={styles.queryName}>{query.name}</div>
                  <div className={styles.queryMeta}>
                    <span className={styles.queryCategory}>{query.category}</span>
                    <span className={styles.queryDate}>
                      {query.lastRun ? `Last run: ${query.lastRun}` : `Created: ${query.created}`}
                    </span>
                  </div>
                  <div className={styles.queryDescription}>{query.description}</div>
                </div>
              ))
            )}
          </div>

          <div className={styles.queryInfoWrapper}>
            <QueryInfo isCollapsed={isCollapsed} />
          </div>
        </div>
      )}
    </div>
  )
}
