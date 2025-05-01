"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";

const EditRoles = ({ params }) => {
  // Unwrap the params promise
  const unwrappedParams = use(params);
  const { roleId } = unwrappedParams;
  
  const navigation = useRouter();
  const goBack = () => navigation.back();
  const [role, setRole] = useState({ name: "", guard_name: "web", permissions: [] });
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: localStorage.getItem("token") };

        const permissionsRes = await axios.get("https://eamms.bluai.ai/api/permissions", { headers });
        setPermissions(permissionsRes.data.permissions);

        if (roleId) {
          const roleRes = await axios.get(`https://eamms.bluai.ai/api/roles/${roleId}`, { headers });
          setRole({
            name: roleRes.data.role.name,
            guard_name: roleRes.data.role.guard_name,
            permissions: roleRes.data.role.permissions || [],
          });
          setSelectedPermissions(roleRes.data.role.permissions.map(p => p.id));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading role data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId]);

  const handlePermissionChange = (id) => {
    setSelectedPermissions(prev =>
      prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleInputChange = (e) => {
    setRole({ ...role, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = roleId
        ? `https://eamms.bluai.ai/api/roles/${roleId}`
        : "https://eamms.bluai.ai/api/roles";
  
      const payload = {
        name: role.name,
        guard_name: role.guard_name,
        permissions: selectedPermissions
      };
  
      await axios.post(url, payload, {
        headers: { Authorization: localStorage.getItem("token") }
      });
  
      setMessage(roleId ? "Role updated successfully!" : "Role created successfully!");
      setTimeout(() => goBack(), 1000);
    } catch (err) {
      console.error("Failed to save role:", err);
      setMessage("Failed to save role.");
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
            {roleId ? "Edit Role" : "Create Role"}
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
                <label className="block text-gray-700 mb-2 required">Role Name</label>
                <input
                  type="text"
                  name="name"
                  value={role.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 required">Guard Name</label>
                <input
                  type="text"
                  name="guard_name"
                  value={role.guard_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 required">Assign Permissions</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {permissions.map((perm) => (
                  <div key={perm.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`perm-${perm.id}`}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={() => handlePermissionChange(perm.id)}
                    />
                    <label
                      htmlFor={`perm-${perm.id}`}
                      className="ml-2 block text-gray-700 capitalize"
                    >
                      {perm.name}
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
                {roleId ? "Update Role" : "Create Role"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRoles;