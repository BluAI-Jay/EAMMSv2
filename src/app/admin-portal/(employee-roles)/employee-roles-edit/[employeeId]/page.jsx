"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";


const EditEmployeeRoles = ({ params }) => {
  // Unwrap the params promise
  const unwrappedParams = use(params);
  const { employeeId } = unwrappedParams;
  
  const navigation = useRouter();
  const goBack = () => navigation.back();
  const [employee, setEmployee] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const [empRes, rolesRes] = await Promise.all([
          axios.get(`https://eamms.bluai.ai/api/employees-role-data/${employeeId}`, {
            headers: { Authorization: localStorage.getItem("token") },
          }),
          axios.get(`https://eamms.bluai.ai/api/roles1`, {
            headers: { Authorization: localStorage.getItem("token") },
          }),
        ]);

        setEmployee(empRes.data);
        setRoles(rolesRes.data.roles);
        setSelectedRoles(empRes.data.role_ids || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const handleCheckboxChange = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://eamms.bluai.ai/api/employees-roles/${employeeId}`,
        { roles: selectedRoles },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      setMessage("Roles updated successfully!");
      setTimeout(() => goBack(), 1000);
    } catch (err) {
      console.error("Failed to update roles:", err);
      setMessage("Failed to update roles.");
    }
  };

  if (loading || !employee) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center px-4 py-6">
      <div className="w-[68vw] max-w-6xl xl:w-4xl xl:h-fit 2xl:w-full bg-white shadow-lg rounded-lg">
        <div
          className="flex items-center justify-between px-6 py-3 rounded-t-lg text-white"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h5 className="text-xl font-semibold flex items-center gap-3">
            <FaEdit size={24} color="white" />
            Edit Employee Roles
          </h5>
          <button
            onClick={goBack}
            className="flex items-center gap-1 bg-white text-black hover:bg-gray-500 hover:text-white px-8 py-1 rounded-xl transition cursor-pointer"
          >
            <BiArrowBack /> Back
          </button>
        </div>

        <div className="p-6">
          {message && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Employee Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={employee.full_name}
                disabled
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Assign Roles</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`role-${role.id}`}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleCheckboxChange(role.id)}
                    />
                    <label
                      htmlFor={`role-${role.id}`}
                      className="ml-2 block text-gray-700"
                    >
                      {role.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={goBack}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Update Roles
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeRoles;