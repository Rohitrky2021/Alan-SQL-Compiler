import { generateId } from "./utils"

export interface Query {
  id: string
  name: string
  category: string
  description: string
  sql: string
  created: string
  lastRun: string
  results: any[] | null
}

export const sampleQueries: Query[] = [
  {
    id: generateId(),
    name: "Select All Customers",
    category: "Basic",
    description: "Retrieves all customer records from the database",
    sql: "SELECT * FROM customers LIMIT 100;",
    created: "2023-01-15",
    lastRun: "2023-05-20",
    results: null,
  },
  {
    id: generateId(),
    name: "Customer Orders Summary",
    category: "Reporting",
    description: "Shows total orders and revenue by customer",
    sql: `SELECT 
  c.customer_id,
  c.first_name,
  c.last_name,
  c.email,
  COUNT(o.order_id) as total_orders,
  SUM(o.total_amount) as total_spent
FROM 
  customers c
LEFT JOIN 
  orders o ON c.customer_id = o.customer_id
GROUP BY 
  c.customer_id
ORDER BY 
  total_spent DESC
LIMIT 50;`,
    created: "2023-02-10",
    lastRun: "2023-05-18",
    results: null,
  },
  {
    id: generateId(),
    name: "Product Inventory",
    category: "Inventory",
    description: "Shows current inventory levels for all products",
    sql: `SELECT 
  p.product_id,
  p.product_name,
  p.category,
  p.unit_price,
  i.quantity_in_stock,
  i.reorder_level,
  CASE 
    WHEN i.quantity_in_stock <= i.reorder_level THEN 'Reorder'
    ELSE 'OK'
  END as stock_status
FROM 
  products p
JOIN 
  inventory i ON p.product_id = i.product_id
ORDER BY 
  stock_status, p.category;`,
    created: "2023-03-05",
    lastRun: "2023-05-15",
    results: null,
  },
  {
    id: generateId(),
    name: "Monthly Sales",
    category: "Sales",
    description: "Aggregates sales data by month",
    sql: `SELECT 
  EXTRACT(YEAR FROM order_date) as year,
  EXTRACT(MONTH FROM order_date) as month,
  COUNT(order_id) as order_count,
  SUM(total_amount) as total_sales,
  AVG(total_amount) as average_order_value
FROM 
  orders
WHERE 
  order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
GROUP BY 
  EXTRACT(YEAR FROM order_date),
  EXTRACT(MONTH FROM order_date)
ORDER BY 
  year DESC, month DESC;`,
    created: "2023-03-20",
    lastRun: "2023-05-10",
    results: null,
  },
  {
    id: generateId(),
    name: "Top Selling Products",
    category: "Sales",
    description: "Lists the best-selling products by quantity",
    sql: `SELECT 
  p.product_id,
  p.product_name,
  p.category,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.quantity * oi.unit_price) as total_revenue
FROM 
  products p
JOIN 
  order_items oi ON p.product_id = oi.product_id
JOIN 
  orders o ON oi.order_id = o.order_id
WHERE 
  o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
GROUP BY 
  p.product_id
ORDER BY 
  total_quantity_sold DESC
LIMIT 20;`,
    created: "2023-04-05",
    lastRun: "2023-05-05",
    results: null,
  },
  {
    id: generateId(),
    name: "Customer Retention",
    category: "Analytics",
    description: "Analyzes customer repeat purchase behavior",
    sql: `WITH customer_orders AS (
  SELECT 
    customer_id,
    COUNT(order_id) as order_count,
    MIN(order_date) as first_order_date,
    MAX(order_date) as last_order_date,
    DATEDIFF(MAX(order_date), MIN(order_date)) as customer_lifetime_days
  FROM 
    orders
  GROUP BY 
    customer_id
)
SELECT 
  CASE 
    WHEN order_count = 1 THEN 'One-time'
    WHEN order_count BETWEEN 2 AND 3 THEN 'Occasional'
    WHEN order_count BETWEEN 4 AND 8 THEN 'Regular'
    ELSE 'Loyal'
  END as customer_segment,
  COUNT(*) as customer_count,
  AVG(order_count) as avg_orders,
  AVG(customer_lifetime_days) as avg_lifetime_days
FROM 
  customer_orders
GROUP BY 
  customer_segment
ORDER BY 
  avg_orders;`,
    created: "2023-04-15",
    lastRun: "2023-05-01",
    results: null,
  },
  {
    id: generateId(),
    name: "Employee Performance",
    category: "HR",
    description: "Evaluates sales performance by employee",
    sql: `SELECT 
  e.employee_id,
  e.first_name,
  e.last_name,
  e.department,
  COUNT(o.order_id) as orders_processed,
  SUM(o.total_amount) as total_sales,
  AVG(o.total_amount) as avg_order_value,
  COUNT(o.order_id) / 
    (DATEDIFF(CURRENT_DATE, MIN(o.order_date)) / 30) as monthly_order_rate
FROM 
  employees e
JOIN 
  orders o ON e.employee_id = o.employee_id
WHERE 
  o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
GROUP BY 
  e.employee_id
ORDER BY 
  total_sales DESC;`,
    created: "2023-04-25",
    lastRun: "2023-04-28",
    results: null,
  },
  {
    id: generateId(),
    name: "Slow Moving Inventory",
    category: "Inventory",
    description: "Identifies products with low sales velocity",
    sql: `SELECT 
  p.product_id,
  p.product_name,
  p.category,
  i.quantity_in_stock,
  COALESCE(SUM(oi.quantity), 0) as quantity_sold_last_90_days,
  i.quantity_in_stock / 
    CASE 
      WHEN COALESCE(SUM(oi.quantity), 0) = 0 THEN 1 
      ELSE COALESCE(SUM(oi.quantity), 0) 
    END * 90 as days_of_inventory
FROM 
  products p
JOIN 
  inventory i ON p.product_id = i.product_id
LEFT JOIN 
  order_items oi ON p.product_id = oi.product_id
LEFT JOIN 
  orders o ON oi.order_id = o.order_id AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
GROUP BY 
  p.product_id
HAVING 
  days_of_inventory > 180 OR quantity_sold_last_90_days = 0
ORDER BY 
  days_of_inventory DESC, quantity_in_stock DESC;`,
    created: "2023-05-01",
    lastRun: "2023-05-02",
    results: null,
  },
]

