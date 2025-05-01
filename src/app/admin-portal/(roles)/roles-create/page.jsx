"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";

const CreateRole = () => {
  const navigation = useRouter();
  const goBack = () => navigation.back();
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get("https://eamms.bluai.ai/api/permissions", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setPermissions(response.data.permissions || []);
      } catch (err) {
        console.error("Error fetching permissions", err);
      }
    };

    fetchPermissions();
  }, []);

  const handleCheckboxChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      await axios.post(
        "https://eamms.bluai.ai/api/roles-create",
        { name: roleName, permissions: selectedPermissions },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setMessage("Role created successfully!");
      setTimeout(() => goBack(), 1500);
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage("An error occurred while creating the role.");
      }
    }
  };

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
            <FaPlusCircle size={24} color="white" />
            Create New Role
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
              <label className="block text-gray-700 mb-2">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
              {errors.name && (
                <div className="text-red-500 text-sm mt-1">{errors.name[0]}</div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Assign Permissions <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`perm-${permission.id}`}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handleCheckboxChange(permission.id)}
                    />
                    <label
                      htmlFor={`perm-${permission.id}`}
                      className="ml-2 block text-gray-700 capitalize"
                    >
                      {permission.name.charAt(0).toUpperCase() + permission.name.slice(1)}
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;