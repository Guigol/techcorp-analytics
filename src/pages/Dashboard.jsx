import useTools from "../hooks/useTools";
import { FaEuroSign, FaTools, FaBuilding, FaUsers } from "react-icons/fa";

export default function Dashboard() {
  const { tools, loading, error } = useTools(5);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading dashboard</p>;

  const GradientNeonIcon = ({ Icon, gradientId, stops }) => (
    <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {stops.map((stop, idx) => (
            <stop key={idx} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <filter id={`${gradientId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <Icon fill={`url(#${gradientId})`} filter={`url(#${gradientId}-glow)`} />
    </svg>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">

        {/* BUDGET */}
        <div className="bg-white shadow rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <GradientNeonIcon
              Icon={FaEuroSign}
              gradientId="gradBudget"
              stops={[
                { offset: "0%", color: "#00f0ff" },
                { offset: "50%", color: "#1e90ff" },
                { offset: "100%", color: "#00ffea" },
              ]}
            />
          </div>
          <p className="text-gray-500 text-sm">Budget</p>
          <p className="text-xl font-bold">€28,750 / €30k</p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
          </div>
        </div>

        {/* ACTIVE TOOLS */}
        <div className="bg-white shadow rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <GradientNeonIcon
              Icon={FaTools}
              gradientId="gradTools"
              stops={[
                { offset: "0%", color: "#ffb347" },
                { offset: "50%", color: "#ffcc33" },
                { offset: "100%", color: "#ffa500" },
              ]}
            />
          </div>
          <p className="text-gray-500 text-sm">Active Tools</p>
          <p className="text-xl font-bold">147 (+8)</p>
        </div>

        {/* DEPARTMENTS */}
        <div className="bg-white shadow rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <GradientNeonIcon
              Icon={FaBuilding}
              gradientId="gradDept"
              stops={[
                { offset: "0%", color: "#ff00ff" },
                { offset: "50%", color: "#8a2be2" },
                { offset: "100%", color: "#da70d6" },
              ]}
            />
          </div>
          <p className="text-gray-500 text-sm">Departments</p>
          <p className="text-xl font-bold">8 (+2)</p>
        </div>

        {/* COST PER USER */}
        <div className="bg-white shadow rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <GradientNeonIcon
              Icon={FaUsers}
              gradientId="gradCost"
              stops={[
                { offset: "0%", color: "#32cd32" },
                { offset: "50%", color: "#7cfc00" },
                { offset: "100%", color: "#00ff7f" },
              ]}
            />
          </div>
          <p className="text-gray-500 text-sm">Cost per User</p>
          <p className="text-xl font-bold">€156 (+€10)</p>
        </div>
      </div>

      {/* ---- SECTION RECENT TOOLS ---- */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Tools</h2>

        <ul className="divide-y divide-gray-200">
          {tools.map((tool) => (
            <li key={tool.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img src={tool.icon_url} alt={tool.name} className="w-6 h-6" />
                <div>
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-sm text-gray-500">{tool.owner_department}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  tool.status === "active"
                    ? "bg-green-500 text-white"
                    : tool.status === "expiring"
                    ? "bg-orange-400 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {tool.status}
              </span>
            </li>
          ))}
        </ul>

        <div className="text-right mt-3">
          <a href="/tools" className="text-sm text-blue-600 hover:underline">
            View all tools →
          </a>
        </div>
      </div>
    </div>
  );
}
