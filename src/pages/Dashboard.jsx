import useTools from "../hooks/useTools";
import { FaEuroSign, FaTools, FaBuilding, FaUsers, FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { useSearch } from "../context/SearchContext";
import { useState, useEffect } from "react";
import axios from "axios";

import AddToolModal from "./modals/AddToolModal";
import ToolDetailsModal from "./modals/ToolsDetailsModal";
import ConfirmModal from "./modals/ConfirmModal";

export default function Dashboard() {
  const { tools, loading, error } = useTools(10);
  const { search } = useSearch();
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [localTools, setLocalTools] = useState([]);
  useEffect(() => {
    setLocalTools(tools || []);
  }, [tools]);

  const [addToolOpen, setAddToolOpen] = useState(false);
  const [toolDetails, setToolDetails] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [selectedTools, setSelectedTools] = useState([]);

  const sortableColumns = ["name", "owner_department", "active_users_count", "monthly_cost", "status", "category"];

  const filteredTools = (localTools || []).filter(
    (tool) =>
      (tool.name || "").toLowerCase().includes((search || "").toLowerCase()) ||
      (tool.owner_department || "").toLowerCase().includes((search || "").toLowerCase())
  );

  const sortedTools = [...filteredTools].sort((a, b) => {
    const va = a[sortBy] ?? "";
    const vb = b[sortBy] ?? "";
    const na = typeof va === "number" ? va : va.toString().toLowerCase();
    const nb = typeof vb === "number" ? vb : vb.toString().toLowerCase();
    if (na < nb) return sortOrder === "asc" ? -1 : 1;
    if (na > nb) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSelectTool = (tool) => {
    setSelectedTools(prev => (prev.includes(tool.id) ? prev.filter(id => id !== tool.id) : [...prev, tool.id]));
  };

  const handleAddToolSuccess = (newTool) => {
    setLocalTools(prev => [newTool, ...prev]);
  };

  const handleEditToolSuccess = (updatedTool) => {
    setLocalTools(prev => prev.map(t => (t.id === updatedTool.id ? updatedTool : t)));
    setToolDetails(null);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, tool, ids } = confirmAction;
    try {
      if (type === "toggleStatus" && tool) {
        const newStatus = tool.status === "active" ? "unused" : "active";
        const { data } = await axios.patch(`https://tt-jsonserver-01.alt-tools.tech/tools/${tool.id}`, { status: newStatus });
        setLocalTools(prev => prev.map(t => (t.id === tool.id ? data : t)));
      } else if (type === "delete" && tool) {
        await axios.delete(`https://tt-jsonserver-01.alt-tools.tech/tools/${tool.id}`);
        setLocalTools(prev => prev.filter(t => t.id !== tool.id));
      } else if (type === "bulkToggle" && Array.isArray(ids)) {
        const promises = ids.map(id => {
          const t = localTools.find(x => x.id === id);
          const newStatus = t?.status === "active" ? "unused" : "active";
          return axios.patch(`https://tt-jsonserver-01.alt-tools.tech/tools/${id}`, { status: newStatus });
        });
        const results = await Promise.all(promises);
        const updated = results.map(r => r.data);
        setLocalTools(prev => prev.map(t => {
          const upd = updated.find(u => u.id === t.id);
          return upd ? upd : t;
        }));
      }
    } catch (err) {
      console.error("Confirm action failed", err);
    } finally {
      setConfirmAction(null);
    }
  };

  if (loading) return <p className="p-6 text-gray-700 dark:text-gray-300">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading dashboard</p>;

  const GradientNeonIcon = ({ Icon, gradientId, stops }) => (
    <svg className="w-10 h-10 animate-pulse" viewBox="0 0 24 24">
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

  const columns = [
    { key: "name", label: "Tool" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "owner_department", label: "Department" },
    { key: "active_users_count", label: "Users" },
    { key: "monthly_cost", label: "Monthly Cost" },
    { key: "last_update", label: "Last Update" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-0 text-gray-900 dark:text-gray-100">Internal Tools Dashboard</h1>
      <p className="mb-10 text-gray-700 dark:text-gray-300">Monitor and manage your organization's software tools and expenses</p>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <GradientNeonIcon Icon={FaEuroSign} gradientId="gradBudget" stops={[
              { offset: "0%", color: "#00f0ff" },
              { offset: "50%", color: "#1e90ff" },
              { offset: "100%", color: "#00ffea" }
            ]}/>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Budget</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            €28,750 / €30k <span className="ml-2 inline-block text-sm font-semibold px-3 py-1 rounded-full bg-blue-400 text-white">+12%</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <GradientNeonIcon Icon={FaTools} gradientId="gradTools" stops={[
              { offset: "0%", color: "#ffb347" },
              { offset: "50%", color: "#ffcc33" },
              { offset: "100%", color: "#ffa500" }
            ]}/>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Active Tools</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            147 <span className="ml-2 inline-block text-sm font-semibold px-3 py-1 rounded-full bg-yellow-400 text-white">+8</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <GradientNeonIcon Icon={FaBuilding} gradientId="gradDept" stops={[
              { offset: "0%", color: "#ff00ff" },
              { offset: "50%", color: "#8a2be2" },
              { offset: "100%", color: "#da70d6" }
            ]}/>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Departments</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            8 <span className="ml-2 inline-block text-sm font-semibold px-3 py-1 rounded-full bg-purple-500 text-white">+2</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <GradientNeonIcon Icon={FaUsers} gradientId="gradCost" stops={[
              { offset: "0%", color: "#32cd32" },
              { offset: "50%", color: "#7cfc00" },
              { offset: "100%", color: "#00ff7f" }
            ]}/>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cost per User</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            €156 <span className="ml-2 inline-block text-sm font-semibold px-3 py-1 rounded-full bg-green-500 text-white">+€10</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Tools</h2>
          <div className="flex items-center gap-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" onClick={() => setAddToolOpen(true)}>
              Add New Tool
            </button>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                if (selectedTools.length === 0) {
                  setConfirmAction({ type: "bulkToggle", ids: [] });
                } else {
                  setConfirmAction({ type: "bulkToggle", ids: selectedTools });
                }
              }}
            >
              Bulk toggle
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTools.length === 0 ? (
            <p className="p-6 text-gray-500 dark:text-gray-400">No tools found</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-2 py-2"></th>
                  {columns.map(col => {
                    const isSortable = sortableColumns.includes(col.key);
                    return (
                      <th key={col.key} className={`px-3 py-2 text-left ${isSortable ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" : ""}`}
                          onClick={() => {
                            if (!isSortable) return;
                            if (sortBy === col.key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            else { setSortBy(col.key); setSortOrder("asc"); }
                          }}>
                        {col.label}{" "}
                        {isSortable && (
                          sortBy === col.key ? (sortOrder === "asc" ? <FaSortUp className="inline-block" /> : <FaSortDown className="inline-block" />) : <FaSort className="inline-block text-gray-400 dark:text-gray-500" />
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedTools.map(tool => (
                  <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-2 py-2">
                      <input type="checkbox" checked={selectedTools.includes(tool.id)} onChange={() => toggleSelectTool(tool)} />
                    </td>
                    <td className="px-3 py-2 flex items-center gap-2">
                      <img src={tool.icon_url} alt={tool.name} className="w-6 h-6" />
                      <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium" onClick={() => setToolDetails(tool)}>
                        {tool.name}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{tool.description}</td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{tool.category}</td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{tool.owner_department}</td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{tool.active_users_count}</td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">€{tool.monthly_cost}</td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{tool.last_update}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tool.status === "active" ? "bg-green-500 text-white" :
                        tool.status === "expiring" ? "bg-orange-400 text-white" :
                        "bg-red-500 text-white"
                      }`}>
                        {tool.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 flex gap-2">
                      <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm" onClick={() => setToolDetails(tool)}>View</button>
                      <button className="text-gray-600 dark:text-gray-300 hover:underline text-sm" onClick={() => setConfirmAction({
                        type: "toggleStatus",
                        tool,
                        message: `Are you sure you want to ${tool.status === "active" ? "disable" : "enable"} ${tool.name}?`
                      })}>
                        {tool.status === "active" ? "Disable" : "Enable"}
                      </button>
                      <button className="text-gray-600 dark:text-gray-300 hover:underline text-sm" onClick={() => setToolDetails(tool)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="text-right mt-3">
          <a href="/tools" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all tools →</a>
        </div>
      </div>

      {addToolOpen && <AddToolModal onClose={() => setAddToolOpen(false)} onSuccess={handleAddToolSuccess} />}
      {toolDetails && <ToolDetailsModal tool={toolDetails} onClose={() => setToolDetails(null)} onSuccess={handleEditToolSuccess} />}
      {confirmAction && (
        <ConfirmModal
          type={confirmAction.type || "default"}
          message={confirmAction.message || "Are you sure?"}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
