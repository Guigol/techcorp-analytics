import { useState } from "react";

export default function ActionDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        Actions
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg py-1 z-50">
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
            View
          </button>
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
            Edit
          </button>
          <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
