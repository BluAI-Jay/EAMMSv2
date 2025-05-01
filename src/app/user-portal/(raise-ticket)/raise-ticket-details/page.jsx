"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { BsTicketPerforated } from "react-icons/bs";
import { useRouter } from "next/navigation";

const RaiseTicketDetails = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectValue, setSelectValue] = useState("view");

  const fetchTickets = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/raise-ticket-data", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleViewChange = (e) => {
    const value = e.target.value;
    setSelectValue(value);
    if (value === "add") {
      router.push("/user-portal/raise-ticket");
    }
  };

  const filteredTickets = useMemo(() => {
    if (!searchTerm) return [...tickets].reverse();
    return [...tickets].reverse().filter((ticket) =>
      ticket?.ticket_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.service_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.service_sub_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.service_sub_sub_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.issue_description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tickets, searchTerm]);

  const columns = [
    {
      name: "S.N.",
      selector: (_, index) => index + 1,
      center: "true",
      compact: "true",
      width: "80px"
    },
    {
      name: "Ticket No",
      selector: row => row.ticket_no,
      sortable: true,
      center: "true",
      compact: "true",
      width: "230px"
    },
    {
      name: "Service Category",
      selector: row => row.service_category,
      center: "true",
      compact: "true",
      width: "150px"
    },
    {
      name: "Sub Category",
      selector: row => row.service_sub_category,
      center: "true",
      compact: "true",
      width: "150px"
    },
    {
      name: "Sub SubCategory",
      selector: row => row.service_sub_sub_category,
      center: "true",
      compact: "true",
      width: "150px"
    },
    {
      name: "Issue Description",
      selector: row => row.issue_description,
      wrap: true,
      center: "true",
      compact: "true",
      width: "200px"
    },
    {
      name: "Image",
      selector: row => row.image,
      cell: row =>
        row.image ? (
          <img
            src={`https://eamms.bluai.ai/storage/${row.image}`}
            alt="Ticket"
            className="w-24 h-auto rounded-md mx-auto"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        ),
      center: "true",
      compact: "true"
    }
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
        borderBottom: "1px solid #e5e7eb",
        "&:hover": {
          backgroundColor: "#f3f4f6",
        },
        padding: "0.75rem",
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
          className="flex items-center justify-between px-4 py-2 rounded-t-lg text-white"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <BsTicketPerforated size={24} color="white" />
            Raise Ticket Details
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
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-white">
          <input
            type="text"
            placeholder="Search by category, ticket no, description..."
            className="w-full mb-3 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredTickets}
              pagination
              responsive
              striped
              highlightOnHover
              dense
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
          )}
        </div>
      </div>
    </div>
  );
};

export default RaiseTicketDetails;
