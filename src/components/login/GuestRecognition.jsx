"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import * as faceapi from 'face-api.js';

const GuestRecognition = () => {
  const navigation = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  // Initialize face-api.js
  const setupFaceAPI = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      console.log('Models loaded successfully');
    } catch (err) {
      console.error('Error loading models:', err);
    }
  };

  const startVideo = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = videoRef.current;
        video.srcObject = stream;
    
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play();
            resolve();
          };
        });
      } catch (err) {
        console.error('Error accessing webcam: ', err);
      }
    }
  };

  const detectAndCaptureFace = async () => {
    if (isProcessing || isWaitingForResponse) return;
  
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
        setIsProcessing(true);
        video.style.display = 'none';
        captureAndSendImage();
      }
    } catch (err) {
      console.error('Face detection error:', err);
    }
  };
  
  const captureAndSendImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setIsWaitingForResponse(true);
        sendImageToServer(blob);
      } else {
        console.error('Error capturing image: Unable to create Blob');
        resetProcessingState();
      }
    }, 'image/jpeg');
  };

  const resetProcessingState = () => {
    setIsProcessing(false);
    setIsWaitingForResponse(false);
    if (videoRef.current) {
      videoRef.current.style.display = 'block';
    }
  };

  let isAwaitingConfirmation = false;

  const sendImageToServer = async (blob) => {
    if (isAwaitingConfirmation) return;

    try {
      isAwaitingConfirmation = true;

      const formData = new FormData();
      formData.append('image', blob, 'image.jpg');

      // First API call to match guest face
      const response = await fetch('https://eamms.bluai.ai/api/match-guest-attendance', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      if (!text) throw new Error('Empty response from server');

      const data = JSON.parse(text);

      if (data.message) {
        const finalConfirmation = await Swal.fire({
          title: `${data.message}. Are you sure?`,
          text: 'Do you want to mark your attendance?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, proceed',
          cancelButtonText: 'No, cancel',
          reverseButtons: true,
        });

        if (finalConfirmation.isConfirmed) {
          // Second API call to mark guest attendance
          const saveResponse = await fetch('https://eamms.bluai.ai/api/mark-guest-attendance2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: data.user_id }),
          });

          const saveText = await saveResponse.text();
          if (!saveText) throw new Error('Empty response from mark-guest-attendance API');

          const saveResult = JSON.parse(saveText);

          Swal.fire({
            position: 'top',
            icon: saveResult.success ? 'success' : 'error',
            title: saveResult.success ? saveResult.message : saveResult.error,
            showConfirmButton: false,
            timer: 5000,
            toast: true,
          });
        } else {
          Swal.fire({
            position: 'top',
            icon: 'info',
            title: 'Attendance not saved.',
            showConfirmButton: false,
            timer: 3000,
            toast: true,
          });
        }
      } else {
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: data.error || 'Guest not found. Please register first.',
          showConfirmButton: false,
          timer: 5000,
          toast: true,
        });
      }
    } catch (error) {
      console.error('Error sending image to server:', error);
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'Error communicating with server.',
        showConfirmButton: false,
        timer: 5000,
        toast: true,
      });
    } finally {
      isAwaitingConfirmation = false;
      resetProcessingState();
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await setupFaceAPI();
      await startVideo();
      setInterval(detectAndCaptureFace, 1000);
    };
    initialize();
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center ">
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <video 
            ref={videoRef} 
            autoPlay 
            className="w-[40vw] h-[65vh] object-cover rounded-4xl shadow-2xl"
          ></video>
          <canvas 
            ref={canvasRef} 
            className="hidden w-[40vw] h-[65vh]"
          ></canvas>
        </div>

      {isProcessing && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-4 rounded-lg">
          Processing...
        </div>
      )}

      <button
        onClick={() => router.push('/guest-register')}
        className="absolute bottom-8 left-8 px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-700 cursor-pointer"
      >
        Guest Register
      </button>
      <button
        onClick={() => router.push('/')}
        className="absolute bottom-8 right-8 px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-700 cursor-pointer"
      >
        User Login
      </button>
    </div>
  );
};

export default GuestRecognition;
