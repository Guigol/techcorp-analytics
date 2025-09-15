import { useState, useEffect } from "react";
import ActionDropdown from "../components/ActionDropdown";
import useTools from "../hooks/useTools";
import { useSearch } from "../context/SearchContext";
import DashboardCards from "../components/DashboardCards";
import axios from "axios";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";

export default function Tools() {
  const { tools, loading, error } = useTools(50);
  const { search } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [localTools, setLocalTools] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setLocalTools(tools || []);
  }, [tools]);

  const sortableColumns = ["name", "owner_department", "category", "active_users_count", "monthly_cost", "status"];

  const filteredTools = (localTools || []).filter(
    (tool) =>
      (tool.name || "").toLowerCase().includes((search || "").toLowerCase()) ||
      (tool.owner_department || "").toLowerCase().includes((search || "").toLowerCase()) ||
      (tool.category || "").toLowerCase().includes((search || "").toLowerCase())
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTools.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTools.length / itemsPerPage);

  const toggleStatusColor = (status) => {
    if (status === "active") return "bg-green-500 text-white";
    if (status === "expiring") return "bg-orange-400 text-white";
    return "bg-red-500 text-white";
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

  if (loading) return <p className="p-6 text-gray-700 dark:text-gray-300">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading tools</p>;

  const columns = [
    { key: "name", label: "Tool" },
    { key: "owner_department", label: "Department" },
    { key: "category", label: "Category" },
    { key: "active_users_count", label: "Users" },
    { key: "monthly_cost", label: "Monthly Cost" },
    { key: "status", label: "Status" },
    { key: null, label: "Actions" },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Tools</h1>

      <DashboardCards />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-600 mt-6">
        <div className="flex justify-between items-center p-4 border-b-2 border-gray-300 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tools List</h2>
        </div>

        <div className="overflow-x-auto p-4">
          {currentItems.length === 0 ? (
            <p className="p-6 text-gray-500 dark:text-gray-400">No tools found</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-2 py-2"></th>
                  {columns.map(col => {
                    const isSortable = col.key && sortableColumns.includes(col.key);
                    return (
                      <th
                        key={col.label}
                        className={`px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 ${
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
                              <FaSortUp className="inline-block ml-1" />
                            ) : (
                              <FaSortDown className="inline-block ml-1" />
                            )
                          ) : (
                            <FaSort className="inline-block ml-1 text-gray-400 dark:text-gray-500" />
                          ))}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-2 py-2"></td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <img src={item.icon_url} className="w-6 h-6" />
                      <a
                        href={item.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {item.name}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{item.owner_department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{item.active_users_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">€{item.monthly_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${toggleStatusColor(item.status)}`}
                        onClick={() => toggleStatus(item)}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                          <ActionDropdown
                            tool={item}
                            onStatusChange={(updatedTool) =>
                              setLocalTools((prev) =>
                                prev.map((t) => (t.id === updatedTool.id ? updatedTool : t))
                              )
                            }
                          />
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end mt-4 gap-2 p-4 text-gray-900 dark:text-gray-100">
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Prev
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
