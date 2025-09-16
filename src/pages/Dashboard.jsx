import useTools from "../hooks/useTools";
import { FaEuroSign, FaTools, FaBuilding, FaUsers, FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { useSearch } from "../context/SearchContext";
import { useState, useEffect } from "react";
import axios from "axios";
import DashboardCards from "../components/DashboardCards";

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

  const [toolDetails, setToolDetails] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [selectedTools, setSelectedTools] = useState([]);

  const sortableColumns = ["name", "owner_department", "active_users_count", "monthly_cost", "status"];

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
    setSelectedTools(prev =>
      prev.includes(tool.id) ? prev.filter(id => id !== tool.id) : [...prev, tool.id]
    );
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
        const { data } = await axios.patch(`http://localhost:3001/tools/${tool.id}`, { status: newStatus });
        setLocalTools(prev => prev.map(t => (t.id === tool.id ? data : t)));
      } else if (type === "delete" && tool) {
        await axios.delete(`http://localhost:3001/tools/${tool.id}`);
        setLocalTools(prev => prev.filter(t => t.id !== tool.id));
      } else if (type === "bulkToggle" && Array.isArray(ids)) {
        const promises = ids.map(id => {
          const t = localTools.find(x => x.id === id);
          const newStatus = t?.status === "active" ? "unused" : "active";
          return axios.patch(`http://localhost:3001/tools/${id}`, { status: newStatus });
        });
        const results = await Promise.all(promises);
        const updated = results.map(r => r.data);
        setLocalTools(prev =>
          prev.map(t => {
            const upd = updated.find(u => u.id === t.id);
            return upd ? upd : t;
          })
        );
      }
    } catch (err) {
      console.error("Confirm action failed", err);
    } finally {
      setConfirmAction(null);
    }
  };

  const toggleStatus = async (tool) => {
    try {
      const newStatus =
        tool.status === "active"
          ? "unused"
          : tool.status === "unused"
          ? "expiring"
          : "active";
      const { data } = await axios.patch(`http://localhost:3001/tools/${tool.id}`, { status: newStatus });
      setLocalTools(prev => prev.map(t => (t.id === tool.id ? data : t)));
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  if (loading) return <p className="p-6 text-gray-700 dark:text-gray-300">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading dashboard</p>;

  const columns = [
    { key: "name", label: "Tool" },
    { key: "owner_department", label: "Department" },
    { key: "active_users_count", label: "Users" },
    { key: "monthly_cost", label: "Monthly Cost" },
    { key: "status", label: "Status" }
  ];

 return  (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-0 text-gray-900 dark:text-gray-100">Internal Tools Dashboard</h1>
      <p className="mb-10 text-gray-700 dark:text-gray-300">
        Monitor and manage your organization's software tools and expenses
      </p>

      <DashboardCards />

      {/* Table */}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 mt-6"
        // style={{
        //   boxShadow: '0 -6px 8px -2px rgba(0,0,0,0.3), -6px 0 8px -2px rgba(0,0,0,0.2), 6px 0 8px -2px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.2)'
        // }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-gray-300 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Tools</h2>
        </div>

        <div className="overflow-x-auto p-4">
          {filteredTools.length === 0 ? (
            <p className="p-6 text-gray-500 dark:text-gray-400">No tools found</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-2 py-2"></th>
                  {columns.map((col) => {
                    const isSortable = sortableColumns.includes(col.key);
                    return (
                      <th
                        key={col.key}
                        className={`px-3 py-2 text-left ${
                          isSortable ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" : ""
                        }`}
                        onClick={() => {
                          if (!isSortable) return;
                          if (sortBy === col.key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          else {
                            setSortBy(col.key);
                            setSortOrder("asc");
                          }
                        }}
                      >
                        {col.label}{" "}
                        {isSortable &&
                          (sortBy === col.key ? (
                            sortOrder === "asc" ? (
                              <FaSortUp className="inline-block" />
                            ) : (
                              <FaSortDown className="inline-block" />
                            )
                          ) : (
                            <FaSort className="inline-block text-gray-400 dark:text-gray-500" />
                          ))}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedTools.map((tool) => (
                  <tr
                    key={tool.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedTools.includes(tool.id)}
                        onChange={() => toggleSelectTool(tool)}
                      />
                    </td>
                    <td className="px-3 py-2 flex items-center gap-2">
                      <img src={tool.icon_url} className="w-6 h-6" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{tool.name}</span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {tool.owner_department}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {tool.active_users_count}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      €{tool.monthly_cost}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                          tool.status === "active"
                            ? "bg-green-500 text-white"
                            : tool.status === "expiring"
                            ? "bg-orange-400 text-white"
                            : "bg-red-500 text-white"
                        }`}
                        onClick={() => toggleStatus(tool)}
                      >
                        {tool.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="text-right mt-3 p-4">
          <a href="/tools" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all tools →
          </a>
        </div>
      </div>

      {toolDetails && (
        <ToolDetailsModal tool={toolDetails} onClose={() => setToolDetails(null)} onSuccess={handleEditToolSuccess} />
      )}
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
