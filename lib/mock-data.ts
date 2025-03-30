// Helper function to generate random data
function generateRandomData(count: number, schema: Record<string, () => any>) {
  const results = []
  for (let i = 0; i < count; i++) {
    const row: Record<string, any> = {}
    for (const [key, generator] of Object.entries(schema)) {
      row[key] = generator()
    }
    results.push(row)
  }
  return results
}

// Random data generators
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals = 2) {
  return Number.parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0]
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomName() {
  const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Lisa", "William", "Emma"]
  const lastNames = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Miller", "Moore", "Taylor", "Anderson", "Thomas"]
  return `${randomChoice(firstNames)} ${randomChoice(lastNames)}`
}

function randomEmail() {
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com"]
  const username = `user${randomInt(1000, 9999)}`
  return `${username}@${randomChoice(domains)}`
}

function randomProduct() {
  const products = [
    "Laptop",
    "Smartphone",
    "Tablet",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Headphones",
    "Printer",
    "Camera",
    "Speaker",
  ]
  const brands = ["Apple", "Samsung", "Dell", "HP", "Logitech", "Sony", "LG", "Asus", "Acer", "Microsoft"]
  return `${randomChoice(brands)} ${randomChoice(products)}`
}

function randomCategory() {
  return randomChoice([
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Sports",
    "Toys",
    "Beauty",
    "Automotive",
    "Grocery",
    "Office",
  ])
}

// Mock query execution
function executeQueryMock(sql: string) {
  // Lowercase the SQL for easier pattern matching
  const sqlLower = sql.toLowerCase()

  // Determine the type of query and generate appropriate mock data
  if (sqlLower.includes("customer") && sqlLower.includes("order")) {
    // Customer orders query
    return generateRandomData(25, {
      customer_id: () => `CUST-${randomInt(1000, 9999)}`,
      first_name: () => randomName().split(" ")[0],
      last_name: () => randomName().split(" ")[1],
      email: () => randomEmail(),
      total_orders: () => randomInt(1, 50),
      total_spent: () => randomFloat(100, 10000, 2),
    })
  } else if (sqlLower.includes("product") && sqlLower.includes("inventory")) {
    // Product inventory query
    return generateRandomData(30, {
      product_id: () => `PROD-${randomInt(1000, 9999)}`,
      product_name: () => randomProduct(),
      category: () => randomCategory(),
      unit_price: () => randomFloat(10, 1000, 2),
      quantity_in_stock: () => randomInt(0, 500),
      reorder_level: () => randomInt(10, 50),
      stock_status: () => randomChoice(["OK", "Reorder", "Low", "Critical"]),
    })
  } else if (sqlLower.includes("monthly") && sqlLower.includes("sales")) {
    // Monthly sales query
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map((month, index) => ({
      year: 2023,
      month: index + 1,
      month_name: month,
      order_count: randomInt(100, 500),
      total_sales: randomFloat(10000, 100000, 2),
      average_order_value: randomFloat(100, 500, 2),
    }))
  } else if (sqlLower.includes("top") && sqlLower.includes("product")) {
    // Top products query
    return generateRandomData(20, {
      product_id: () => `PROD-${randomInt(1000, 9999)}`,
      product_name: () => randomProduct(),
      category: () => randomCategory(),
      total_quantity_sold: () => randomInt(50, 1000),
      total_revenue: () => randomFloat(1000, 50000, 2),
    })
  } else if (sqlLower.includes("customer") && sqlLower.includes("segment")) {
    // Customer segments query
    return [
      {
        customer_segment: "One-time",
        customer_count: randomInt(1000, 5000),
        avg_orders: 1,
        avg_lifetime_days: 0,
      },
      {
        customer_segment: "Occasional",
        customer_count: randomInt(500, 2000),
        avg_orders: randomFloat(2, 3, 1),
        avg_lifetime_days: randomInt(30, 90),
      },
      {
        customer_segment: "Regular",
        customer_count: randomInt(200, 1000),
        avg_orders: randomFloat(4, 8, 1),
        avg_lifetime_days: randomInt(90, 180),
      },
      {
        customer_segment: "Loyal",
        customer_count: randomInt(50, 500),
        avg_orders: randomFloat(9, 20, 1),
        avg_lifetime_days: randomInt(180, 365),
      },
    ]
  } else if (sqlLower.includes("employee") && sqlLower.includes("performance")) {
    // Employee performance query
    return generateRandomData(15, {
      employee_id: () => `EMP-${randomInt(100, 999)}`,
      first_name: () => randomName().split(" ")[0],
      last_name: () => randomName().split(" ")[1],
      department: () => randomChoice(["Sales", "Marketing", "Support", "Engineering", "HR"]),
      orders_processed: () => randomInt(50, 500),
      total_sales: () => randomFloat(10000, 100000, 2),
      avg_order_value: () => randomFloat(100, 500, 2),
      monthly_order_rate: () => randomFloat(5, 50, 1),
    })
  } else if (sqlLower.includes("inventory") && (sqlLower.includes("slow") || sqlLower.includes("days_of_inventory"))) {
    // Slow moving inventory query
    return generateRandomData(18, {
      product_id: () => `PROD-${randomInt(1000, 9999)}`,
      product_name: () => randomProduct(),
      category: () => randomCategory(),
      quantity_in_stock: () => randomInt(50, 500),
      quantity_sold_last_90_days: () => randomInt(0, 10),
      days_of_inventory: () => randomInt(180, 1000),
    })
  } else {
    // Default query - return customers
    return generateRandomData(40, {
      customer_id: () => `CUST-${randomInt(1000, 9999)}`,
      first_name: () => randomName().split(" ")[0],
      last_name: () => randomName().split(" ")[1],
      email: () => randomEmail(),
      phone: () => `(${randomInt(100, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      address: () => `${randomInt(100, 9999)} Main St, City ${randomChoice(["A", "B", "C", "D", "E"])}`,
      registration_date: () => randomDate(new Date(2020, 0, 1), new Date()),
      status: () => randomChoice(["Active", "Inactive", "Pending"]),
    })
  }
}

// Export the function
export { executeQueryMock }

