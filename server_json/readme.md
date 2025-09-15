## **📖 JSON SERVER INSTRUCTIONS**

### **🚀 QUICK START**

**1. Installing dependencies**
```bash
# In the provided folder
npm install

# Or if you prefer yarn
yarn install
```

**2. Generate test data and start JSON server**
```bash
npm run dev
```

### **🛠 AVAILABLE API ENDPOINTS**

Once the server is running on `http://localhost:3001`:

#### **📊 Main resources**
```bash
GET /departments       # List of 5 departments
GET /users             # List of 66 users  
GET /tools             # List of 24 SaaS tools
GET /user_tools        # User-tools relationships
GET /analytics         # KPIs, budget and dashboard metrics
```

#### **🔍 Filtering and search**
```bash
# Filter active users
GET /users?active=true

# Tools by status
GET /tools?status=active
GET /tools?status=unused  
GET /tools?status=expiring

# Users by department
GET /users?department_id=1

# Search by name
GET /users?name_like=John
GET /tools?name_like=Slack
```

#### **🎯 DASHBOARD SPECIAL ENDPOINTS**
```bash
# Recent Tools (8 last updated tools)
GET /tools?_sort=updated_at&_order=desc&_limit=8

# Tools by descending cost
GET /tools?_sort=monthly_cost&_order=desc

# Complete budget analytics
GET /analytics
```

#### **📈 Relations and joins**
```bash
# Users with their department
GET /users?_embed=department

# Tools with relationships
GET /tools?_embed=user_tools

# User relationships
GET /users/1/user_tools
```

#### **🔄 Pagination and sorting**
```bash
# Page 1, 10 items
GET /users?_page=1&_limit=10

# Sort by name
GET /tools?_sort=name&_order=asc

# Sort by cost
GET /tools?_sort=monthly_cost&_order=desc
```

### **💾 DATA STRUCTURE**

#### **Department**
```typescript
{
  id: number
  name: string // "Engineering", "Design", etc.
  description: string
  created_at: string
  updated_at: string
}
```

#### **User**
```typescript
{
  id: number
  name: string
  email: string
  department_id: number
  role: string // "Senior Developer", "UX Designer", etc.
  active: boolean
  joined_at: string // "YYYY-MM-DD"
}
```

#### **Tool** 
```typescript
{
  id: number
  name: string // "Slack", "Figma", etc.
  description: string
  vendor: string
  category: string // "Development", "Design", etc.
  monthly_cost: number
  previous_month_cost: number 
  owner_department: string
  status: "active" | "unused" | "expiring"
  website_url: string
  active_users_count: number
  icon_url: string 
  created_at: string
  updated_at: string
}
```

#### **UserTool**
```typescript
{
  user_id: number
  tool_id: number
  usage_frequency: "daily" | "weekly" | "monthly" | "rarely"
  last_used: string // ISO date
  proficiency_level: "beginner" | "intermediate" | "advanced" | "expert"
}
```

#### **Analytics** 
```typescript
{
  budget_overview: {
    monthly_limit: number        // 30000
    current_month_total: number  // Current total
    previous_month_total: number // Previous month total  
    budget_utilization: string   // "95.8%" 
    trend_percentage: string     // "+12.0"
  },
  kpi_trends: {
    budget_change: string        // "+12%"
    tools_change: string         // "+9"
    departments_change: string   // "+2"
    cost_per_user_change: string // "-€12"
  },
  cost_analytics: {
    cost_per_user: number        // 156
    previous_cost_per_user: number // 168
    active_users: number         // 56
    total_users: number         // 66
  }
}
```

**🚀 Happy development!**