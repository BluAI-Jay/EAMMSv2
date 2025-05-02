"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BsPencilSquare } from "react-icons/bs"; 

const AttendanceRegularization = () => {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [day, setDay] = useState("");
    const [inTime, setInTime] = useState("");
    const [outTime, setOutTime] = useState("");
    const [remarks, setRemarks] = useState("");
    const [selectValue, setSelectValue] = useState("add");

    const updateDay = (selectedDate) => {
        if (selectedDate) {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const selectedDay = new Date(selectedDate).getUTCDay();
            setDay(dayNames[selectedDay]);
        }
    };

    const fetchAttendanceData = async (selectedDate) => {
        if (selectedDate) {
            try {
                const response = await axios.get(`https://eamms.bluai.ai/api/regularization-details?date=${selectedDate}`, {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                if (response.data.status === "success") {
                    setInTime(response.data.data.in_time || "");
                    setOutTime(response.data.data.out_time || "");
                } else {
                    setInTime("");
                    setOutTime("");
                }
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            }
        }
    };

    useEffect(() => {
        updateDay(date);
        fetchAttendanceData(date);
    }, [date]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { date, day, in_time: inTime, out_time: outTime, remarks };

        try {
            await axios.post("https://eamms.bluai.ai/api/regularizationstore", formData, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            setDate("");
            setDay("");
            setInTime("");
            setOutTime("");
            setRemarks("");

            router.push("/user-portal/attendance-regularization-details");
        } catch (error) {
            console.error("Error:", error);
            alert("Error submitting attendance regularization");
        }
    };

    const handleViewChange = (e) => {
        const value = e.target.value;
        setSelectValue(value);
        if (value === "view") {
            router.push("/user-portal/attendance-regularization-details");
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-center p-8">
            <div className="w-full max-w-6xl xl:w-fit 2xl:w-full bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 rounded-t-lg text-white" style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BsPencilSquare size={24} color="white" /> 
                        Attendance Regularization
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
        
                {/* Form Body */}
                <div className="px-6 py-6">
                    <form onSubmit={handleSubmit}>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="border border-gray-300 p-3 text-sm font-semibold ">Date</th>
                                    <th className="border border-gray-300 p-3 text-sm font-semibold ">Day</th>
                                    <th className="border border-gray-300 p-3 text-sm font-semibold ">In Time</th>
                                    <th className="border border-gray-300 p-3 text-sm font-semibold ">Out Time</th>
                                    <th className="border border-gray-300 p-3 text-sm font-semibold ">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border border-gray-300 ">
                                    <td className="border border-gray-300 p-3">
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="w-full px-2 py-1 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                                
                                            />
                                        </div>
                                    </td>
                                    <td className="border border-gray-300  p-3">
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border border-gray-300  rounded-lg bg-gray-100 text-gray-700 shadow-sm"
                                            value={day}
                                            readOnly
                                        />
                                    </td>
                                    <td className="border border-gray-300  p-3">
                                        <div className="relative">
                                            <input
                                                type="time"
                                                className="w-full px-2 py-1 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                                                value={inTime}
                                                onChange={(e) => setInTime(e.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td className="border border-gray-300  p-3">
                                        <div className="relative">
                                            <input
                                                type="time"
                                                className="w-full px-2 py-1 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                                                value={outTime}
                                                onChange={(e) => setOutTime(e.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td className="border border-gray-300  p-3">
                                        <input
                                            type="text"
                                            placeholder="Enter Reason"
                                            className="w-full px-2 py-1 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex mt-4">
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

export default AttendanceRegularization;