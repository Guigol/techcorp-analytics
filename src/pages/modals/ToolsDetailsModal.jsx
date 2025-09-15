import { useState } from "react";
import axios from "axios";

export default function ToolsDetailsModal({ tool, onClose, onSuccess }) {
  const [form, setForm] = useState({ ...tool });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.put(`https://tt-jsonserver-01.alt-tools.tech/tools/${tool.id}`, {
        ...form,
        monthly_cost: Number(form.monthly_cost) || 0
      });
      if (typeof onSuccess === "function") onSuccess(data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Tool</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-sm">Name</label>
            <input name="name" value={form.name || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Description</label>
            <textarea name="description" value={form.description || ""} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm">Category</label>
              <input name="category" value={form.category || ""} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Department</label>
              <input name="owner_department" value={form.owner_department || ""} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
          <div>
            <label className="block text-sm">Monthly cost (€)</label>
            <input name="monthly_cost" type="number" value={form.monthly_cost || 0} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
