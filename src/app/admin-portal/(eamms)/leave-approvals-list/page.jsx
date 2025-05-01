"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Calendar } from "lucide-react";

const LeaveApprovalList = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeaveApprovals = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/get-leave-approvals-list", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setLeaveApplications(response.data.leaveApplications || []);
    } catch (error) {
      console.error("Error fetching leave approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveApprovals();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return [...leaveApplications].reverse();
    return [...leaveApplications].reverse().filter((item) =>
      item?.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.user?.username1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.date_from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.date_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.leave_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.leave_status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaveApplications, searchTerm]);

 // Helper functions (add these outside your component)
const formatSessionText = (text) => {
  if (!text) return '';
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


// Updated columns array
const columns = [
  { 
    name: "Sr no.", 
    selector: (_, index) => index + 1, 
    width: "100px", 
    center: "true" 
  },
  { 
    name: "First Name", 
    selector: row => row.user?.first_name || "N/A", 
    sortable: true, 
    width: "150px" 
  },
  { 
    name: "Username", 
    selector: row => row.user?.username1 || "N/A", 
    width: "200px" 
  },
  { 
    name: "Date From", 
    selector: row => row.date_from, 
    width: "150px", 
    center: "true" 
  },
  { 
    name: "Date To", 
    selector: row => row.date_to, 
    width: "150px", 
    center: "true" 
  },
  { 
    name: "Session From", 
    selector: row => row.session_from,
    cell: row => <span>{formatSessionText(row.session_from)}</span>,
    width: "150px", 
    center: "true" 
  },
  { 
    name: "Session To", 
    selector: row => row.session_to,
    cell: row => <span>{formatSessionText(row.session_to)}</span>,
    width: "150px", 
    center: "true" 
  },
  { 
    name: "Leave Type", 
    selector: row => row.leave_type,
    cell: row => <span>{formatSessionText(row.leave_type)}</span>,
    width: "150px", 
    center: "true" 
  },
  { 
    name: "Remarks", 
    selector: row => row.remarks || "N/A", 
    width: "150px", 
    wrap: true 
  },
  {
    name: "Status",
    selector: row => row.leave_status,
    cell: row => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.leave_status === "Pending"
          ? "bg-yellow-100 text-yellow-800"
          : row.leave_status === "Approved"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}>
        {row.leave_status}
      </span>
    ),
    width: "120px",
    center: "true"
  },
];

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        fontWeight: "600",
        fontSize: "0.875rem",
        backgroundColor: "#f9fafb",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#374151",
      },
    },
    cells: {
      style: {
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
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
          className="flex items-center justify-between px-6 py-3 rounded-t-lg text-white"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h5 className="text-xl font-semibold flex items-center gap-3">
            <Calendar size={20} color="white" />
            Leave Approvals List
          </h5>
        </div>

        <div className="p-6 overflow-auto">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search leave approvals..."
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
            responsive
            customStyles={{
              ...customStyles,
              table: {
                style: {
                  width: '100%',
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
                No leave approval records found
              </div>
            }
            fixedHeader
            fixedHeaderScrollHeight="calc(68vh - 218px)"
          />
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalList;