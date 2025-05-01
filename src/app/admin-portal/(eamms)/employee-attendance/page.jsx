"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BiTime } from "react-icons/bi";
import DataTable from "react-data-table-component";
import { downloadCSV, downloadJSON } from "@/utils/exportUtils"; // We'll create this utility
import { FaUsers } from "react-icons/fa";


const EmployeeAttendance = () => {
    const [query, setQuery] = useState('');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://eamms.bluai.ai/api/employee-attendance-search', {
                headers: { Authorization: localStorage.getItem("token") },
                params: { name: query },
            });

            if (response.data.success) {
                setRecords(response.data.data);
            } else {
                setRecords([]);
            }
        } catch (error) {
            console.error(error);
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { name: "Sr No.", selector: (_, index) => index + 1, width: "100px", center: "true" },
        { name: "Employee Name", selector: row => row.emp_name, sortable: true, width: "220px" },
        { name: "Username", selector: row => row.username, center: "true", width: "220px" },
        { 
            name: "Date", 
            selector: row => new Date(row.swipe_in_time).toLocaleDateString(),
            sortable: "true" , width: "100px"
        },
        { 
            name: "Swipe In", 
            selector: row => new Date(row.swipe_in_time).toLocaleTimeString(),
            center: "true", width: "130px" 
        },
        { 
            name: "Swipe Out", 
            selector: row => row.swipe_out_time ? new Date(row.swipe_out_time).toLocaleTimeString() : 'N/A',
            center: "true", width: "130px" 
        },
        { 
            name: "Total Hours Worked", 
            selector: row => row.total_hours,
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
    };

    // Function to handle CSV export
    const handleCSVExport = () => {
        const dataForExport = records.map(record => ({
            "Sr No.": records.indexOf(record) + 1,
            "Employee Name": record.emp_name,
            "Username": record.username,
            "Date": new Date(record.swipe_in_time).toLocaleDateString(),
            "Swipe In": new Date(record.swipe_in_time).toLocaleTimeString(),
            "Swipe Out": record.swipe_out_time ? new Date(record.swipe_out_time).toLocaleTimeString() : 'N/A',
            "Total Hours Worked": record.total_hours
        }));
        downloadCSV(dataForExport, 'employee_attendance');
    };

    // Function to handle JSON export
    const handleJSONExport = () => {
        const dataForExport = records.map(record => ({
            emp_name: record.emp_name,
            username: record.username,
            date: new Date(record.swipe_in_time).toLocaleDateString(),
            swipe_in: new Date(record.swipe_in_time).toLocaleTimeString(),
            swipe_out: record.swipe_out_time ? new Date(record.swipe_out_time).toLocaleTimeString() : null,
            total_hours: record.total_hours
        }));
        downloadJSON(dataForExport, 'employee_attendance');
    };

    // Custom actions for the DataTable
    const actionsMemo = (
        <div className="flex gap-2">
            <button 
                onClick={handleCSVExport}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 cursor-pointer"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Export CSV
            </button>
            <button 
                onClick={handleJSONExport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 cursor-pointer"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Export JSON
            </button>
        </div>
    );

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-full max-h-[72vh] max-w-6xl xl:w-4xl xl:h-fit 2xl:w-full bg-white shadow-xl rounded-lg">
                <div className="flex items-center gap-2 text-white px-4 py-3 rounded-t-xl"style={{
                      background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
                    }}>
                    <h5 className="font-semibold text-lg flex items-center">
                        <FaUsers size={24} color="white" className="me-2"/>
                        Employees Attendances
                    </h5>
                </div>

                <div className="p-6">
                    <div className="flex gap-2 mb-2">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter employee name"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
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
                        <button 
                            className="text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                            style={{
                            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))"}}
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={[...records].reverse()}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        dense
                        responsive
                        customStyles={customStyles}
                        actions={actionsMemo}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                        progressComponent={
                            <div className="py-8 flex justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        }
                        noDataComponent={
                            <div className="py-8 text-center text-gray-500">
                                {query ? "No records found for your search" : "Search for employee attendance records"}
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

export default EmployeeAttendance;