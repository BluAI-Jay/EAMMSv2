"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { BsCalendarEvent } from "react-icons/bs";
import { Gift} from "lucide-react";

const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [newRow, setNewRow] = useState({ holiday: '', date: '', day: '', type: '' });
  const [showAddRow, setShowAddRow] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/holidays-admin", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const sortedHolidays = (response.data.holidays || []).sort((a, b) =>
        new Date(a.date) - new Date(b.date)
      );

      setHolidays(sortedHolidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleEdit = (index) => {
    const updated = [...holidays];
    updated[index].editable = true;
    setHolidays(updated);
  };

  const handleUpdate = async (index, id) => {
    const updatedHoliday = holidays[index];

    try {
      const response = await axios.post(
        `https://eamms.bluai.ai/api/holiday-update/${id}`,
        updatedHoliday,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        const updated = [...holidays];
        updated[index].editable = false;
        setHolidays(updated);
      } else {
        alert(response.data.message || "Failed to update holiday.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update holiday.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this holiday?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`https://eamms.bluai.ai/api/holiday-delete/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.data.success) {
        alert("Holiday deleted successfully.");
        fetchHolidays();
      } else {
        alert(response.data.message || "Failed to delete holiday.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("An error occurred while deleting the holiday.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `https://eamms.bluai.ai/api/holiday-create`,
        newRow,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setNewRow({ holiday: '', date: '', day: '', type: '' });
      setShowAddRow(false);
      fetchHolidays();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save holiday.");
    }
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { weekday: 'long' });
  };

  const columns = [
    { 
      name: "S.N", 
      selector: (row, index) => index + 1,
      width: "80px",
      center: "true"
    },
    { 
      name: "Holiday", 
      cell: row => {
        if (row.isNew) {
          return (
            <input
              className="w-full px-2 py-1 border rounded"
              value={newRow.holiday}
              onChange={e => setNewRow({ ...newRow, holiday: e.target.value })}
            />
          );
        }
        return row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            value={row.holiday}
            onChange={(e) => {
              const updated = [...holidays];
              const index = holidays.findIndex(h => h.id === row.id);
              updated[index].holiday = e.target.value;
              setHolidays(updated);
            }}
          />
        ) : row.holiday
      },
      sortable: true,
      center: "true"
    },
    { 
      name: "Date", 
      cell: row => {
        if (row.isNew) {
          return (
            <input
              className="w-full px-2 py-1 border rounded"
              type="date"
              value={newRow.date}
              onChange={e => {
                const selectedDate = e.target.value;
                setNewRow({
                  ...newRow,
                  date: selectedDate,
                  day: getDayName(selectedDate)
                });
              }}
            />
          );
        }
        return row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            type="date"
            value={row.date}
            onChange={(e) => {
              const updated = [...holidays];
              const index = holidays.findIndex(h => h.id === row.id);
              updated[index].date = e.target.value;
              updated[index].day = getDayName(e.target.value);
              setHolidays(updated);
            }}
          />
        ) : row.date
      },
      sortable: true,
      center: "true"
    },
    { 
      name: "Day", 
      cell: row => {
        if (row.isNew) {
          return (
            <input
              className="w-full px-2 py-1 border rounded bg-gray-100"
              value={newRow.day}
              readOnly
            />
          );
        }
        return row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            value={row.day}
            readOnly
          />
        ) : row.day
      },
      sortable: true,
      center: "true"
    },
    { 
      name: "Type", 
      cell: row => {
        if (row.isNew) {
          return (
            <input
              className="w-full px-2 py-1 border rounded"
              value={newRow.type}
              onChange={e => setNewRow({ ...newRow, type: e.target.value })}
            />
          );
        }
        return row.editable ? (
          <input
            className="w-full px-2 py-1 border rounded"
            value={row.type}
            onChange={(e) => {
              const updated = [...holidays];
              const index = holidays.findIndex(h => h.id === row.id);
              updated[index].type = e.target.value;
              setHolidays(updated);
            }}
          />
        ) : row.type
      },
      sortable: true,
      center: "true"
    },
    {
      name: "Actions",
      cell: row => {
        if (row.isNew) {
          return (
            <div className="flex space-x-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition cursor-pointer"
                onClick={() => {
                  setShowAddRow(false);
                  setNewRow({ holiday: '', date: '', day: '', type: '' });
                }}
              >
                Cancel
              </button>
            </div>
          );
        }
        return !row.editable ? (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const index = holidays.findIndex(h => h.id === row.id);
                handleEdit(index);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const index = holidays.findIndex(h => h.id === row.id);
                handleUpdate(index, row.id);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
            >
              Update
            </button>
          </div>
        )
      },
      width: "200px",
      center:"true"
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
            <Gift size={24} color="white" />
            Holiday List
          </h5>
          <button 
            className="bg-white text-black hover:bg-gray-500 hover:text-white px-8 py-1 rounded-xl transition cursor-pointer"
            onClick={() => setShowAddRow(true)}
            disabled={showAddRow}
          >
            Add Holiday
          </button>
        </div>

        <div className="p-6 overflow-auto">
          <DataTable
            columns={columns}
            data={showAddRow ? [{ id: 'new', isNew: true }, ...holidays] : holidays}
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
                No holiday records found
              </div>
            }
            fixedHeader
            fixedHeaderScrollHeight="calc(68vh - 180px)"
          />
        </div>
      </div>
    </div>
  );
};

export default HolidayList;