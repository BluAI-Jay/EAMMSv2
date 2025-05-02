"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import * as faceapi from "face-api.js";

const EmployeeFaceRecognition = () => {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const setupFaceAPI = async () => {
    try {
      if (isTablet()) {
        // Use lighter models for tablets
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      } else {
        // Default models for laptops/desktops
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      }
      console.log("Models loaded successfully");
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };

  const isTablet = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isiPad = /ipad|tablet|android(?!.*mobile)/i.test(userAgent);
    const isTabletSize = window.innerWidth >= 600 && window.innerWidth <= 1024;
    return isiPad || isTabletSize;
  };

  const startVideo = async () => {
    try {
      const constraints = isTablet() 
        ? { 
            video: { 
              width: { ideal: 800 },  // Lower resolution for tablets
              height: { ideal: 600 },
              frameRate: { ideal: 15 }  // Lower FPS for tablets
            } 
          } 
        : { video: true };  // Default for laptops/phones
  
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
    }
  };


  const detectAndCaptureFace = async () => {
    if (isWaitingForResponse) return;

    const video = videoRef.current;

    if (!video || video.readyState < 2) {
      return;
    }

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

  const captureAndSendImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        sendImageToServer(blob);
      } else {
        console.error("Error capturing image: Unable to create Blob");
      }
    }, "image/jpeg");
  };

  const startProgressAnimation = () => {
    setIsWaitingForResponse(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    
    return interval;
  };

  let isAwaitingConfirmation = false;

  const sendImageToServer = async (blob) => {
    if (isAwaitingConfirmation) return;

    const progressInterval = startProgressAnimation();

    try {
      isAwaitingConfirmation = true;

      const formData = new FormData();
      formData.append("image", blob, "image.jpg");

      // First API call to match user face
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
        
        // Second API call to mark user attendance (no confirmation needed)
        const saveResponse = await fetch(
          "https://eamms.bluai.ai/api/mark-attendance1",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: data.user_id }),
          }
        );

        const saveText = await saveResponse.text();
        if (!saveText) throw new Error("Empty response from mark-attendance API");

        const saveResult = JSON.parse(saveText);

        Swal.fire({
          position: "top",
          icon: saveResult.success ? "success" : "error",
          title: saveResult.success ? saveResult.message : saveResult.error,
          showConfirmButton: false,
          timer: 5000,
          toast: true,
        });
      } else {
        Swal.fire({
          position: "top",
          icon: "error",
          title: data.error || "An error occurred.",
          showConfirmButton: false,
          timer: 5000,
          toast: true,
        });
      }
    } catch (error) {
      console.error("Error sending image to server:", error);
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Error communicating with server.",
        showConfirmButton: false,
        timer: 5000,
        toast: true,
      });
    } finally {
      isAwaitingConfirmation = false;
      setIsWaitingForResponse(false);
      setProgress(0);
    }
  };

useEffect(() => {
  const initialize = async () => {
    await setupFaceAPI();
    await startVideo();
    
    // Slower detection for tablets (2000ms vs 1000ms)
    const detectionInterval = isTablet() ? 2000 : 1000;
    setInterval(detectAndCaptureFace, detectionInterval);
  };
  initialize();
}, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
     <div className="relative w-full h-[56.5vh] flex justify-center items-center">
        {/* Progress circle container */}
        <div className="absolute w-full h-full flex items-center justify-center">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        {/* Define the gradient */}
        <defs>
        <linearGradient 
          id="progressGradient" 
          x1="100%" y1="0%"  // 225° angle in SVG coordinates
          x2="0%" y2="100%"
        >
          <stop offset="0%" stopColor="rgb(45, 116, 163)" />  {/* Start color */}
          <stop offset="100%" stopColor="rgb(0, 66, 104)" />  {/* End color */}
        </linearGradient>
      </defs>
      
        {/* Background circle (gray) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="2"
        />
      
        {/* Progress circle with gradient */}
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
        
        {/* Video feed with circular mask - now matching the circle size */}
        <div className="w-[50vh] h-[50vh] rounded-full overflow-hidden border-5 border-[rgb(45,116,163)]">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-cover"
          ></video>
        </div>
        
        <canvas
          ref={canvasRef}
          className="hidden"
        ></canvas>
        
        {/* Status indicator */}
        {isWaitingForResponse && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg z-20">
            Recognizing face... {progress}%
          </div>
        )}
      </div>

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