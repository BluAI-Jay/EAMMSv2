"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { BsClockHistory } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

const UserDetails = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user data
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/all-users", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      console.log("Fetched Users:", response.data); // Debug line

      const fetchedUsers = (response.data?.data || []).map((user) => ({
        ...user,
        editable: false,
        password1: "",
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

    // Prepare the object with only the updated fields
    const dataToUpdate = {
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      mobile_number: updatedUser.mobile_number,
      company_mail: updatedUser.company_mail,
      username1: updatedUser.username1,
      password1: updatedUser.password1,
    };

    try {
      // Send only the fields that are modified
      const response = await axios.post(
        `https://eamms.bluai.ai/api/all-users/update/${id}`,
        dataToUpdate,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        const updated = [...users];
        updated[index].editable = false; // Disable editing
        setUsers(updated);
        alert("User details updated successfully.");
      } else {
        alert("Failed to update user details.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating.");
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return [...users];
    return [...users].filter((user) =>
      user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.mobile_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.company_mail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.username1?.toLowerCase().includes(searchTerm.toLowerCase())
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
      selector: row => row.first_name,
      cell: row => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.first_name || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex(u => u.id === row.id);
              updated[index].first_name = e.target.value;
              setUsers(updated);
            }}
          />
        ) : row.first_name
      ),
      sortable: true,
      width: "150px"
    },
    { 
      name: "Last Name", 
      selector: row => row.last_name,
      cell: row => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.last_name || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex(u => u.id === row.id);
              updated[index].last_name = e.target.value;
              setUsers(updated);
            }}
          />
        ) : row.last_name
      ),
      sortable: true,
      width: "140px", center: "true",
    },
    { 
      name: "Mobile Number", 
      selector: row => row.mobile_number,
      cell: row => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.mobile_number || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex(u => u.id === row.id);
              updated[index].mobile_number = e.target.value;
              setUsers(updated);
            }}
          />
        ) : row.mobile_number
      ),
      width: "170px", center: "true",
    },
    { 
      name: "Company Mail", 
      selector: row => row.company_mail,
      cell: row => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.company_mail || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex(u => u.id === row.id);
              updated[index].company_mail = e.target.value;
              setUsers(updated);
            }}
          />
        ) : row.company_mail
      ),
      width: "180px", center: "true",
    },
    { 
      name: "Username", 
      selector: row => row.username1,
      cell: row => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="text"
            value={row.username1 || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex(u => u.id === row.id);
              updated[index].username1 = e.target.value;
              setUsers(updated);
            }}
          />
        ) : row.username1
      ),
      width: "180px"
    },
    { 
      name: "Profile Image", 
      cell: row => (
        row.upload_image ? (
          <img
            src={`https://eamms.bluai.ai/storage/${row.upload_image}`}
            alt="User"
            className="img-thumbnail mx-auto rounded-full"
            width="50"
          />
        ) : (
          <span className="text-gray-500">No image</span>
        )
      ),
      width: "180px",
      center: "true"
    },
    { 
      name: "Password", 
      cell: row => (
        row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="password"
            placeholder="New Password"
            value={row.password1 || ""}
            onChange={(e) => {
              const updated = [...users];
              const index = users.findIndex(u => u.id === row.id);
              updated[index].password1 = e.target.value;
              setUsers(updated);
            }}
          />
        ) : "********"
      ),
      width: "150px",
      center: "true"
    },
    {
      name: "Actions",
      cell: row => (
        !row.editable ? (
          <button
            onClick={() => {
              const index = users.findIndex(u => u.id === row.id);
              handleEdit(index);
            }}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition cursor-pointer"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => {
              const index = users.findIndex(u => u.id === row.id);
              handleUpdate(index, row.id);
            }}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
          >
            Update
          </button>
        )
      ),
      width: "120px",
      center: "true"
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
            <Users size={24} color="white" />
            User Details
          </h2>
        </div>

        <div className="p-6 overflow-auto">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search users..."
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

export default UserDetails;