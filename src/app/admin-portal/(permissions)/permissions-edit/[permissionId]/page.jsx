"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";

const EditPermission = ({ params }) => {

  const unwrappedParams = use(params);
  const { permissionId } = unwrappedParams;
  const navigation = useRouter();
  const goBack = () => navigation.back();
  
  const [permission, setPermission] = useState({ name: "", guard_name: "web" });
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: localStorage.getItem("token") };

        const rolesRes = await axios.get("https://eamms.bluai.ai/api/roles", { headers });
        setRoles(rolesRes.data.roles || []);

        if (permissionId) {
          const res = await axios.get(`https://eamms.bluai.ai/api/permissions/${permissionId}`, { headers });
          const perm = res.data.permission;

          setPermission({
            name: perm.name,
            guard_name: perm.guard_name,
          });

          setSelectedRoleId(perm.role_id || "");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading permission data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [permissionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPermission(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = permissionId
        ? `https://eamms.bluai.ai/api/permissions/${permissionId}`
        : "https://eamms.bluai.ai/api/permissions";

      const payload = {
        ...permission,
        role_id: selectedRoleId
      };

      await axios.post(url, payload, {
        headers: { Authorization: localStorage.getItem("token") }
      });

      setMessage(permissionId ? "Permission updated successfully!" : "Permission created successfully!");
      setTimeout(() => goBack(), 1000);
    } catch (err) {
      console.error("Failed to save permission:", err);
      setMessage("Failed to save permission.");
    }
  };

  if (loading) {
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
            {permissionId ? "Edit Permission" : "Create Permission"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2 required">Name</label>
                <input
                  type="text"
                  name="name"
                  value={permission.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 required">Guard Name</label>
                <input
                  type="text"
                  name="guard_name"
                  value={permission.guard_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 required">Assign to Role</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                {roles
                  .filter((role) => role.guard_name === permission.guard_name)
                  .map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </option>
                  ))}
              </select>
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
                {permissionId ? "Update Permission" : "Create Permission"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPermission;