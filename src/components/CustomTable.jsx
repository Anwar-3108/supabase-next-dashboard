"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineEdit, MdDelete, MdNotifications } from "react-icons/md";
import dynamic from "next/dynamic";
const CustomPagination = dynamic(
  () => import("../components/CustomPagination "),
  { ssr: false }
);
const CreateEntryDialog = dynamic(
  () => import("@/components/CreateEntryDialog"),
  { ssr: false }
);
const EditEntryDialog = dynamic(() => import("@/components/EditEntryDialog"), {
  ssr: false,
});
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import Notifications from "./Notifications";
const API_URL = "/api/carData";

export default function CustomTable() {
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const rowsPerPage = 10;

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
  const addNotification = (message) => {
    setNotifications((prevNotifications) => [...prevNotifications, message]);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const params = { search: searchQuery }; 

        if (!searchQuery) {
          params.page = currentPage;
          params.limit = rowsPerPage;
        }

        const response = await axios.get(API_URL, { params });
        const { data, total } = response.data;

        setInvoices(Array.isArray(data) ? data : []);
        setTotalInvoices(total || 0);

        fetchNotifications();
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setInvoices([]);
        setTotalInvoices(0);
        fetchNotifications();
      } finally {
        setIsDataFetched(true);
      }
    };

    fetchInvoices();
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const openEditDialog = (invoice) => setSelectedInvoice(invoice);
  const closeEditDialog = () => setSelectedInvoice(null);

  const handleEditSubmit = (updatedData) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updatedData.id ? updatedData : inv))
    );

    closeEditDialog();
  };

  const confirmDelete = (invoice) => {
    setDeleteEntry(invoice);
  };

  const handleDelete = async () => {
    if (!deleteEntry) return;

    try {
      const response = await axios.delete(`${API_URL}/${deleteEntry.id}`);
      if (response.status === 200) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== deleteEntry.id));
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    } finally {
      setDeleteEntry(null);
    }
  };

  if (!isDataFetched) {
    return (
      <div className="w-full p-6">
        <div className="text-white rounded-lg shadow-xl border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="p-3">
                    <div className="skeleton-box w-32 h-6 rounded bg-gray-50"></div>
                  </th>
                  <th className="p-3">
                    <div className="skeleton-box w-32 h-6 rounded bg-gray-50"></div>
                  </th>
                  <th className="p-3">
                    <div className="skeleton-box w-32 h-6 rounded bg-gray-50"></div>
                  </th>
                  <th className="p-3">
                    <div className="skeleton-box w-32 h-6 rounded bg-gray-50"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="p-3">
                      <div className="skeleton-box w-32 h-6 rounded bg-gray-50"></div>
                    </td>
                    <td className="p-3">
                      <div className="skeleton-box w-32 h-6 rounded bg-gray-50"></div>
                    </td>
                    <td className="p-3">
                      <div className="skeleton-box w-32 h-6 rounded bg-gray-50"></div>
                    </td>
                    <td className="p-3">
                      <div className="skeleton-box w-32 h-6 rounded bg-gray-50"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="text-white rounded-lg shadow-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-center p-2 space-y-4 sm:space-y-0 sm:space-x-4">
         
          <input
            type="search"
            placeholder="Search by Expense Name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full sm:w-64 px-4 py-2 rounded-md text-cyan-300 bg-gray-800 border border-gray-600 focus:outline-none"
          />

         
          <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
            {/* Notifications */}
            <div className="relative">
            
              {/* <MdNotifications className="text-cyan-500 text-2xl" />
      <span className="border-2 p-1.5 border-cyan-500 absolute top-0 right-0 bg-gray-800 text-white text-xs rounded-full w-2.5 h-2.5 flex items-center justify-center">
        3
      </span> */}
              <Notifications notifications={notifications} />
            </div>

           
            <CreateEntryDialog
              onAddNotification={addNotification}
              onAdd={(newEntry) => setInvoices((prev) => [newEntry, ...prev])}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-cyan-300 bg-gradient-to-r from-[#20333A] to-black border-none">
              <tr>
                {[
                  "Expenses",
                  "New",
                  "Used",
                  "Service",
                  "Parts",
                  "Body Shop",
                  "Total",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="p-3 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-transparent border-none"
                  >
                    <td className="p-3" suppressHydrationWarning>
                      {invoice.expense_name}
                    </td>
                    <td className="p-3" suppressHydrationWarning>
                      {invoice.new} %
                    </td>
                    <td className="p-3" suppressHydrationWarning>
                      {invoice.used} %
                    </td>
                    <td className="p-3" suppressHydrationWarning>
                      {invoice.service} %
                    </td>
                    <td className="p-3" suppressHydrationWarning>
                      {invoice.parts} %
                    </td>
                    <td className="p-3" suppressHydrationWarning>
                      {invoice.bodyshop} %
                    </td>
                    <td className="p-3" suppressHydrationWarning>
                      {invoice.total} %
                    </td>
                    <td className="text-center">
                      <div className="flex justify-start ml-4 gap-4">
                        <button
                          className="text-cyan-400 hover:text-cyan-500"
                          onClick={() => openEditDialog(invoice)}
                        >
                          <MdOutlineEdit />
                        </button>
                        <button
                          className="text-cyan-400 hover:text-cyan-500"
                          onClick={() => confirmDelete(invoice)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-3 text-gray-400">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <CustomPagination
          totalPages={Math.ceil(totalInvoices / rowsPerPage)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {selectedInvoice && (
        <EditEntryDialog
          invoice={selectedInvoice}
          onSubmit={handleEditSubmit}
          onClose={closeEditDialog}
          onAddNotification={addNotification}
        />
      )}
      {deleteEntry && (
        <ConfirmDeleteDialog
          onAddNotification={addNotification}
          onConfirm={handleDelete}
          onCancel={() => setDeleteEntry(null)}
        />
      )}
    </div>
  );
}
