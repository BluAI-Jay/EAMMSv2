"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BsCalendarCheck } from "react-icons/bs"; // Bootstrap


const LeaveStatus = () => {
  const [leaveData, setLeaveData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaveStatus = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/user-leave-status", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setLeaveData(response.data.leaveTypes);
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveStatus();
  }, []);

  return (
    <div className="w-[27vw] h-[37vh] shadow-lg rounded-xl bg-white flex flex-col">
  <div className="rounded-lg overflow-hidden flex flex-col flex-1">
    <div
      className="px-4 py-3 text-white text-lg font-semibold flex items-center gap-1.5"
      style={{ background: "linear-gradient(225deg,rgb(45, 116, 163),rgb(0, 66, 104))" }}
    >
      <BsCalendarCheck className="text-xl" />
      Leave Status
    </div>
    <div className="px-4 flex-1 overflow-auto">
      {error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : loading ? (
        <div className="text-center py-6">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : leaveData ? (
        <div className="">
          {[
            { label: "Casual Leave - Approved", value: leaveData.casual_leave_approved },
            { label: "Earned Leave - Approved", value: leaveData.earned_leave_approved },
            { label: "Outdoor Duty - Approved", value: leaveData.outdoor_duty },
            { label: "Restricted Holiday - Approved", value: leaveData.restricted_holiday_approved },
            { label: "Casual Leave - Balance as on", value: leaveData.casual_leave },
            { label: "Earned Leave - Balance as on", value: leaveData.earned_leave },
            { label: "Restricted Holiday - Balance as on", value: leaveData.restricted_holiday },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center py-2 text-gray-700 ${
                item.label !== "Restricted Holiday - Balance as on" ? "border-b border-b-gray-300" : ""
              }`}
            >
              <span>{item.label}</span>
              <span className="font-bold">{item.value !== null ? item.value : "N/A"}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No leave data available</p>
      )}
    </div>
  </div>
</div>

  );
};

export default LeaveStatus;
