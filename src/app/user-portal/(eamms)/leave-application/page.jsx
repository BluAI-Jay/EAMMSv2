'use client'; // if using the App Router in Next.js 13+

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Briefcase
} from 'lucide-react';

const LeaveApplication = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date_from: '',
    date_to: '',
    session_from: '',
    session_to: '',
    leave_type: '',
    cc_to: '',
    remarks: ''
  });
  const [leaveData, setLeaveData] = useState(null);
  const [selectValue, setSelectValue] = useState("add");

  const leaveTypes = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/user-leave-status", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setLeaveData(response.data.leaveTypes);
    } catch (error) {
      console.error("Failed to fetch leave data:", error);
    }
  };

  useEffect(() => {
    leaveTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewChange = (e) => {
    const value = e.target.value;
    setSelectValue(value);
    if (value === "view") {
      router.push("/user-portal/leave-details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const approval_link = "http://localhost:3000";

    try {
      const response = await axios.post(
        "https://eamms.bluai.ai/api/leave-application",
        {
          ...formData,
          approval_link,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      console.log(response.data.message);
      setFormData({
        date_from: '',
        date_to: '',
        session_from: '',
        session_to: '',
        leave_type: '',
        cc_to: '',
        remarks: ''
      });
      router.push("/user-portal/leave-details");
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("Failed to submit leave application.");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[68vw] h-fit max-w-6xl bg-white shadow-lg rounded-lg">
        <div className="flex items-center justify-between px-4 py-2 rounded-t-lg text-white" style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase size={20} color="white"/> Leave Application
          </h2>
          <div className="relative w-50">
              <select
                  className="appearance-none w-full text-black text-sm font-medium px-5 py-2 pr-10 rounded-md bg-white border border-gray-300 outline-none cursor-pointer"
                  value={selectValue}
                  onChange={handleViewChange}
              >
                  <option value="add">Add New Details</option>
                  <option value="view">View Details</option>
              </select>
              {/* Custom icon */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                      className="h-4 w-4 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                  >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
              </div>
          </div>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Date From*</label>
                <input
                  type="date"
                  name="date_from"
                  value={formData.date_from}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium">Date To*</label>
                <input
                  type="date"
                  name="date_to"
                  value={formData.date_to}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Session From*</label>
                <select
                  name="session_from"
                  value={formData.session_from}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="" disabled>Select session from</option>
                  <option value="first_half">First Half</option>
                  <option value="second_half">Second Half</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">Session To*</label>
                <select
                  name="session_to"
                  value={formData.session_to}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="" disabled>Select session to</option>
                  <option value="first_half">First Half</option>
                  <option value="second_half">Second Half</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Leave Type*</label>
                <select
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="" disabled>Select leave type</option>
                  <option value="loss_of_pay">Loss of Pay (LoP) - [{leaveData?.loss_of_pay ?? '0'}]</option>
                  <option value="outdoor_duty">Outdoor Duty (OD) - [{leaveData?.outdoor_duty ?? '0'}]</option>
                  <option value="casual_leave">Casual Leave (CL) - [{leaveData?.casual_leave ?? '0'}]</option>
                  <option value="earned_leave">Earned Leave (EL) - [{leaveData?.earned_leave ?? '0'}]</option>
                  <option value="restricted_holiday">Restricted Holiday (RH) - [{leaveData?.restricted_holiday ?? '0'}]</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">Cc To</label>
                <select
                  name="cc_to"
                  value={formData.cc_to}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="" disabled>Select cc to</option>
                  <option value="hr">HR</option>
                  <option value="manager">Manager</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3"
              ></textarea>
            </div>

            <div className="">
              <button
                type="submit"
                className="text-white font-medium px-6 py-2 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
                style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}
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

export default LeaveApplication;
