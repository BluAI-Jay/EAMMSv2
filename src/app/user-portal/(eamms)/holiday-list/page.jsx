'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Gift } from 'lucide-react';

const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://eamms.bluai.ai/api/holidays', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setHolidays(response.data.holidays || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const filteredHolidays = useMemo(() => {
    if (!searchTerm) return holidays;
    return holidays.filter((holiday) =>
      holiday.holiday?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.day?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [holidays, searchTerm]);

  const columns = [
    {
      name: 'S.N',
      selector: (row, index) => index + 1,
      center: "true",
      compact: "true",
      width: '70px'
    },
    {
      name: 'Holiday',
      selector: row => row.holiday,
      sortable: true,
      center: "true",
      compact: "true",
      width: '360px'
    },
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
      center: "true",
      compact: "true"
    },
    {
      name: 'Day Name',
      selector: row => row.day,
      center: "true",
      compact: "true"
    },
    {
      name: 'Holiday Type',
      selector: row => row.type,
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
        fontSize: '0.875rem',
        color: '#4b5563',
      },
    },
    rows: {
      style: {
        '&:hover': {
          backgroundColor: '#f3f4f6',
        },
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
      },
    },
    pagination: {
      style: {
        padding: '1rem',
        borderTop: '1px solid #e5e7eb',
      },
    },
  };

  return (
    <div className="w-full h-full flex justify-center items-center px-4 py-6">
      <div className="w-[68vw] h-[68vh] max-w-7xl bg-white shadow-lg rounded-lg border border-gray-200">
        <div
          className="flex items-center justify-between px-4 py-2 rounded-t-lg text-white"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <Gift size={24} color="white" /> Holiday List
          </h2>

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
              data={filteredHolidays}
              progressPending={loading}
              pagination
              responsive
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
                  No Holiday list records found
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="calc(68vh - 205px)" // Adjusted for search bar
            />
        </div>
      </div>
    </div>
  );
};

export default HolidayList;
