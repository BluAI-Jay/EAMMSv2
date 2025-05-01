"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import companyLogo from "../../../assets/company_logo.png";
import { FaUserPlus, FaUsers, FaSignOutAlt } from "react-icons/fa";

const Header = ({ onNavigate }) => {
  const navigation = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("tokenA");
      navigation.push("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <header
        className="w-full h-[7vh] text-white shadow-md fixed top-0 left-0 right-0 h-16 z-40"
        style={{
          background:
            "linear-gradient(125deg,rgb(45, 116, 163),rgba(18, 24, 40, 1))",
        }}
      >
        <div className="flex justify-between items-center h-full px-4 mx-auto">
          {/* Logo */}
          <a href="https://bluai.ai/" className="flex items-center h-full">
            <img 
              src={companyLogo.src} 
              alt="Company Logo" 
              className="h-8 w-auto" 
            />
          </a>

          <div className="flex gap-4 items-center h-full">
            {/* Hamburger / Close Button - Visible on Small Screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                // Close Icon (X)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                // Hamburger Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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

          <div className="hidden md:flex items-center space-x-4 h-full">
            {/* New User Button */}
            <button
              onClick={() => navigation.push("/admin-portal/new-user")}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-black bg-white text-blue-500 hover:text-blue-800 hover:bg-blue-70 rounded-md transition-colors duration-200 cursor-pointer"
            >
              <FaUserPlus className="text-blue-500" />
              <span>New User</span>
            </button>
          
            {/* Existing Users Button */}
            <button
              onClick={() => navigation.push("/admin-portal/existing-user")}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-black bg-white text-blue-500 hover:text-blue-800 hover:bg-blue-70 rounded-md transition-colors duration-200 cursor-pointer"
            >
              <FaUsers className="text-blue-500 " />
              <span>Existing Users</span>
            </button>
          
            {/* Logout Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-black bg-white text-red-500 hover:text-red-800 hover:bg-red-70 rounded-md transition-colors duration-200 cursor-pointer"
            >
              <FaSignOutAlt className="text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Only shown when mobileMenuOpen is true */}
        {mobileMenuOpen && (
          <div className="sm:hidden w-full bg-gray-800 absolute top-16 left-0 z-50">
            <div className="flex flex-col space-y-3 p-4">
              <button
                onClick={() => {
                  onNavigate("new-user");
                  setMobileMenuOpen(false);
                }}
                className="text-white hover:text-blue-300 text-left py-2"
              >
                New User
              </button>
              <button
                onClick={() => {
                  onNavigate("existing-user");
                  setMobileMenuOpen(false);
                }}
                className="text-white hover:text-blue-300 text-left py-2"
              >
                Existing User
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="text-white hover:text-blue-300 text-left py-2"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Add padding to main content to account for fixed header */}
      <div className="pt-16"></div>

        {/* Logout Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop with fade-in animation */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            aria-hidden="true"
          />
          
          {/* Modal with slide-in animation */}
          <div 
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ease-out sm:scale-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            {/* Modal header */}
            <div className="p-6 pb-0 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-red-50">
                  <svg 
                    className="w-5 h-5 text-red-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                  </svg>
                </div>
                <h2 
                  id="logout-modal-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  Confirm Logout
                </h2>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal content */}
            <div className="p-6 pt-4">
              <p className="text-gray-600">
                You're about to sign out of your account. Any unsaved changes may be lost.
              </p>
            </div>
            
            {/* Modal footer */}
            <div className="p-6 pt-2 flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;