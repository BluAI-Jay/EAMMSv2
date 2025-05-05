"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import * as faceapi from "face-api.js";
import axios from "axios";

const EmployeeFaceRecognition = () => {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  
  // Location state
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [officeLocations, setOfficeLocations] = useState([]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch office locations on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await setupFaceAPI();
        await fetchOfficeLocations();
        await requestLocationPermission();
        await startVideo();
        setIsInitialized(true);
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize system. Please refresh the page.");
      }
    };
    initialize();
  }, []);

  const fetchOfficeLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await axios.get("https://eamms.bluai.ai/api/office-locations", {
        headers: { Authorization: localStorage.getItem("token") }
      });
      
      const locations = Array.isArray(response.data?.office_locations) 
        ? response.data.office_locations 
        : [];
      
      setOfficeLocations(locations);
      setMaxDistance(response.data?.max_distance || 50);
      setLoadingLocations(false);
    } catch (error) {
      console.error("Failed to fetch office locations:", error);
      setError("Failed to load office locations. Using default settings.");
      setOfficeLocations([]);
      setLoadingLocations(false);
    }
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
    return distance;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const requestLocationPermission = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermissionGranted(true);
          resolve(true);
        },
        (error) => {
          handleLocationError(error);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const handleLocationError = (error) => {
    let errorMessage = "An unknown error occurred while fetching location.";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location permission denied. Please allow it to proceed.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location unavailable. Please check your GPS or network.";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out. Try again.";
        break;
    }
    setError(errorMessage);
  };

  const checkLocation = async () => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser.");
    }
  
    if (loadingLocations) {
      throw new Error("System is still initializing. Please wait...");
    }
  
    if (officeLocations.length === 0) {
      throw new Error("No office locations available. Attendance disabled.");
    }
  
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const employeeLat = position.coords.latitude;
          const employeeLon = position.coords.longitude;
  
          // Calculate distances to all ACTIVE office locations
          const activeLocations = officeLocations.filter(loc => loc.is_active);
          if (activeLocations.length === 0) {
            reject("No active office locations available.");
            return;
          }
  
          const distances = activeLocations.map((office) => ({
            office,
            distance: getDistanceFromLatLonInMeters(
              office.latitude,
              office.longitude,
              employeeLat,
              employeeLon
            )
          }));
  
          // Find the nearest active office
          const nearest = distances.reduce((prev, current) => 
            (prev.distance < current.distance) ? prev : current
          );
  
          const officeMaxDistance = nearest.office.max_distance || maxDistance;
          
          if (nearest.distance <= officeMaxDistance) {
            resolve();
          } else {
            reject(`You are ${nearest.distance.toFixed(0)}m from ${nearest.office.name}. Max allowed: ${officeMaxDistance}m`);
          }
        },
        (error) => {
          handleLocationError(error);
          reject("Location access error");
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0 
        }
      );
    });
  };

  const setupFaceAPI = async () => {
    try {
      if (isTablet()) {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      } else {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      }
    } catch (err) {
      console.error("Error loading models:", err);
      throw err;
    }
  };

  const isTablet = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return /ipad|tablet|android(?!.*mobile)/i.test(userAgent) || 
           (window.innerWidth >= 600 && window.innerWidth <= 1024);
  };

  const startVideo = async () => {
    try {
      const constraints = isTablet() 
        ? { 
            video: { 
              width: { ideal: 800 },
              height: { ideal: 600 },
              frameRate: { ideal: 15 }
            } 
          } 
        : { video: true };
  
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          resolve();
        };
      });
    } catch (err) {
      console.error("Error accessing webcam: ", err);
      throw err;
    }
  };

  useEffect(() => {
    if (!isInitialized) return;

    const detectionInterval = setInterval(() => {
      if (!isWaitingForResponse) {
        detectAndCaptureFace();
      }
    }, isTablet() ? 2000 : 1000);

    return () => clearInterval(detectionInterval);
  }, [isInitialized, isWaitingForResponse]);

  const detectAndCaptureFace = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    try {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        captureAndSendImage();
      }
    } catch (err) {
      console.error("Face detection error:", err);
    }
  };

  const captureAndSendImage = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("Error capturing image: Unable to create Blob");
        return;
      }

      try {
        await checkLocation();
        sendImageToServer(blob);
      } catch (locationError) {
        Swal.fire({
          position: "top",
          icon: "error",
          title: locationError,
          showConfirmButton: false,
          timer: 5000,
          toast: true,
        });
      }
    }, "image/jpeg");
  };

  const startProgressAnimation = () => {
    setIsWaitingForResponse(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 100 : prev + 1);
    }, 50);
    
    return interval;
  };

  let isAwaitingConfirmation = false;

  const sendImageToServer = async (blob) => {
    if (isAwaitingConfirmation) return;

    const progressInterval = startProgressAnimation();
    isAwaitingConfirmation = true;

    try {
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");

      const response = await fetch("https://eamms.bluai.ai/api/match-attendance", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      if (!text) throw new Error("Empty response from server");

      const data = JSON.parse(text);

      if (data.message) {
        clearInterval(progressInterval);
        setProgress(100);
        
        const saveResponse = await fetch(
          "https://eamms.bluai.ai/api/mark-attendance1",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: data.user_id }),
          }
        );

        const saveResult = await saveResponse.json();
        showResultToast(saveResult.success, saveResult.message || saveResult.error);
      } else {
        showResultToast(false, data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error sending image:", error);
      showResultToast(false, "Error communicating with server.");
    } finally {
      isAwaitingConfirmation = false;
      setIsWaitingForResponse(false);
      setProgress(0);
    }
  };

  const showResultToast = (success, message) => {
    Swal.fire({
      position: "top",
      icon: success ? "success" : "error",
      title: message,
      showConfirmButton: false,
      timer: 5000,
      toast: true,
    });
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-30">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Initializing system...</p>
            {loadingLocations && <p className="text-sm text-gray-600">Loading office locations</p>}
          </div>
        </div>
      )}

      <div className="relative w-full h-[56.5vh] flex justify-center items-center">
        {/* Progress circle container */}
        <div className="absolute w-full h-full flex items-center justify-center">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient 
                id="progressGradient" 
                x1="100%" y1="0%"
                x2="0%" y2="100%"
              >
                <stop offset="0%" stopColor="rgb(45, 116, 163)" />
                <stop offset="100%" stopColor="rgb(0, 66, 104)" />
              </linearGradient>
            </defs>
            
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="2"
            />
          
            <circle
              ref={progressRef}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#progressGradient)"  
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83}, 284`}
              transform="rotate(-90 50 50)"
              className="transition-all duration-50 ease-linear"
            />
          </svg>
        </div>
        
        {/* Video feed with circular mask */}
        <div className="w-[50vh] h-[50vh] rounded-full overflow-hidden border-5 border-[rgb(45,116,163)]">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          ></video>
        </div>
        
        <canvas
          ref={canvasRef}
          className="hidden"
        ></canvas>
        
        {isWaitingForResponse && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg z-20">
            Recognizing face... {progress}%
          </div>
        )}
      </div>

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-20 max-w-md text-center">
          {error}
        </div>
      )}

      <button
        onClick={() => router.push("/face-register")}
        className="absolute bottom-8 left-8 px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-700 cursor-pointer z-20"
      >
        Employee Face Register
      </button>
      <button
        onClick={() => router.push("/")}
        className="absolute bottom-8 right-8 px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-700 cursor-pointer z-20"
      >
        User Login
      </button>
    </div>
  );
};

export default EmployeeFaceRecognition;