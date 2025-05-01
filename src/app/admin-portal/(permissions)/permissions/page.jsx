"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Key } from "lucide-react";
import { useRouter } from "next/navigation";

const PermissionsTable = () => {
  const navigation = useRouter();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPermissions = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/get-permissions-data", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setPermissions(response.data.permissions || []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);


  const handleAddPermission = () => {
    navigation.push("/admin-portal/permissions-create");
  };

  const handleDeletePermission = async (id) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      try {
        await axios.delete(`https://eamms.bluai.ai/api/permission-delete/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setPermissions((prevPermissions) => prevPermissions.filter((perm) => perm.id !== id));
        alert("Permission deleted successfully!");
      } catch (error) {
        console.error("Error deleting permission:", error);
        alert("Failed to delete permission.");
      }
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return [...permissions];
    return [...permissions].filter(
      (perm) =>
        perm?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm?.roles?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm?.guard_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [permissions, searchTerm]);

  const columns = [
    {
      name: "Permission Name",
      selector: (row) => row.name,
      sortable: true,
      center: "true",
      compact: "true"
    },
    {
      name: "Roles",
      selector: (row) => row.roles || "",
      sortable: true,
      center: "true",
      compact: "true"
    },
    {
      name: "Guard Name",
      selector: (row) => row.guard_name,
      sortable: true,
      center: "true",
      compact: "true"
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigation.push(`/admin-portal/permissions-edit/${row.id}`)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeletePermission(row.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
      center: "true",
      compact: "true"
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
    <div className="w-full h-full flex justify-center items-center px-4 py-6">
      <div className="w-[68vw] h-[68vh] max-w-6xl bg-white shadow-lg rounded-lg">
        <div
          className="flex items-center justify-between px-6 py-3 rounded-t-lg text-white"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h5 className="text-xl font-semibold flex items-center gap-3">
            <Key size={24} color="white" />
            Permissions Table
          </h5>
          <button
            onClick={handleAddPermission}
            className="flex items-center gap-1 bg-white text-black hover:bg-gray-500 hover:text-white px-8 py-1 rounded-xl transition cursor-pointer"
          >
            Add Permission
          </button>
        </div>

        <div className="p-6 overflow-auto">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search permissions..."
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
                No permission records found
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

export default PermissionsTable;