"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import CompanyLogo from "@/assets/company_logo.png";
import { BsPerson, BsEnvelope, BsPhone, BsLock, BsCamera, BsPersonPlus, BsArrowRight } from "react-icons/bs";

export default function GuestRegister() {
  const navigation = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hereFor, setHereFor] = useState("");
  const [whomToMeet, setWhomToMeet] = useState("");
  const [duration, setDuration] = useState("");
  const [imageBlob, setImageBlob] = useState(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
        Swal.fire("Error", "Cannot access camera", "error");
      });
  }, []);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleEmailChange = (value) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value.trim().toLowerCase())) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePhoneNumberChange = (value) => {
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleOtpChange = (value) => {
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const sendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Swal.fire("Error", "Enter a valid 10-digit phone number", "warning");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("https://eamms.bluai.ai/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });
      const data = await response.json();

      if (data.success) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "OTP sent!",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
        setOtpSent(true);
        setTimer(30);
        localStorage.setItem("otp", data.otp);
      } else {
        Swal.fire("Error", data.message || "Failed to send OTP", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to send OTP", "error");
    }
    setIsLoading(false);
  };

  const verifyOtp = () => {
    const savedOtp = localStorage.getItem("otp");
    if (otp === savedOtp) {
      Swal.fire({
        position: "top",
        icon: "success",
        title: "OTP Verified!",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
      setOtpVerified(true);
    } else {
      Swal.fire("Error", "Invalid OTP", "error");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setImageBlob(blob);
        const url = URL.createObjectURL(blob);
        setCapturedImageUrl(url);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Image Captured!",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      }
    }, "image/jpeg");
  };

  const validateInputs = () => {
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !hereFor ||
      !whomToMeet ||
      !duration ||
      !imageBlob
    ) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return false;
    }
    if (emailError) {
      Swal.fire("Error", "Invalid Email", "error");
      return false;
    }
    if (!otpVerified) {
      Swal.fire("Error", "Please verify OTP", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone_number", phoneNumber);
    formData.append("here_for", hereFor);
    formData.append("whom_to_meet", whomToMeet);
    formData.append("duration", duration);
    if (imageBlob) {
      formData.append("image", imageBlob, "captured.jpg");
    }

    try {
      const response = await fetch(
        "https://eamms.bluai.ai/api/guest-register",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.message) {
        Swal.fire("Success", data.message, "success");
        setName('');
        setEmail('');
        setPhoneNumber('');
        setHereFor('');
        setWhomToMeet('');
        setDuration('');
        setCapturedImageUrl(null);
        setImageBlob(null);
        setOtpSent(false);
        setOtpVerified(false);
        setOtp('');
        setTimer(0);
      } else {
        Swal.fire("Error", "Unexpected server response.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Submission failed", "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-lg flex justify-center">
        <div className="flex flex-col w-[50vw] h-[78vh] bg-white/10 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-transparent border-b border-gray-300 py-4 text-center">
            <Image
              src={CompanyLogo}
              alt="Company Logo"
              className="mx-auto h-12 w-auto"
            />
            <h4 className="mt-3 text-xl font-semibold text-black">
              Guest Registration
            </h4>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-auto p-6">
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-gray-500 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="flex items-center bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-1">
                    <span className="me-2 text-gray-500">
                      <BsPerson size={18} />
                    </span>
                    <input
                      type="text"
                      id="name"
                      className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  Email Address
                </label>
                <div className="flex items-center bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-1">
                  <span className="me-2 text-gray-500">
                     <BsEnvelope size={18} />
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                </div>
                {emailError && (
                  <small className="text-red-500 text-sm">{emailError}</small>
                )}
              </div>

              {/* Phone + Send OTP */}
                <div className="mb-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-bold text-gray-500 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="flex items-center bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-1 gap-2">
                        <div className="flex items-center rounded-md flex-1">
                          <span className="me-2 text-gray-500">
                            <BsPhone size={18} />
                          </span>
                          <input
                            type="text"
                            id="phone"
                            className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                            placeholder="Phone Number"
                            required
                            value={phoneNumber}
                            onChange={(e) => handlePhoneNumberChange(e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="text-white font-sm bg-blue-500 hover:bg-blue-600 rounded-full px-3 py-1 flex justify-center items-center cursor-pointer disabled:opacity-70"
                          onClick={sendOtp}
                          disabled={isLoading || (otpSent && timer > 0)}
                        >
                        {isLoading ? (
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                          ) : otpSent && timer > 0 ? (
                            `Resend in ${timer}s`
                          ) : (
                            "Send OTP"
                          )}
                        </button>
                    </div>
                </div>

              {/* OTP */}
              {otpSent && (
                <div className="mb-4">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-bold text-gray-500 mb-1"
                  >
                    OTP
                  </label>
                  <div className="flex items-center bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-1 gap-2">
                    <div className="flex items-center rounded-md flex-1">
                      <span className="me-2 text-gray-500">
                        <BsLock size={18} />
                      </span>
                      <input
                        type="text"
                        id="otp"
                        className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => handleOtpChange(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="text-white font-sm bg-blue-500 hover:bg-blue-600 rounded-full px-3 py-1 flex justify-center items-center cursor-pointer disabled:opacity-70"
                      onClick={verifyOtp}
                      disabled={otpVerified}
                    >
                      {otpVerified ? "Verified" : "Verify OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* Purpose of Visit */}
              <div className="mb-4">
                <label
                  htmlFor="hereFor"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  Purpose of Visit
                </label>
                <select
                  id="hereFor"
                  className="w-full flex items-center text-gray-500 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 cursor-pointer outline-none"
                  required
                  value={hereFor}
                  onChange={(e) => setHereFor(e.target.value)}
                >
                  <option value="">Purpose of Visit</option>
                  <option value="business">Business</option>
                  <option value="meeting">Meeting</option>
                  <option value="interview">Interview</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Whom to Meet */}
              <div className="mb-4">
                <label
                  htmlFor="whomToMeet"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  Whom to Meet
                </label>
                <div className="flex items-center bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-1">
                  <span className="me-2 text-gray-500">
                    <BsEnvelope size={18} />
                  </span>
                  <input
                    type="text"
                    id="whomToMeet"
                    className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                    placeholder="Enter the email of the person you want to meet"
                    required
                    value={whomToMeet}
                    onChange={(e) => setWhomToMeet(e.target.value)}
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label
                  htmlFor="duration"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  Duration of Visit
                </label>
                <select
                  id="duration"
                  className="w-full flex items-center text-gray-500 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 cursor-pointer outline-none"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="">Select Duration</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hour">2 hour</option>
                  <option value="1/2 Day">1/2 Day</option>
                  <option value="Full Day">Full Day</option>
                </select>
              </div>

              {/* Camera Preview & Capture */}
              <div className="mb-4">
                <div className="relative rounded-lg overflow-hidden bg-black h-72 flex">
                  <div className="flex-1 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                    {!capturedImageUrl && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                        <i className="bi bi-camera text-4xl"></i>
                        <small className="mt-2">Camera Preview</small>
                      </div>
                    )}
                  </div>
                  {capturedImageUrl && (
                    <div className="flex-1 relative border-l border-gray-500">
                      <img
                        src={capturedImageUrl}
                        alt="Captured"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 bg-black/25">
                        <small>Captured Image</small>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={captureImage}
                  className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-2 rounded-md flex items-center text-sm cursor-pointer"
                >
                  <BsCamera size={18} className="me-2"/> Capture
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm disabled:opacity-50 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Registering...
                    </>
                  ) : (
                    <>
                      <BsPersonPlus size={18} className="me-2" /> Check In
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex item-center justify-center bg-transparent py-4 text-center">
            <button
              onClick={() => navigation.push("/guest-recognition")}
              className=" px-4 py-1 rounded-full text-sm text-gray-500 hover:text-white hover:bg-gray-500 flex item-center border border-gray-500 cursor-pointer"
            >
              Click here for Check Out{" "}
               <BsArrowRight size={18} className="ms-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
