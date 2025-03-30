"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@/context/query-context";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import styles from "./results-table.module.css";
import { ChevronDown, ChevronUp, BarChart2, TableIcon } from "lucide-react";
import EnhancedChart from "./enhanced-chart";
import ExportResults from "./export-results";
import SqlExplainer from "./sql-explainer";
import QueryHistory from "./query-history";

export default function ResultsTable() {
  const { currentQuery, isLoading, error } = useQuery();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  const data = useMemo(
    () => currentQuery.results || [],
    [currentQuery.results]
  );

  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(() => {
    if (!data.length) return [];

    return Object.keys(data[0]).map(key => {
      return columnHelper.accessor(key, {
        header: () => <span>{key}</span>,
        cell: info => info.getValue(),
      });
    });
  }, [data, columnHelper]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className={`${styles.resultsContainer} ${styles.resizable}`}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Executing query...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.empty}>
          <p>No results found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <div className={styles.resultsInfo}>
          <h2>Results</h2>
          <span className={styles.rowCount}>{data.length} rows</span>
        </div>
        <div className={styles.resultsActions}>
          <SqlExplainer />
          <QueryHistory />
          <ExportResults />
          <div className={styles.viewToggle}>
            <button
              className={viewMode === "table" ? styles.active : ""}
              onClick={() => setViewMode("table")}>
              <TableIcon size={16} />
              <span>Table</span>
            </button>
            <button
              className={viewMode === "chart" ? styles.active : ""}
              onClick={() => setViewMode("chart")}>
              <BarChart2 size={16} />
              <span>Chart</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={styles.th}>
                      <div className={styles.thContent}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={styles.td}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.chartContainer}>
          <EnhancedChart data={data} />
        </div>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className={styles.paginationButton}>
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={styles.paginationButton}>
          {"<"}
        </button>
        <span className={styles.pageInfo}>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={styles.paginationButton}>
          {">"}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className={styles.paginationButton}>
          {">>"}
        </button>
      </div>
    </div>
  );
}
