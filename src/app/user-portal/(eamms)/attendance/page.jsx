'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { BsPersonCheck, BsBoxArrowInRight, BsClockHistory, BsCalendar3 } from "react-icons/bs";

const AttendanceSystem = () => {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [time, setTime] = useState(""); // Initialize as empty string
  const [date, setDate] = useState(""); // Initialize as empty string
  const [swipeStatus, setSwipeStatus] = useState({ has_swiped_in: false, has_swiped_out: false });
  const [recentSwipes, setRecentSwipes] = useState([]);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [officeLocations, setOfficeLocations] = useState([]);
  const [maxDistance, setMaxDistance] = useState(null); // Default 50 meters

  useEffect(() => {
    console.log("Component mounted - initializing...");
    fetchAttendanceData();
    fetchSwipeStatus();
    fetchRecentSwipes();
    fetchOfficeLocations();
    requestLocationPermission();

    // Set initial time/date immediately
    setTime(new Date().toLocaleTimeString("en-GB"));
    setDate(new Date().toLocaleDateString("en-GB"));

    // Then update every second
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-GB"));
      setDate(new Date().toLocaleDateString("en-GB"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const fetchOfficeLocations = () => {
    setLoadingLocations(true);
    axios.get("https://eamms.bluai.ai/api/office-locations", {
      headers: { Authorization: localStorage.getItem("token") }
    })
      .then(({ data }) => {
        console.log("Office locations data:", data); // Check the actual response structure
        // Make sure data.office_locations exists and is an array
        const locations = Array.isArray(data.office_locations) ? data.office_locations : [];
        setOfficeLocations(locations);
        setMaxDistance(data.max_distance);
        setLoadingLocations(false);
      })
      .catch(error => {
        console.error("Failed to fetch office locations:", error);
        setError("Failed to load office locations. Using default settings.");
        setLoadingLocations(false);
      });
  };

  // Calculate distance between two coordinates in meters
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distance = R * c * 1000; // Convert kilometers to meters
    console.log(`Distance calculated: ${distance.toFixed(2)} meters`);
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const requestLocationPermission = () => {
    console.log("Requesting location permission...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location access granted", position.coords);
          setLocationPermissionGranted(true);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          console.log(`Current location: ${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error("Location error:", error);
          handleLocationError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation not supported");
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleLocationError = (error) => {
    console.error("Location error occurred:", error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError("Location permission denied. Please allow it to proceed.");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("Location unavailable. Please check your GPS or network.");
        break;
      case error.TIMEOUT:
        setError("Location request timed out. Try again.");
        break;
      default:
        setError("An unknown error occurred while fetching location.");
        break;
    }
  };
  const checkLocation = (callback) => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
  
    if (loadingLocations) {
      setError("Office locations are still loading...");
      return;
    }
  
    if (!officeLocations || officeLocations.length === 0) {
      setError("No office locations available. Please contact support.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const employeeLat = position.coords.latitude;
        const employeeLon = position.coords.longitude;
        console.log("Employee location:", employeeLat, employeeLon);
        console.log("Office locations:", officeLocations);
  
        // Calculate distances to all ACTIVE office locations
        const activeLocations = officeLocations.filter(loc => loc.is_active);
        if (activeLocations.length === 0) {
          setError("No active office locations available. Attendance marking is disabled.");
          return;
        }
  
        const distances = activeLocations.map((office) => {
          console.log("Checking office location:", office.name, office.latitude, office.longitude);
          const distance = getDistanceFromLatLonInMeters(
            office.latitude,
            office.longitude,
            employeeLat,
            employeeLon
          );
          console.log(`Distance to ${office.name}: ${distance.toFixed(2)} meters`);
          return { office, distance };
        });
  
        // Find the nearest active office
        const nearest = distances.reduce((prev, current) => 
          (prev.distance < current.distance) ? prev : current
        );
  
        console.log(`Nearest active office: ${nearest.office.name} (${nearest.distance.toFixed(2)} meters)`);
  
        // Use the office-specific max_distance instead of global maxDistance
        const officeMaxDistance = nearest.office.max_distance || maxDistance;
        
        if (nearest.distance <= officeMaxDistance) {
          console.log("Within allowed distance - proceeding with action");
          callback();
        } else {
          const errorMsg = `You are ${nearest.distance.toFixed(2)} meters away from ${nearest.office.name}. 
                           Maximum allowed distance is ${officeMaxDistance} meters.`;
          console.log(errorMsg);
          setError(errorMsg);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        handleLocationError(error);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };
  
  

  const handleSwipe = (type) => {
    console.log(`Attempting ${type}...`);
    checkLocation(() => {
      console.log(`Proceeding with ${type}...`);
      setLoading(true);
      setError(null);
      
      axios.post(`https://eamms.bluai.ai/api/attendance/${type}`, {}, {
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(({ data }) => {
          console.log(`${type} response:`, data);
          if (data.message) {
            console.log(`${type} successful`);
            fetchSwipeStatus();
            fetchRecentSwipes();
            fetchAttendanceData();
          } else if (data.error) {
            console.error(`${type} error:`, data.error);
            setError(data.error);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error(`Swipe ${type} Error:`, error);
          setError("Swipe action failed. Please try again.");
          setLoading(false);
        });
    });
  };


  const fetchSwipeStatus = () => {
    axios.get("https://eamms.bluai.ai/api/attendance/swipe-status", {
      headers: { Authorization: localStorage.getItem("token") }
    })
      .then(({ data }) => {
        setSwipeStatus(data);
        setError(null);
      })
      .catch(() => setError("Failed to fetch swipe status."));
  };

  const fetchRecentSwipes = () => {
    axios.get("https://eamms.bluai.ai/api/attendance/recent-swipes", {
      headers: { Authorization: localStorage.getItem("token") }
    })
      .then(({ data }) => {
        setRecentSwipes(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError("Failed to fetch recent swipes."));
  };

  const fetchAttendanceData = () => {
    axios.get("https://eamms.bluai.ai/api/attendance-data", {
      headers: { Authorization: localStorage.getItem("token") }
    })
      .then(({ data }) => {
        setAttendanceData(data);
        setError(null);
      })
      .catch(() => setError("Failed to fetch attendance data."));
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-12">
      <div className="w-full max-w-6xl xl:w-fit 2xl:w-full bg-white rounded-lg shadow-lg">
        <div className="text-white py-3 px-4 rounded-t-lg" style={{ background: 'linear-gradient(225deg,rgb(45, 116, 163),rgb(0, 66, 104))' }}>
          <h2 className="text-lg font-semibold flex gap-2 ">
          <BsPersonCheck size={24} color="white" /> Employee Attendance
          </h2>
        </div>

        {error && (
          <p className="text-center text-red-500 mt-3">{error}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-12">

          {/* Monthly Summary */}
          <div className="bg-white border border-gray-300 shadow-md rounded-lg min-h-[230px]">
            <div className="text-white font-semibold p-3 rounded-t-lg flex" style={{ background: 'linear-gradient(225deg,rgb(45, 116, 163),rgb(0, 66, 104))' }}>
              <BsCalendar3 size={20} className="me-2" />Monthly Summary: {attendanceData?.first_name || 'Guest'}
            </div>
            <div className="p-4 space-y-2">
              <p className="flex justify-between">
                <span>Present Days</span>
                <strong>{attendanceData?.presentDays || 0}</strong>
              </p>
              <p className="flex justify-between">
                <span>LOP</span>
                <strong>{attendanceData?.daysCount1 || 0}</strong>
              </p>
              <p className="flex justify-between">
                <span>Leave Applied</span>
                <strong>{attendanceData?.daysCount || 0}</strong>
              </p>
            </div>
          </div>
          
          {/* Time & Date */}
          <div className="bg-white border border-gray-300 shadow-md rounded-lg p-5 text-center min-h-[230px] flex flex-col items-center justify-center">
          {time && (
              <h3 
                className="text-2xl font-bold bg-clip-text text-transparent" 
                style={{ 
                  background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                {time}
              </h3>
            )}
            
            {/* Date - Only render when available to avoid hydration mismatch */}
            {date && (
              <h5 className="text-lg font-medium mt-2">{date}</h5>
            )}
          
            {(!recentSwipes[0]?.swipe_in_time && !recentSwipes[0]?.swipe_out_time) ||
              (recentSwipes[0]?.swipe_in_time && recentSwipes[0]?.swipe_out_time) ? (
              <button
                onClick={() => handleSwipe("swipe-in")}
                disabled={swipeStatus.has_swiped_in || !locationPermissionGranted}
                className="mt-4 py-2 w-1/2 rounded border border-green-700 text-green-700 hover:bg-green-500 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Swipe In
              </button>
            ) : (
              <button
                onClick={() => handleSwipe("swipe-out")}
                disabled={!swipeStatus.has_swiped_in || swipeStatus.has_swiped_out || !locationPermissionGranted}
                className="mt-4 py-2 w-1/2 rounded border border-red-700 text-red-700 hover:bg-red-500 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Swipe Out
              </button>
            )}
          </div>

          {/* Recent Swipes */}
          <div className="bg-white border border-gray-300 shadow-md rounded-lg min-h-[230px]">
            <div className="text-white font-semibold p-3 rounded-t-lg flex" style={{ background: 'linear-gradient(225deg,rgb(45, 116, 163),rgb(0, 66, 104))' }}>
              <BsClockHistory size={20} className="me-2" />Recent Swipes
            </div>
            <div className="p-4">
              {recentSwipes.length > 0 ? (
                <ul className="space-y-2">
                  {recentSwipes.map((swipe, idx) => (
                    <li key={idx}>
                      {swipe.swipe_in_time && (
                        <p className="text-green-700 flex">
                          <BsBoxArrowInRight className="me-2" size={20} />
                          Swipe In: {new Date(swipe.swipe_in_time).toLocaleString("en-GB")}
                        </p>
                      )}
                      {swipe.swipe_out_time && (
                        <p className="text-red-700 flex">
                          <BsBoxArrowInRight className="me-2" size={20} />
                          Swipe Out: {new Date(swipe.swipe_out_time).toLocaleString("en-GB")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">No recent swipes found.</p>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center pb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSystem;