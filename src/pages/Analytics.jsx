import { useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import DashboardCards from "../components/DashboardCards";

const COLORS = ["#1e90ff", "#00f0ff", "#ffcc33", "#ff6a00", "#32cd32", "#da70d6"];

const mockMonthlySpend = [
  { month: "Jan", spend: 2000 },
  { month: "Feb", spend: 2300 },
  { month: "Mar", spend: 1800 },
  { month: "Apr", spend: 2500 },
  { month: "May", spend: 2200 },
];

const mockDepartmentCosts = [
  { name: "Engineering", value: 4000 },
  { name: "Marketing", value: 2000 },
  { name: "Sales", value: 1500 },
  { name: "HR", value: 500 },
];

const mockTopTools = [
  { name: "Adobe CC", cost: 500 },
  { name: "Slack", cost: 300 },
  { name: "Figma", cost: 250 },
];

const mockUserAdoption = [
  { tool: "Adobe CC", adoption: 80 },
  { tool: "Slack", adoption: 95 },
  { tool: "Figma", adoption: 60 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Analytics Dashboard</h1>

     {/* Time Range Picker */}
      <div className="mb-6">
        <label className="mr-2 text-gray-700 dark:text-gray-300">Time Range:</label>
        {["30d", "90d", "1y"].map(range => (
          <button
            key={range}
            className={`px-3 py-1 mr-2 rounded ${timeRange === range ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
            onClick={() => setTimeRange(range)}
          >
            {range}
          </button>
        ))}
      </div>

      {/* KPIs Cards */}
      <DashboardCards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Monthly Spend Evolution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockMonthlySpend}>
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="spend" stroke="#1e90ff" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Department Cost Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockDepartmentCosts}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {mockDepartmentCosts.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Top Expensive Tools</h2>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart layout="vertical" data={mockTopTools}>
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="cost" fill="#ff6a00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">User Adoption Rates</h2>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={mockUserAdoption}>
              <XAxis dataKey="tool" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="adoption" fill="#32cd32" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional BI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Cost Optimization Alerts</h3>
          <p className="text-gray-700 dark:text-gray-300">You have 3 tools with unused licenses. Consider deactivating them.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Unused Tools Warnings</h3>
          <p className="text-gray-700 dark:text-gray-300">5 tools have less than 5 users.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">ROI Calculations</h3>
          <p className="text-gray-700 dark:text-gray-300">Estimated ROI across all tools: 72%</p>
        </div>
      </div>
    </div>
  );
}
