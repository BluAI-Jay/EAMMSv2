'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ClipboardList } from 'lucide-react';

const ShortLeaveApplication = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    select_date: '',
    from_time: '',
    to_time: '',
    session: '',
    cc_to: '',
    reason: ''
  });

  const [selectValue, setSelectValue] = useState("add");

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
      router.push("/user-portal/short-leave-details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const approval_link = "https://eammsv2.bluai.ai/admin-login";

    try {
      const response = await axios.post(
        "https://eamms.bluai.ai/api/short-leave-application",
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
        select_date: '',
        from_time: '',
        to_time: '',
        session: '',
        cc_to: '',
        reason: ''
      });

      router.push("/user-portal/short-leave-details");
    } catch (error) {
      console.error("Error submitting short leave:", error);
      alert("Failed to submit short leave application.");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[68vw] h-fit max-w-6xl bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between px-4 py-2 rounded-t-lg text-white" style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ClipboardList size={20} color="white"/>
            Apply Short Leave
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="select_date" className="block text-sm font-medium text-gray-700">Select Date*</label>
            <input
              type="date"
              id="select_date"
              name="select_date"
              value={formData.select_date}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="from_time" className="block text-sm font-medium text-gray-700">From Time*</label>
              <input
                type="time"
                id="from_time"
                name="from_time"
                value={formData.from_time}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="to_time" className="block text-sm font-medium text-gray-700">To Time*</label>
              <input
                type="time"
                id="to_time"
                name="to_time"
                value={formData.to_time}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="session" className="block text-sm font-medium text-gray-700">Session*</label>
              <select
                id="session"
                name="session"
                value={formData.session}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Session</option>
                <option value="first_half">First Half</option>
                <option value="second_half">Second Half</option>
              </select>
            </div>
            <div>
              <label htmlFor="cc_to" className="block text-sm font-medium text-gray-700">CC To</label>
              <select
                id="cc_to"
                name="cc_to"
                value={formData.cc_to}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select CC To</option>
                <option value="hr">HR</option>
                <option value="manager">Manager</option>
                <option value="others">Others</option>
              </select>
            </div>
            
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              id="reason"
              name="reason"
              rows="3"
              value={formData.reason}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
  );
};

export default ShortLeaveApplication;
