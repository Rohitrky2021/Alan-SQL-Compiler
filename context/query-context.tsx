"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { sampleQueries } from "@/lib/sample-queries"
import { executeQueryMock } from "@/lib/mock-data"
import { generateId } from "@/lib/utils"

interface Query {
  id: string
  name: string
  category: string
  description: string
  sql: string
  created: string
  lastRun: string
  results: any[] | null
}

interface HistoryItem {
  id: string
  name: string
  sql: string
  timestamp: string
}

interface QueryContextType {
  queries: Query[]
  currentQuery: Query
  queryHistory: HistoryItem[]
  isLoading: boolean
  error: string | null
  selectQuery: (id: string) => void
  setCurrentQuery: (query: Query) => void
  executeQuery: () => void
  clearHistory: () => void
  rerunHistoryQuery: (id: string) => void
}

const QueryContext = createContext<QueryContextType | undefined>(undefined)

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queries, setQueries] = useState<Query[]>(sampleQueries)
  const [currentQueryId, setCurrentQueryId] = useState<string>(sampleQueries[0].id)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [queryHistory, setQueryHistory] = useState<HistoryItem[]>([])

  const currentQuery = queries.find((q) => q.id === currentQueryId) || queries[0]

  const selectQuery = useCallback((id: string) => {
    setCurrentQueryId(id)
  }, [])

  const setCurrentQuery = useCallback((query: Query) => {
    setQueries((prevQueries) => prevQueries.map((q) => (q.id === query.id ? query : q)))
  }, [])

  const executeQuery = useCallback(() => {
    setIsLoading(true)
    setError(null)

    // Add to history
    const historyItem: HistoryItem = {
      id: generateId(),
      name: currentQuery.name,
      sql: currentQuery.sql,
      timestamp: new Date().toISOString(),
    }

    setQueryHistory((prev) => [historyItem, ...prev.slice(0, 19)]) // Keep last 20 items

    // Simulate API call delay
    setTimeout(() => {
      try {
        const results = executeQueryMock(currentQuery.sql)

        // Update the query with results and lastRun
        setQueries((prevQueries) =>
          prevQueries.map((q) =>
            q.id === currentQuery.id
              ? {
                  ...q,
                  results,
                  lastRun: new Date().toLocaleString(),
                }
              : q,
          ),
        )

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setIsLoading(false)
      }
    }, 1000)
  }, [currentQuery.id, currentQuery.name, currentQuery.sql])

  const clearHistory = useCallback(() => {
    setQueryHistory([])
  }, [])

  const rerunHistoryQuery = useCallback(
    (historyId: string) => {
      const historyItem = queryHistory.find((item) => item.id === historyId)
      if (!historyItem) return

      // Update current query with the history item's SQL
      setQueries((prevQueries) =>
        prevQueries.map((q) =>
          q.id === currentQueryId
            ? {
                ...q,
                sql: historyItem.sql,
              }
            : q,
        ),
      )

      // Execute the query
      setTimeout(executeQuery, 100)
    },
    [currentQueryId, executeQuery, queryHistory],
  )

  return (
    <QueryContext.Provider
      value={{
        queries,
        currentQuery,
        queryHistory,
        isLoading,
        error,
        selectQuery,
        setCurrentQuery,
        executeQuery,
        clearHistory,
        rerunHistoryQuery,
      }}
    >
      {children}
    </QueryContext.Provider>
  )
}

export function useQuery() {
  const context = useContext(QueryContext)
  if (context === undefined) {
    throw new Error("useQuery must be used within a QueryProvider")
  }
  return context
}

