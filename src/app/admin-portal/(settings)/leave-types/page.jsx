"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Calendar } from "lucide-react";

const LeaveTypesSettings = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch leave types data
  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/leave-types", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const fetchedLeaveTypes = (response.data.leaveTypes || []).map((item) => ({
        ...item,
        editable: false,
      }));
      setLeaveTypes(fetchedLeaveTypes);
    } catch (error) {
      console.error("Error fetching leave types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleEdit = (index) => {
    const updatedLeaveTypes = [...leaveTypes];
    updatedLeaveTypes[index].editable = true;
    setLeaveTypes(updatedLeaveTypes);
  };

  const handleUpdate = async (index, id) => {
    const updatedLeave = leaveTypes[index];

    // Prepare the object with only the updated fields
    const fieldsToSend = {
      loss_of_pay: parseFloat(updatedLeave.loss_of_pay).toFixed(2),
      outdoor_duty: parseFloat(updatedLeave.outdoor_duty).toFixed(2),
      casual_leave: parseFloat(updatedLeave.casual_leave).toFixed(2),
      earned_leave: parseFloat(updatedLeave.earned_leave).toFixed(2),
      restricted_holiday: parseFloat(updatedLeave.restricted_holiday).toFixed(2),
      casual_leave_approved: parseFloat(updatedLeave.casual_leave_approved).toFixed(2),
      earned_leave_approved: parseFloat(updatedLeave.earned_leave_approved).toFixed(2),
      restricted_holiday_approved: parseFloat(updatedLeave.restricted_holiday_approved).toFixed(2),
    };

    try {
      const response = await axios.post(
        `https://eamms.bluai.ai/api/leave-types/update/${id}`,
        fieldsToSend,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        const updated = [...leaveTypes];
        updated[index] = { ...updated[index], ...fieldsToSend, editable: false };
        setLeaveTypes(updated);
        alert("Leave type details updated successfully.");
      } else {
        alert("Failed to update leave type details.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("An error occurred while updating.");
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return [...leaveTypes];
    return [...leaveTypes].filter(
      (leave) =>
        leave?.user1?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave?.user1?.company_mail?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaveTypes, searchTerm]);

  const columns = [
    { 
      name: "S.N.", 
      selector: (_, index) => index + 1, 
      center: "true",
      compact: "true" 
    },
    {
      name: "Name",
      selector: (row) => row.user1?.first_name,
      cell: (row) => row.user1?.first_name || "N/A",
      sortable: true,
      width: "120px",
    },
    {
      name: "Company Mail",
      selector: (row) => row.user1?.company_mail,
      cell: (row) => row.user1?.company_mail || "N/A",
      sortable: true,
      width: "200px",
      center: "true",
    },
    {
      name: "Loss of Pay",
      selector: (row) => row.loss_of_pay,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="number"
            step="0.01"
            value={row.loss_of_pay || ""}
            onChange={(e) => {
              const updated = [...leaveTypes];
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              updated[index].loss_of_pay = e.target.value;
              setLeaveTypes(updated);
            }}
          />
        ) : row.loss_of_pay || "0.00"
      ),
      width: "150px",
      center: "true",
    },
    {
      name: "Outdoor Duty",
      selector: (row) => row.outdoor_duty,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="number"
            step="0.01"
            value={row.outdoor_duty || ""}
            onChange={(e) => {
              const updated = [...leaveTypes];
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              updated[index].outdoor_duty = e.target.value;
              setLeaveTypes(updated);
            }}
          />
        ) : row.outdoor_duty || "0.00"
      ),
      width: "180px",
      center: "true",
    },
    {
      name: "Casual Leave",
      selector: (row) => row.casual_leave,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="number"
            step="0.01"
            value={row.casual_leave || ""}
            onChange={(e) => {
              const updated = [...leaveTypes];
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              updated[index].casual_leave = e.target.value;
              setLeaveTypes(updated);
            }}
          />
        ) : row.casual_leave || "0.00"
      ),
      width: "180px",
      center: "true",
    },
    {
      name: "Earned Leave",
      selector: (row) => row.earned_leave,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="number"
            step="0.01"
            value={row.earned_leave || ""}
            onChange={(e) => {
              const updated = [...leaveTypes];
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              updated[index].earned_leave = e.target.value;
              setLeaveTypes(updated);
            }}
          />
        ) : row.earned_leave || "0.00"
      ),
      width: "180px",
      center: "true",
    },
    {
      name: "Restricted Holiday",
      selector: (row) => row.restricted_holiday,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="number"
            step="0.01"
            value={row.restricted_holiday || ""}
            onChange={(e) => {
              const updated = [...leaveTypes];
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              updated[index].restricted_holiday = e.target.value;
              setLeaveTypes(updated);
            }}
          />
        ) : row.restricted_holiday || "0.00"
      ),
      width: "200px",
      center: "true",
    },
    {
      name: "Casual Leave Approved",
      selector: (row) => row.casual_leave_approved,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="number"
            step="0.01"
            value={row.casual_leave_approved || ""}
            onChange={(e) => {
              const updated = [...leaveTypes];
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              updated[index].casual_leave_approved = e.target.value;
              setLeaveTypes(updated);
            }}
          />
        ) : row.casual_leave_approved || "0.00"
      ),
      width: "250px",
      center: "true",
    },
    {
      name: "Earned Leave Approved",
      selector: (row) => row.earned_leave_approved,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="number"
            step="0.01"
            value={row.earned_leave_approved || ""}
            onChange={(e) => {
              const updated = [...leaveTypes];
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              updated[index].earned_leave_approved = e.target.value;
              setLeaveTypes(updated);
            }}
          />
        ) : row.earned_leave_approved || "0.00"
      ),
      width: "250px",
      center: "true",
    },
    {
      name: "Restricted Holiday Approved",
      selector: (row) => row.restricted_holiday_approved,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="number"
            step="0.01"
            value={row.restricted_holiday_approved || ""}
            onChange={(e) => {
              const updated = [...leaveTypes];
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              updated[index].restricted_holiday_approved = e.target.value;
              setLeaveTypes(updated);
            }}
          />
        ) : row.restricted_holiday_approved || "0.00"
      ),
      width: "300px",
      center: "true",
    },
    {
      name: "Actions",
      cell: (row) => (
        !row.editable ? (
          <button
            onClick={() => {
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              handleEdit(index);
            }}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition cursor-pointer"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => {
              const index = leaveTypes.findIndex((l) => l.id === row.id);
              handleUpdate(index, row.id);
            }}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
          >
            Update
          </button>
        )
      ),
      width: "120px",
      center: "true",
    },
  ];

  // Custom styles for the DataTable
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
    <div className="w-full h-full flex justify-center items-center px-4 py-6">
      <div className="w-[68vw] h-[68vh] max-w-7xl bg-white shadow-lg rounded-lg">
        <div
          className="flex items-center justify-between px-6 py-3 rounded-t-lg text-white"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <Calendar size={24} color="white" />
            Leave Types
          </h2>
        </div>

        <div className="p-6 overflow-auto">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search leave types..."
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
                  width: "100%",
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
                No leave type records found
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

export default LeaveTypesSettings;