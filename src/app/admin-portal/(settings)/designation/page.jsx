"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Tag } from "lucide-react";

const DesignationsSettings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user data
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/users", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const fetchedUsers = (response.data?.users || []).map((user) => ({
        ...user,
        editable: false,
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].editable = true;
    setUsers(updatedUsers);
  };

  const handleUpdate = async (index, id) => {
    const updatedUser = users[index];

    const userToSend = {
      first_name: updatedUser.first_name,
      mobile_number: updatedUser.mobile_number,
      company_mail: updatedUser.company_mail,
      designation: updatedUser.employeeInfo?.designation,
      department: updatedUser.employeeInfo?.department,
      reporting_manager: updatedUser.employeeInfo?.reporting_manager,
    };

    try {
      const response = await axios.post(
        `https://eamms.bluai.ai/api/user/update/${id}`,
        userToSend,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        const updated = [...users];
        updated[index].editable = false;
        setUsers(updated);
        alert("User details updated successfully.");
      } else {
        alert("Failed to update user details.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("An error occurred while updating.");
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return [...users];
    return [...users].filter(
      (user) =>
        user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.mobile_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.company_mail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.employeeInfo?.designation
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user?.employeeInfo?.department
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user?.employeeInfo?.reporting_manager
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const columns = [
    { 
      name: "S.N.", 
      selector: (_, index) => index + 1, 
      center: "true",
      compact: "true" 
    },
    {
      name: "First Name",
      selector: (row) => row.first_name,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.first_name || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex((u) => u.id === row.id);
              updated[index].first_name = e.target.value;
              setUsers(updated);
            }}
          />
        ) : (
          row.first_name
        )
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobile_number,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.mobile_number || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex((u) => u.id === row.id);
              updated[index].mobile_number = e.target.value;
              setUsers(updated);
            }}
          />
        ) : (
          row.mobile_number
        )
      ),
      sortable: true,
      width: "200px",
      center: "true",
    },
    {
      name: "Company Mail",
      selector: (row) => row.company_mail,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.company_mail || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex((u) => u.id === row.id);
              updated[index].company_mail = e.target.value;
              setUsers(updated);
            }}
          />
        ) : (
          row.company_mail
        )
      ),
      sortable: true,
      width: "200px",
      center: "true",
    },
    {
      name: "Designation",
      selector: (row) => row.employeeInfo?.designation,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.employeeInfo?.designation || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex((u) => u.id === row.id);
              if (!updated[index].employeeInfo)
                updated[index].employeeInfo = {};
              updated[index].employeeInfo.designation = e.target.value;
              setUsers(updated);
            }}
          />
        ) : (
          row.employeeInfo?.designation || ""
        )
      ),
      sortable: true,
      width: "180px",
      center: "true",
    },
    {
      name: "Department",
      selector: (row) => row.employeeInfo?.department,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.employeeInfo?.department || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex((u) => u.id === row.id);
              if (!updated[index].employeeInfo)
                updated[index].employeeInfo = {};
              updated[index].employeeInfo.department = e.target.value;
              setUsers(updated);
            }}
          />
        ) : (
          row.employeeInfo?.department || ""
        )
      ),
      sortable: true,
      width: "180px",
      center: "true",
    },
    {
      name: "Reporting Manager",
      selector: (row) => row.employeeInfo?.reporting_manager,
      cell: (row) => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.employeeInfo?.reporting_manager || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex((u) => u.id === row.id);
              if (!updated[index].employeeInfo)
                updated[index].employeeInfo = {};
              updated[index].employeeInfo.reporting_manager = e.target.value;
              setUsers(updated);
            }}
          />
        ) : (
          row.employeeInfo?.reporting_manager || ""
        )
      ),
      sortable: true,
      width: "230px",
      center: "true",
    },
    {
      name: "Actions",
      cell: (row) => (
        !row.editable ? (
          <button
            onClick={() => {
              const index = users.findIndex((u) => u.id === row.id);
              handleEdit(index);
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition cursor-pointer"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => {
              const index = users.findIndex((u) => u.id === row.id);
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

  // Custom styles for DataTable
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
            <Tag size={24} color="white" />
            Designations
          </h2>
        </div>

        <div className="p-6 overflow-auto">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search designations..."
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
                No user records found
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

export default DesignationsSettings;