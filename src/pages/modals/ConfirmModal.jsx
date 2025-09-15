import { useState } from "react";

export default function ConfirmModal({ type = "default", message, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (typeof onConfirm !== "function") {
      onClose();
      return;
    }
    setLoading(true);
    try {
      await onConfirm();
    } catch (err) {
      console.error("Confirm failed:", err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Confirmation</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${type === "delete" ? "bg-red-600" : "bg-blue-600"}`}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
