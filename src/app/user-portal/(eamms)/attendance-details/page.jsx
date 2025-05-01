"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Calendar } from "lucide-react";

const AttendanceTable = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/attendance-data", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setAttendances(response.data.attendances || []);
    } catch (error) {
      console.error("Error fetching attendance data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return [...attendances].reverse();
    return [...attendances].reverse().filter(item =>
      item?.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.day?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.swipe_in_time_formatted?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.swipe_out_time_formatted?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.leave_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attendances, searchTerm]);

  const columns = [
    { 
      name: "S.N.", 
      selector: (_, index) => index + 1, 
      center: "true",
      compact: "true" 
    },
    { 
      name: "Date", 
      selector: row => row.date, 
      sortable: true, 
      compact: "true",
      hide: "sm" 
    },
    { 
      name: "Day", 
      selector: row => row.day, 
      compact: "true",
      hide: "md" 
    },
    { 
      name: "Swipe In", 
      selector: row => row.swipe_in_time_formatted || "Leave", 
      center: "true",
      compact: "true" 
    },
    { 
      name: "Swipe Out", 
      selector: row => row.swipe_out_time_formatted || "Leave", 
      center: "true",
      compact: "true" 
    },
    { 
      name: "Total Hours", 
      selector: row => row.total_hours || "N/A", 
      center: "true",
      compact: "true" 
    },
    { 
      name: "Leave Type", 
      selector: row => row.leave_type || "N/A", 
      center: "true",
      compact: "true",
      hide: "sm" 
    },
    { 
      name: "Remarks", 
      selector: row => row.remarks || "N/A", 
      wrap: true,
      center: "true",
      grow: 1,
      compact: "true",
      hide: "md" 
    },
  ];

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
        fontSize: "0.75rem",
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
        paddingLeft: "1rem",    // Increased from 0.5rem
        paddingRight: "1rem",   // Increased from 0.5rem
        paddingTop: "0.75rem",  // Increased from 0.5rem
        paddingBottom: "0.75rem", // Increased from 0.5rem
      },
    },
    pagination: {
      style: {
        padding: "0.5rem",
        borderTop: "1px solid #e5e7eb",
        fontSize: "0.75rem",
      },
    },
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-2 sm:p-4">
      <div className="w-[68vw] h-[68vh] max-w-6xl bg-white shadow-lg rounded-lg">
        <div
          className="flex items-center justify-between px-4 py-2 rounded-t-lg text-white"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3">
            <Calendar size={20} className="sm:w-6 sm:h-6" color="white" />
            <span className="text-sm sm:text-base">Monthly Attendance</span>
          </h2>
        </div>

        <div className="p-2 sm:p-4 overflow-auto">
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search records..."
                className="w-full pl-8 pr-3 py-1 sm:pl-10 sm:pr-4 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
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
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredData}
              progressPending={loading}
              pagination
              highlightOnHover
              dense
              noHeader
              responsive
              customStyles={customStyles}
              progressComponent={
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              noDataComponent={
                <div className="py-4 text-center text-gray-500 text-sm">
                  No attendance records found
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="calc(68vh - 200px)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;