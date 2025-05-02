"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaBullhorn } from "react-icons/fa";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/user-announcements", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setAnnouncements(response.data.announcements);
    } catch {
      setError("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (

    <div className="relative w-[50vw] md:w-[40vw] lg:w-[50vw] h-[37vh] shadow-lg rounded-xl">
    {/* Overlapping white box */}
    <div className="absolute inset-0 rounded-lg shadow-md overflow-hidden bg-white z-10">
      <div
        className="px-4 py-3 text-white text-lg font-semibold flex items-center gap-2"
        style={{ background: "linear-gradient(225deg,rgb(45, 116, 163),rgb(0, 66, 104))" }}
      >
        <FaBullhorn className="text-xl" />
        Announcements
      </div>
      <div className="p-4 max-h-[31vh] overflow-auto">
        {error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : loading ? (
          <div className="text-center py-6">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <p key={index} className="text-gray-800 mb-2 font-medium">
              {index + 1}. {announcement.announcement}
            </p>
          ))
        ) : (
          <p className="text-center text-gray-500">No announcements available.</p>
        )}
      </div>
    </div>
  </div>
  
      

  );
};

export default Announcements;
