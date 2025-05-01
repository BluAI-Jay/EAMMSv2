"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar, Briefcase, CheckSquare, ClipboardList,
  Users, Gift, Home, MessageSquare
} from "lucide-react";
import { BsPersonCheck, BsPencilSquare } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

const MobileSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { 
      icon: <Home size={20} className="mr-3" />, 
      label: "Home", 
      path: "/dashboard" 
    },
    { divider: true },
    { 
      icon: <BsPersonCheck size={20} className="mr-3" />, 
      label: "Employee Attendance", 
      path: "attendance" 
    },
    { 
      icon: <BsPencilSquare size={20} className="mr-3" />, 
      label: "Attendance Regularization", 
      path: "attendance-regularization" 
    },
    { 
      icon: <Calendar size={20} className="mr-3" />, 
      label: "Monthly Attendance", 
      path: "attendance-details" 
    },
    { 
      icon: <Briefcase size={20} className="mr-3" />, 
      label: "Leave Application", 
      path: "leave-application" 
    },
    { 
      icon: <ClipboardList size={20} className="mr-3" />, 
      label: "Short Leave", 
      path: "short-leave-application" 
    },
    { 
      icon: <CheckSquare size={20} className="mr-3" />, 
      label: "Approvals", 
      path: "approvals" 
    },
    { 
      icon: <Users size={20} className="mr-3" />, 
      label: "Employee Info", 
      path: "employee-info" 
    },
    { 
      icon: <Gift size={20} className="mr-3" />, 
      label: "Holiday List", 
      path: "holiday-list" 
    },
    { 
      icon: <MessageSquare size={20} className="mr-3" />, 
      label: "Raise Ticket", 
      path: "raise-ticket" 
    },
  ];


  return (
    <div className=" relative h-[30vh] w-screen bg-red-300">

        <ul className="pl-4 pt-2 flex flex-col gap-2">
            <li>
            <Calendar className="inline mr-2" />Home
            </li>
            <li>
            <Calendar className="inline mr-2" />Profile
            </li>
            <li>
            <Calendar className="inline mr-2" />Role
            </li>
        </ul>

        <ul className="absolute bottom-4 pl-4 pt-2 flex flex-col gap-2">
            <li>
            <Calendar className="inline mr-2" />Logout
            </li>
        </ul>
        
    </div>
  );
};

export default MobileSidebar;