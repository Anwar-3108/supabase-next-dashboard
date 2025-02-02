"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export default function CreateEntryDialog({ onAdd, onAddNotification }) {
  const [formData, setFormData] = useState({
    expense_name: "",
    new: "",
    used: "",
    service: "",
    parts: "",
    bodyshop: "",
    total: "",
  });

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
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name !== "expense_name" && /[^0-9.]/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (
      (e.key >= "0" && e.key <= "9") ||
      e.key === "Backspace" ||
      e.key === "." ||
      e.key === "Tab" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      return;
    }

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/carData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newEntry = await response.json();
        onAdd(newEntry.data);
        onAddNotification(notifications);
        setIsOpen(false);
        setFormData({
          expense_name: "",
          new: "",
          used: "",
          service: "",
          parts: "",
          bodyshop: "",
          total: "",
        });
      } else {
        console.error("Error creating entry");
      }
    } catch (error) {
      console.error("Error creating entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <div>
      <button
        onClick={openDialog}
        className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
      >
        Create Entry
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-[#20333A] to-black text-gray-300 p-6 rounded-lg w-96 relative">
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              <IoClose className="h-6 w-6" />
            </button>

            <h2 className="text-xl text-gray-100 mb-4">Create New Entry</h2>
            <p className="text-gray-400 mb-6">
              Fill in the details below to create a new entry.
            </p>

            {/* Only one form */}
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="expense_name"
                  className="text-left text-gray-300"
                >
                  Expenses
                </label>
                <input
                  id="expense_name"
                  placeholder="expense name"
                  name="expense_name"
                  value={formData.expense_name || ""}
                  onChange={handleChange}
                  className="col-span-3 bg-gray-700 text-gray-200 p-2 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="new" className="text-left text-gray-300">
                  New
                </label>
                <input
                  id="new"
                  name="new"
                  placeholder="new %"
                  value={formData.new || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="col-span-3 bg-gray-700 text-gray-200 p-2 rounded-md"
                  required
                  type="number"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    msAppearance: "none",
                  }}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="used" className="text-left text-gray-300">
                  Used
                </label>
                <input
                  id="used"
                  placeholder="used %"
                  name="used"
                  value={formData.used || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="col-span-3 bg-gray-700 text-gray-200 p-2 rounded-md"
                  required
                  type="number"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    msAppearance: "none",
                  }}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="service" className="text-left text-gray-300">
                  Service
                </label>
                <input
                  id="service"
                  name="service"
                  placeholder="service %"
                  value={formData.service || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="col-span-3 bg-gray-700 text-gray-200 p-2 rounded-md"
                  required
                  type="number"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    msAppearance: "none",
                  }}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="parts" className="text-left text-gray-300">
                  Parts
                </label>
                <input
                  id="parts"
                  name="parts"
                  placeholder="parts %"
                  value={formData.parts || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="col-span-3 bg-gray-700 text-gray-200 p-2 rounded-md"
                  required
                  type="number"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    msAppearance: "none",
                  }}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="bodyshop" className="text-left text-gray-300">
                  Body Shop
                </label>
                <input
                  id="bodyshop"
                  name="bodyshop"
                  placeholder="bodyshop %"
                  value={formData.bodyshop || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="col-span-3 bg-gray-700 text-gray-200 p-2 rounded-md"
                  required
                  type="number"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    msAppearance: "none",
                  }}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="total" className="text-left text-gray-300">
                  Total
                </label>
                <input
                  id="total"
                  placeholder="total %"
                  name="total"
                  value={formData.total || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="col-span-3 bg-gray-700 text-gray-200 p-2 rounded-md"
                  required
                  type="number"
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    msAppearance: "none",
                  }}
                />
              </div>

              <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
