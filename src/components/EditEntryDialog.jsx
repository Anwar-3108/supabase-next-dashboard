"use client";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

export default function EditEntryDialog({ invoice, onSubmit, onClose,onAddNotification  }) {
  const [formData, setFormData] = useState(invoice || {});
  const [loading, setLoading] = useState(false);
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

 

  useEffect(() => {
    setFormData(invoice || {});
    fetchNotifications();
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name !== "expense_name" && /[^0-9.]/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "."];

    if ((e.key >= "0" && e.key <= "9") || allowedKeys.includes(e.key)) {
      return;
    }

    e.preventDefault();
  };

  const updateEntry = async () => {
    if (!formData?.id) return console.error("Invalid entry ID");

    onSubmit(formData);

    try {
      setLoading(true);
      const { id, ...updatedData } = formData;
      const response = await axios.patch(`/api/carData/${id}`, updatedData);
      onSubmit(response.data, notifications);
      onAddNotification(notifications);
      onClose();
    } catch (error) {
      console.error("Error updating entry:", error);
      fetchNotifications();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-hidden">
      <div className="bg-gradient-to-r from-[#20333A] to-black text-gray-300 p-6 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          <IoClose className="h-6 w-6" />
        </button>

        <h2 className="text-xl text-gray-100 mb-4">Edit Entry</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateEntry();
          }}
          className="space-y-4"
        >
          {Object.entries(formData).map(([field, value]) =>
            field !== "created_at" && field !== "id" ? (
              <div key={field} className="flex items-center gap-4">
                <label
                  htmlFor={field}
                  className="sm:w-1/3 text-gray-300 capitalize"
                >
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  id={field}
                  name={field}
                  value={value || ""}
                  onChange={handleChange}
                  onKeyDown={field === "expense_name" ? null : handleKeyDown}
                  className="flex-1 bg-gray-700 text-gray-200 p-2 rounded-md"
                  required
                  type={field === "expense_name" ? "text" : "number"}
                />
              </div>
            ) : null
          )}

          <div className="text-right">
            <button
              type="submit"
              className={`px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
