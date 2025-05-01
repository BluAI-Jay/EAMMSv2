"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { CheckSquare } from "lucide-react";

const AttendanceRegularizationApprovals = () => {
  const [regularizations, setRegularizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch regularization approvals
  const fetchRegularizations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://eamms.bluai.ai/api/get-regularization-approvals", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setRegularizations(response.data.regularizations || []);
    } catch (error) {
      console.error("Error fetching regularizations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update regularization status
  const updateRegularizationStatus = async (id, action) => {
    try {
      const response = await axios.post(
        `https://eamms.bluai.ai/api/regularization/confirm/${id}`,
        { action },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.status === "success") {
        setRegularizations((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, regularize_status: response.data.regularize_status } : item
          )
        );
      } else {
        alert("An error occurred: " + response.data.message);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRegularizations();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return [...regularizations].filter(reg => reg.regularize_status !== "Withdrawn");
    return [...regularizations]
      .filter(reg => reg.regularize_status !== "Withdrawn")
      .filter((reg) =>
        reg.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.user?.username1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.date?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [regularizations, searchTerm]);

  const columns = [
    { 
      name: "Sr no.", 
      selector: (row, index) => index + 1,
      width: "100px",
      center: "true"
    },
    { 
      name: "First Name", 
      selector: row => row.user?.first_name || "-",
      sortable: true,
      width: "150px"
    },
    { 
      name: "Username", 
      selector: row => row.user?.username1 || "-",
      sortable: true,
      width: "200px"
    },
    { 
      name: "Date", 
      selector: row => row.date,
      sortable: true,
      width: "120px"
    },
    { 
      name: "Day", 
      selector: row => row.day,
      sortable: true,
      width: "100px"
    },
    { 
      name: "In Time", 
      selector: row => row.in_time,
      sortable: true,
      width: "120px"
    },
    { 
      name: "Out Time", 
      selector: row => row.out_time,
      sortable: true,
      width: "150px"
    },
    { 
      name: "Remarks", 
      selector: row => row.remarks || "-",
      wrap: true,
      width: "150px"
    },
    { 
      name: "Status", 
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.regularize_status === "Approved" ? "bg-green-100 text-green-800" :
          row.regularize_status === "Rejected" ? "bg-red-100 text-red-800" :
          "bg-yellow-100 text-yellow-800"
        }`}>
          {row.regularize_status}
        </span>
      ),
      sortable: true,
      width: "120px"
    },
    {
      name: "Action",
      cell: row => (
        row.regularize_status === "Pending" ? (
          <div className="flex gap-2">
            <button
              onClick={() => updateRegularizationStatus(row.id, "approve2")}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => updateRegularizationStatus(row.id, "reject2")}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition cursor-pointer"
            >
              Reject
            </button>
          </div>
        ) : (
          <button 
            className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm cursor-not-allowed"
            disabled
          >
            {row.regularize_status}
          </button>
        )
      ),
      width: "180px",
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
      <div className="w-[68vw] h-[68vh] max-w-7xl bg-white shadow-xl rounded-lg">
        <div
          className="flex items-center gap-2 text-white px-4 py-3 rounded-t-xl text-white"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h5 className="font-semibold text-lg flex items-center gap-3">
            <CheckSquare size={24} color="white" />
            Attendance Regularize Approvals
          </h5>
        </div>

        <div className="p-6 overflow-auto">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search regularization requests..."
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
                No regularization requests found
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

export default AttendanceRegularizationApprovals;