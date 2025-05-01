"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import companyLogo from "../../../../assets/company_logo.png";
import defaultProfilePic from "../../../../assets/photo.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MobileSidebar from "../mobile-sidebar";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const rolesRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    fetchRoles();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rolesRef.current && !rolesRef.current.contains(event.target)) {
        setIsRolesOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("https://eamms.bluai.ai/api/user", {
        headers: { Authorization: token },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        "https://eamms.bluai.ai/api/user-roles",
        {
          headers: { Authorization: token },
        }
      );

      setRoles(response.data.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleRoleClick = async (role) => {
    if (role === "admin") {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.post(
          "https://eamms.bluai.ai/api/admin/switch",
          {},
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          localStorage.setItem("admin", JSON.stringify(response.data.admin));
          window.open("/admin-portal/dashboard", "_blank");
        } else {
          alert("Failed to switch to Admin role.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while switching roles.");
      }
    }
    setIsRolesOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://eamms.bluai.ai/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      <header
        className="w-full h-[7vh] text-white shadow-md bg-gradient-to-r from-blue-600 to-blue-900 fixed top-0 left-0 right-0 h-16 z-40"
        style={{
          background:
            "linear-gradient(125deg, rgb(45, 116, 163), rgb(0, 66, 104))",
        }}
      >
        <div className="flex justify-between items-center h-full px-4 mx-auto">
          {/* Logo */}
          <a href="https://bluai.ai/" className="flex items-center h-full">
            <img
              src={companyLogo.src}
              alt="Company Logo"
              className="h-8 w-auto" // Adjusted logo size to fit header height
            />
          </a>

          {/* Mobile Welcome Text and Hamburger Button */}
          <div className="flex items-center gap-4 md:hidden h-full">
            <div className="flex items-center text-sm">
              <span>Welcome, </span>
              <span className="ml-1">{user?.first_name || "Guest"}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Location */}
            <div className="flex items-center text-sm">
              <i className="fas fa-map-marker-alt mr-1"></i> Mohali
            </div>

            <div className="relative inline-block" ref={rolesRef}>
              <button
                className="flex items-center gap-1 text-sm hover:text-blue-300 cursor-pointer focus:outline-none group"
                onClick={() => setIsRolesOpen(!isRolesOpen)}
                onMouseEnter={() => setIsRolesOpen(true)}
                onMouseLeave={() => setIsRolesOpen(false)}
                aria-haspopup="true"
                aria-expanded={isRolesOpen}
              >
                <BusinessCenterIcon fontSize="small" />
                <span className="relative inline-block">Roles</span>
                <ArrowDropDownIcon
                  className="transition-transform duration-200"
                  style={{ transform: isRolesOpen ? "rotate(180deg)" : "none" }}
                />
              </button>

              {isRolesOpen && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-35 bg-white border border-gray-200 rounded-md shadow-lg z-50 divide-y divide-gray-300"
                  onMouseEnter={() => setIsRolesOpen(true)}
                  onMouseLeave={() => setIsRolesOpen(false)}
                >
                  {roles.length > 0 ? (
                    roles.map((role, idx) => (
                      <button
                        key={`role-${idx}`}
                        onClick={() => handleRoleClick(role)}
                        className={`w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-150 cursor-pointer capitalize ${
                          idx === 0 ? "rounded-t-md" : ""
                        } ${idx === roles.length - 1 ? "rounded-b-md" : ""}`}
                        aria-label={`Select ${role} role`}
                      >
                        {role}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 italic">
                      No roles assigned
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative inline-block" ref={userDropdownRef}>
              <button
                className="flex items-center gap-2 text-sm hover:text-blue-300 cursor-pointer focus:outline-none group"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
                aria-haspopup="true"
                aria-expanded={isUserDropdownOpen}
              >
                <img
                  src={user?.upload_image || defaultProfilePic.src}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-left hidden lg:block relative">
                  <div className="text-xs">Welcome,</div>
                  <div className="text-sm font-semibold">
                    {user?.first_name || "Guest"}
                  </div>
                </div>
                <ArrowDropDownIcon
                  className="transition-transform duration-200"
                  style={{
                    transform: isUserDropdownOpen ? "rotate(180deg)" : "none",
                  }}
                />
              </button>

              {isUserDropdownOpen && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-35 bg-white border border-gray-200 rounded-md shadow-lg z-50 divide-y divide-gray-300"
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      router.push("/user-portal/profile");
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-150 cursor-pointer flex items-center focus:outline-none"
                  >
                    <FaUserCircle size={20} className="me-1" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmModal(true);
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-150 cursor-pointer flex items-center focus:outline-none"
                  >
                    <FaSignOutAlt size={20} className="me-1" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800 text-white absolute w-full z-50 top-16">
            <MobileSidebar />
          </div>
        )}
      </header>

      {/* Add padding to main content to account for fixed header */}
      <div className="pt-16"></div>

      {/* Logout Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop with fade-in animation */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200"
            aria-hidden="true"
          />

          {/* Modal container */}
          <div
            className="relative bg-white rounded-xl shadow-xl w-full max-w-md z-50 transform transition-all duration-200 ease-out"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
          >
            {/* Modal header */}
            <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2
                  id="confirm-modal-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  Confirm Action
                </h2>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to proceed with this action? This cannot
                be undone.
              </p>
            </div>

            {/* Modal footer */}
            <div className="p-6 pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
