"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock, Calendar, User, Briefcase, ChevronDown, ClipboardList,
  Users, Gift, Ticket, Home, Power, Menu
} from "lucide-react";
import { BsPersonCheck, BsPencilSquare } from "react-icons/bs";
import { FaSignOutAlt  } from 'react-icons/fa';

const Sidebar = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEAMMSOpen, setIsEAMMSOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 640; // Tailwind's `sm` breakpoint
      setIsMobile(mobileView);
      if (!mobileView) setShowMobileMenu(false);
      else setIsCollapsed(false); // Ensure sidebar is not collapsed on mobile
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleEamms = () => {
    setIsEAMMSOpen(!isEAMMSOpen);
  };

  const handleNavigation = (path) => {
    router.push(`/user-portal/${path}`);
    if (isMobile) setShowMobileMenu(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("https://eamms.bluai.ai/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
    {/* Mobile Menu Toggle Button */}
    <button
      className="sm:block md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
      onClick={() => setShowMobileMenu(!showMobileMenu)}
    >
      <Menu size={24} />
    </button>
  
    {/* Sidebar */}
    <div
      className={`
        text-white flex flex-col
        transition-all duration-300
        h-full w-[15vw] xl:w-[19vw] 2xl:w-[16vw]
      `} 
      style={{
        background: "linear-gradient(125deg, rgb(49, 101, 136), rgb(0, 66, 104))",
      }}
    >
      {/* Sidebar Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Custom scrollbar styling */}
        <style jsx>{`
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: transparent;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.3);
            border-radius: 3px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.5);
          }
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
          }
        `}</style>
  
        {/* Main Navigation */}
        <div className="flex flex-col pt-4">
          <button
            onClick={() => handleNavigation("dashboard")}
            className="flex items-center justify-center py-4 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer w-full group"
          >
            <div className="flex items-center justify-center sm:justify-start md:justify-start lg:justify-start">
              <Home size={20} className="sm:mr-0 md:mr-0 lg:mr-2" />
              <span className="hidden sm:hidden md:hidden lg:inline">Home</span>
            </div>
          </button>
          <hr className="border-gray-300" />
          <button
            onClick={() => handleNavigation("profile")}
            className="flex items-center justify-center py-4 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer w-full group"
          >
            <div className="flex items-center justify-center sm:justify-start md:justify-start lg:justify-start">
              <User size={20} className="sm:mr-0 md:mr-0 lg:mr-2" />
              <span className="hidden sm:hidden md:hidden lg:inline">User Profile</span>
            </div>
          </button>
        </div>
  
        {/* EAMMS Section */}
        <div className="flex flex-col">
          <hr className="border-gray-300" />
          <button
            onClick={handleToggleEamms}
            className="relative flex items-center justify-center w-full py-4 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer px-4"
          >
            {/* Show only icon on sm/md, show text on larger screens */}
            <div className="lg:block absolute left-0 right-0 text-center">EAMMS</div>
            <ChevronDown 
              size={20} 
              className={`ml-auto transition-transform duration-200 ${
                isEAMMSOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          <hr className="border-gray-300" />
          {isEAMMSOpen && (
            <ul className="text-sm bg-gray-600">
              <li>
                <button
                  onClick={() => handleNavigation("/attendance")}
                  className="w-full hover:bg-gray-800 p-4 flex items-center justify-center sm:justify-center md:justify-center lg:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer"
                >
                  <BsPersonCheck size={20} />
                  <span className="hidden sm:hidden md:hidden lg:inline">Employee Attendance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/attendance-regularization")}
                  className="w-full hover:bg-gray-800 p-4 flex items-center justify-center sm:justify-center md:justify-center lg:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer"
                >
                  <BsPencilSquare size={20} />
                  <span className="hidden sm:hidden md:hidden lg:inline">Attendance Regularization</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/attendance-details")}
                  className="w-full hover:bg-gray-800 p-4 flex items-center justify-center sm:justify-center md:justify-center lg:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer"
                >
                  <Calendar size={20} />
                  <span className="hidden sm:hidden md:hidden lg:inline">Monthly Attendance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/leave-application")}
                  className="w-full hover:bg-gray-800 p-4 flex items-center justify-center sm:justify-center md:justify-center lg:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer"
                >
                  <Briefcase size={20} />
                  <span className="hidden sm:hidden md:hidden lg:inline">Leave Application</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/short-leave-application")}
                  className="w-full hover:bg-gray-800 p-4 flex items-center justify-center sm:justify-center md:justify-center lg:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer"
                >
                  <ClipboardList size={20} />
                  <span className="hidden sm:hidden md:hidden lg:inline">Short Leave</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/employee-info")}
                  className="w-full hover:bg-gray-800 p-4 flex items-center justify-center sm:justify-center md:justify-center lg:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer"
                >
                  <Users size={20} />
                  <span className="hidden sm:hidden md:hidden lg:inline">Employee Info</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/holiday-list")}
                  className="w-full hover:bg-gray-800 p-4 flex items-center justify-center sm:justify-center md:justify-center lg:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer"
                >
                  <Gift size={20} />
                  <span className="hidden sm:hidden md:hidden lg:inline">Holiday List</span>
                </button>
              </li>
            </ul>
          )}
          <hr className="border-gray-300" />
        </div>
  
        {/* Raise Ticket */}
        <button
          onClick={() => handleNavigation("raise-ticket")}
          className="flex items-center justify-center py-4 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer w-full group"
        >
          <div className="flex items-center justify-center sm:justify-start md:justify-start lg:justify-start">
            <Ticket size={20} className="sm:mr-0 md:mr-0 lg:mr-2" />
            <span className="hidden sm:hidden md:hidden lg:inline">Raise Ticket</span>
          </div>
        </button>
        <hr className="border-gray-300" />
  
        {/* Logout */}
        <div className="mt-auto">
          <hr className="border-gray-300" />
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center justify-center py-4 text-sm font-semibold text-red-500 hover:bg-gray-800 hover:text-white cursor-pointer w-full group"
          >
            <FaSignOutAlt className="text-red-500 sm:mr-0 md:mr-0 lg:mr-2" />
            <span className="hidden sm:hidden md:hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  
    {/* Logout Modal */}
    {showLogoutModal && (
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
              onClick={() => setShowLogoutModal(false)}
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
              onClick={() => setShowLogoutModal(false)}
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

export default Sidebar;