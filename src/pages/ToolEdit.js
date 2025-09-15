import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ToolEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/tools/${id}`)
      .then((res) => setTool(res.data))
      .catch((err) => console.error("Failed to fetch tool", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTool((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.patch(`http://localhost:3001/tools/${id}`, tool);
      navigate(`/tools/${id}`);
    } catch (err) {
      console.error("Failed to save tool", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!tool) return <p className="p-6 text-red-500">Tool not found</p>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Edit {tool.name}
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={tool.name || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Department</label>
          <input
            type="text"
            name="owner_department"
            value={tool.owner_department || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={tool.category || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Users</label>
          <input
            type="number"
            name="active_users_count"
            value={tool.active_users_count || 0}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Monthly Cost (€)</label>
          <input
            type="number"
            name="monthly_cost"
            value={tool.monthly_cost || 0}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
