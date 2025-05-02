"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BsPerson } from "react-icons/bs"; // Bootstrap

const EmployeeInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/user-info", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setUserInfo(response.data);
    } catch {
      setError("Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (

    <div className="w-[27vw] md:w-[37vw] lg:w-[27vw] h-[37vh] shadow-lg rounded-xl relative">
  <div className="absolute inset-0">
    <div className="w-full h-full rounded-lg shadow-md bg-white overflow-hidden flex flex-col">
      <div
        className="px-4 py-3 text-white text-lg font-semibold flex items-center gap-1.5"
        style={{
          background: 'linear-gradient(225deg,rgb(45, 116, 163),rgb(0, 66, 104))',
        }}
      >
        <BsPerson  className="text-xl" />
        My Info
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : loading ? (
          <div className="text-center py-6">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <InfoRow label="Name" value={`${userInfo.first_name} ${userInfo.last_name}`} />
            <InfoRow label="Designation" value={userInfo.designation} />
            <InfoRow label="Department" value={userInfo.department} />
            <InfoRow label="Reporting Manager" value={userInfo.reporting_manager} border={false} />
          </div>
        )}
      </div>
    </div>
  </div>
</div>

   
  );
};

const InfoRow = ({ label, value, border = true }) => (
  <div className={`py-4 ${border ? 'border-b' : ''}`}>
    <div className="flex gap-5">
      <div className="w-1/2 font-semibold">{label}:</div>
      <div className="w-2/3">{value}</div>
    </div>
  </div>
);


export default EmployeeInfo;
