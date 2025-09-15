import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ToolDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/tools/${id}`)
      .then((res) => setTool(res.data))
      .catch((err) => console.error("Failed to fetch tool", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!tool) return <p className="p-6 text-red-500">Tool not found</p>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {tool.name} Details
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <div>
          <span className="font-semibold">Department:</span> {tool.owner_department}
        </div>
        <div>
          <span className="font-semibold">Category:</span> {tool.category}
        </div>
        <div>
          <span className="font-semibold">Users:</span> {tool.active_users_count}
        </div>
        <div>
          <span className="font-semibold">Monthly Cost:</span> €{tool.monthly_cost}
        </div>
        <div>
          <span className="font-semibold">Status:</span>{" "}
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
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Back
        </button>
        <button
          onClick={() => navigate(`/tools/${tool.id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
