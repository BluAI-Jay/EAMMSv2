"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BsCheckCircle } from "react-icons/bs";

const AttendanceTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({
    total_hours: "--:--:--",
    swipe_in_time: "--:--:--",
    swipe_out_time: "--:--:--",
  });

  useEffect(() => {
    fetchAttendanceData(selectedDate);
  }, [selectedDate]);

  const fetchAttendanceData = (date) => {
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    axios
      .get(
        `https://eamms.bluai.ai/api/attendance-details?date=${formattedDate}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        setAttendanceData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching attendance details:", error);
      });
  };

  const changeMonth = (direction) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const selectDate = (date) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
    );
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    let calendarDays = [];

    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
    weekdays.forEach((day, index) => {
      calendarDays.push(
        <div
          key={`weekday-${index}`}
          className="w-6 h-7 flex items-center justify-center font-bold bg-gray-200 text-xs md:text-sm"
        >
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-7 h-7"></div>);
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const isToday =
        date === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      const isSelected =
        selectedDate.getDate() === date &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      calendarDays.push(
        <div
          key={date}
          className={`w-6 h-7 flex items-center justify-center cursor-pointer rounded-full text-xs md:text-sm ${
            isSelected ? "bg-blue-500 text-white" : isToday ? "bg-blue-100" : ""
          }`}
          onClick={() => selectDate(date)}
        >
          {date}
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="w-[90vw] md:w-[40vw] lg:w-[50vw] h-auto md:h-[37vh] shadow-lg rounded-xl relative mx-auto">
      <div className="absolute inset-0 rounded-lg shadow-md bg-white overflow-hidden flex flex-col">
        {/* Fixed header */}
        <div
          className="px-4 py-3 text-white text-lg font-semibold flex items-center gap-1.5 shrink-0"
          style={{
            background:
              "linear-gradient(225deg,rgb(45, 116, 163),rgb(0, 66, 104))",
          }}
        >
          <BsCheckCircle className="text-xl" />
          Attendance Tracker
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3 flex flex-col md:flex-col lg:flex-row md:items-start md:justify-between gap-5">
            {/* Calendar */}
            <div className="w-full md:w-full lg:w-1/3 rounded-lg shadow-md p-3 bg-gray-100">
              <div className="flex justify-between items-center mb-2">
                <button
                  className="bg-gray-200 px-2 py-1 rounded text-xs md:text-sm"
                  onClick={() => changeMonth(-1)}
                >
                  &lt;
                </button>
                <h5 className="font-medium text-md">
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h5>
                <button
                  className="bg-gray-200 px-2 py-1 rounded text-xs md:text-sm"
                  onClick={() => changeMonth(1)}
                >
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-7">{renderCalendar()}</div>
            </div>

            {/* Clock */}
            <div className="w-full md:w-full lg:w-2/5 rounded-lg p-3 flex justify-center">
              <Clock />
            </div>

            {/* Attendance Info */}
            <div className="w-full md:w-full lg:w-1/4 space-y-4">
              <div className="bg-gray-50 rounded-lg shadow p-3 text-center">
                <h6 className="text-xs md:text-sm font-semibold mb-1">
                  Working Hours
                </h6>
                <p className="text-blue-600 font-medium text-md break-words">
                  {attendanceData.total_hours ?? "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg shadow p-3 text-center">
                <h6 className="text-xs md:text-sm font-semibold mb-1">
                  Swipe In Time
                </h6>
                <p className="text-blue-600 font-medium text-md break-words">
                  {attendanceData.swipe_in_time ?? "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg shadow p-3 text-center">
                <h6 className="text-xs md:text-sm font-semibold mb-1">
                  Swipe Out Time
                </h6>
                <p className="text-blue-600 font-medium text-md break-words">
                  {attendanceData.swipe_out_time ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Clock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const digitalRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      const hourAngle = (hours % 12) * 30 + minutes * 0.5;
      const minuteAngle = minutes * 6 + seconds * 0.1;
      const secondAngle = seconds * 6 + milliseconds * 0.006;

      if (hourRef.current)
        hourRef.current.style.transform = `rotate(${hourAngle}deg)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `rotate(${minuteAngle}deg)`;
      if (secondRef.current)
        secondRef.current.style.transform = `rotate(${secondAngle}deg)`;

      if (digitalRef.current) {
        digitalRef.current.textContent = `${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }

      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-[8px] md:border-[10px] border-gray-700 bg-black">
        {/* Clock hands */}
        <div
          ref={hourRef}
          className="absolute w-[5px] md:w-[6px] h-10 md:h-12 bg-white origin-bottom left-1/2 top-[30px] md:top-[38px] transform -translate-x-1/2 z-10 rounded-sm"
        />
        <div
          ref={minuteRef}
          className="absolute w-[3px] md:w-[4px] h-14 md:h-17 bg-white origin-bottom left-1/2 top-[14px] md:top-[18px] transform -translate-x-1/2 z-10 rounded-sm"
        />
        <div
          ref={secondRef}
          className="absolute w-[1px] md:w-[2px] h-16 md:h-20 bg-red-600 origin-bottom left-1/2 top-[8px] transform -translate-x-1/2 z-20"
        />

        {/* Center dot */}
        <div className="absolute w-2 md:w-3 h-2 md:h-3 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30" />
      </div>

      {/* Digital Clock */}
      <div
        ref={digitalRef}
        className="mt-2 md:mt-4 text-lg md:text-xl font-mono text-black"
      />
    </div>
  );
};

export default AttendanceTracker;
