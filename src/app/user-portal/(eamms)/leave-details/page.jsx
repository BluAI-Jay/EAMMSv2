"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { BsCardList } from "react-icons/bs";
import { useRouter } from "next/navigation";

const LeaveViewDetails = () => {
  const navigation = useRouter();
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectValue, setSelectValue] = useState("view");

  const fetchLeaveApplications = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/leave-full-details", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setLeaveApplications(response.data.leaveApplications || []);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  const handleWithdraw = async (leaveId) => {
    try {
      await axios.post(
        `https://eamms.bluai.ai/api/leave/withdraw/${leaveId}`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setLeaveApplications((prev) =>
        prev.map((item) =>
          item.id === leaveId ? { ...item, leave_status: "Withdrawn" } : item
        )
      );
    } catch (error) {
      console.error("Error withdrawing leave:", error);
    }
  };

  const handleViewChange = (e) => {
    const value = e.target.value;
    setSelectValue(value);
    if (value === "add") {
      navigation.push("/user-portal/leave-application");
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return [...leaveApplications].reverse();
    return [...leaveApplications].reverse().filter((item) =>
      item?.date_from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.date_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.leave_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.leave_status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaveApplications, searchTerm]);

  const columns = [
    { 
      name: "S.N.", 
      selector: (_, index) => index + 1, 
      center: "true",
      compact: "true" 
    },
    { 
      name: "Date From", 
      selector: row => row.date_from, 
      sortable: true, 
      center: "true",
      compact: "true"
    },
    { 
      name: "Date To", 
      selector: row => row.date_to, 
      center: "true",
      compact: "true"
    },
    { 
      name: "Session From", 
      selector: row => row.session_from,
      cell: row => (
        <span>{formatSessionText(row.session_from)}</span>
      ),
      center: "true",
      compact: "true"
    },
    { 
      name: "Session To", 
      selector: row => row.session_to,
      cell: row => (
        <span>{formatSessionText(row.session_to)}</span>
      ),
      center: "true",
      compact: "true"
    },
    { 
      name: "Leave Type", 
      selector: row => row.leave_type,
      cell: row => (
        <span>{formatSessionText(row.leave_type)}</span>
      ),
      center: "true",
      compact: "true"
    },
    { 
      name: "Cc To", 
      selector: row => row.cc_to,
      center: "true",
      compact: "true"
    },
    { 
      name: "Remarks", 
      selector: row => row.remarks,
      wrap: true,
      center: "true",
      compact: "true"
    },
    {
      name: "Status",
      selector: row => row.leave_status,
      cell: row => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.leave_status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : row.leave_status === "Withdrawn" || row.leave_status === "Rejected"
              ? "bg-red-100 text-red-800"
              : row.leave_status === "Approved"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.leave_status}
        </span>
      ),
      center: "true",
      compact: "true"
    },
    {
      name: "Action",
      cell: row =>
        row.leave_status === "Pending" ? (
          <button
            onClick={() => handleWithdraw(row.id)}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm font-medium cursor-pointer"
          >
            Withdraw
          </button>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        ),
      center: "true",
      compact: "true"
    },
  ];


  // Helper function to format session text
const formatSessionText = (text) => {
  if (!text) return '';
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


// Custom styles for the DataTable
const customStyles = {
    headCells: {
      style: {
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        fontWeight: "600",
        fontSize: "0.75rem",
        backgroundColor: "#f9fafb",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#374151",
        whiteSpace: "nowrap",
      },
    },
    cells: {
      style: {
        fontSize: "0.875rem",
        color: "#4b5563",
      },
    },
    rows: {
      style: {
        "&:not(:last-of-type)": {
          borderBottom: "1px solid #e5e7eb",
        },
        "&:hover": {
          backgroundColor: "#f3f4f6",
        },
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
      },
    },
    pagination: {
      style: {
        padding: "1rem",
        borderTop: "1px solid #e5e7eb",
      },
    },
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[68vw] h-[68vh] max-w-7xl bg-white shadow-lg rounded-lg">
        <div
          className="flex items-center justify-between px-4 py-2 rounded-t-lg text-white"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <BsCardList size={24} color="white" />
            Leave Details
          </h2>

          <div className="relative w-48">
            <select
              className="appearance-none w-full text-gray-700 text-sm font-medium px-5 py-2 pr-10 rounded-md bg-white border border-gray-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectValue}
              onChange={handleViewChange}
            >
              <option value="view">View Details</option>
              <option value="add">Add New Details</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <svg
                className="h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-auto">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search leave details..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            progressPending={loading}
            pagination
            highlightOnHover
            dense
            noHeader
            responsive
            customStyles={{
                ...customStyles,
                table: {
                  style: {
                    Width: '100%',
                  },
                },
              }}
              className="border border-gray-200 rounded-lg overflow-hidden"
              progressComponent={
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              noDataComponent={
                <div className="py-8 text-center text-gray-500">
                  No attendance regularization records found
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="calc(68vh - 218px)" // Adjusted for search bar
          />
        </div>
      </div>
    </div>
  );
};

export default LeaveViewDetails;
