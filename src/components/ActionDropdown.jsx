import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ActionDropdown({ tool, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Fermer le menu si on clique à l’extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/tools/${tool.id}`);
    setOpen(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/tools/${tool.id}/edit`);
    setOpen(false);
  };

  const handleToggleStatus = async (e) => {
    e.preventDefault();
    try {
      const newStatus =
        tool.status === "active"
          ? "unused"
          : tool.status === "unused"
          ? "expiring"
          : "active";
      const { data } = await axios.patch(`http://localhost:3001/tools/${tool.id}`, {
        status: newStatus,
      });
      if (onStatusChange) onStatusChange(data); // callback pour mettre à jour le state parent
    } catch (err) {
      console.error("Failed to toggle status", err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={(e) => { e.preventDefault(); setOpen(!open); }}
        className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        Actions
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
          <button
            onClick={handleViewDetails}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            View Details
          </button>
          <button
            onClick={handleEdit}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Edit
          </button>
          <button
            onClick={handleToggleStatus}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {tool.status === "active" ? "Disable" : "Enable"}
          </button>
        </div>
      )}
    </div>
  );
}
