"use client"

import { useState, useMemo } from "react"
import styles from "./enhanced-chart.module.css"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type ChartType = "bar" | "pie"


export default function EnhancedChart({ data }: EnhancedChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar")

  // Get the first two columns for the chart
  const chartData = useMemo(() => {
    if (!data.length) return []

    const keys = Object.keys(data[0])
    const labelKey = keys[0]
    const valueKey = keys.find((k) => typeof data[0][k] === "number") || keys[1]

    // Only use first 10 items for the chart
    return data.slice(0, 10).map((item) => ({
      name: String(item[labelKey]).substring(0, 20),
      value: Number(item[valueKey]) || 0,
    }))
  }, [data])

  // Colors for the pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#8DD1E1",
    "#A4DE6C",
    "#D0ED57",
  ]

  if (!chartData.length) {
    return (
      <div className={styles.noData}>
        <p>No data available for chart visualization</p>
      </div>
    )
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartControls}>
        <div className={styles.chartTypeSelector}>
          <button
            className={`${styles.chartTypeButton} ${chartType === "bar" ? styles.active : ""}`}
            onClick={() => setChartType("bar")}
          >
            Bar Chart
          </button>
          <button
            className={`${styles.chartTypeButton} ${chartType === "pie" ? styles.active : ""}`}
            onClick={() => setChartType("pie")}
          >
            Pie Chart
          </button>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        {chartType === "bar" ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="var(--primary-color)" name="Value" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-color)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
                formatter={(value: any) => [`${value}`, "Value"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

