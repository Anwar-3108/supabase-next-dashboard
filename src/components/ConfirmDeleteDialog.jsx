import axios from "axios";
import { useEffect, useState } from "react";

export default function ConfirmDeleteDialog({
  onConfirm,
  onCancel,
  onAddNotification,
}) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      const { data } = response;
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  const handleDelete = async () => {
    
    await onConfirm();

  
    onAddNotification(notifications);

 
    fetchNotifications();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-hidden">
      <div className="bg-gradient-to-r from-[#20333A] to-black text-gray-300 p-6 rounded-lg w-96 relative">
        <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
        <p className="mb-4 text-gray-400">This action cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
