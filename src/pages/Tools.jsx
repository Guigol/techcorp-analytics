import { useState } from "react";
import ActionDropdown from "../components/ActionDropdown";
import useTools from "../hooks/useTools";

export default function Tools() {
  const { tools, loading, error } = useTools(50);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusColor = {
    active: "bg-green-500 text-white",
    expiring: "bg-orange-400 text-white",
    unused: "bg-red-500 text-white",
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading tools</p>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tools.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tools.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tools</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer">Tool</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer">Department</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Users</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Monthly Cost</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
  {currentItems.map((item, idx) => (
    <tr key={idx} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
        <img src={item.icon_url} alt={item.name} className="w-6 h-6" />
        <a href={item.website_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
          {item.name}
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{item.owner_department}</td>
      <td className="px-6 py-4 whitespace-nowrap">{item.active_users_count}</td>
      <td className="px-6 py-4 whitespace-nowrap">€{item.monthly_cost}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === "active"
              ? "bg-green-500 text-white"
              : item.status === "expiring"
              ? "bg-orange-400 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ActionDropdown />
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          Prev
        </button>
        <span className="px-3 py-1">{currentPage} / {totalPages}</span>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
