// app/components/EmployeeSearch.tsx (or put inside pages if using pages router)
'use client';

import { useState } from "react";
import axios from "axios";
import {
  Users
} from "lucide-react";
import { FaUserTie } from "react-icons/fa"; // Font Awesome


const EmployeeSearch = () => {
  const [query, setQuery] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/employee-info", {
        params: { name: query },
        headers: { Authorization: localStorage.getItem("token") || "" },
      });

      if (response.data.success) {
        setEmployeeData(response.data.data);
        setError("");
      } else {
        setEmployeeData(null);
        setError(response.data.message || "Employee not found.");
      }
    } catch (err) {
      setEmployeeData(null);
      setError("Error fetching data.");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full max-w-6xl xl:w-[60vw] 2xl:w-full rounded-lg">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 text-white px-4 py-3"style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}>
            <Users className="w-5 h-5" />
            <h5 className="font-semibold text-lg">Employee Info</h5>
          </div>
          <div className="flex items-center gap-2 p-4">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter employee name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
             className="text-white font-medium px-6 py-2 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
             style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {employeeData && (
            <div className="px-4 pb-6">
              <h5 className="text-black font-semibold text-lg border-b pb-2 mb-4 flex items-center">
                 <FaUserTie size={20} color="black" className="me-2"/>Employee Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Name:</label>
                  <div className="text-gray-800 font-medium">
                    {employeeData.full_name}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Designation:</label>
                  <div className="text-gray-800 font-medium">
                    {employeeData.designation}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Department:</label>
                  <div className="text-gray-800 font-medium">
                    {employeeData.department}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Reporting Manager:</label>
                  <div className="text-gray-800 font-medium">
                    {employeeData.reporting_manager}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-600 px-4 pb-4">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSearch;
