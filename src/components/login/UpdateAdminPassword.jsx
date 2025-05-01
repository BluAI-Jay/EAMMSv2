"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import CompanyLogo from "@/assets/company_logo.png";
import { BsPerson, BsPhone, BsLock, BsLockFill, BsArrowLeft } from "react-icons/bs";
import axios from "axios";

export default function AdminChangePassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    mobile_number: '',
    otp: '',
    new_password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendOtp = async () => {
    if (!formData.mobile_number || formData.mobile_number.length !== 10) {
      Swal.fire("Error", "Please enter a valid 10-digit mobile number", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://eamms.bluai.ai/api/admin/send-otp',
        { mobile_number: formData.mobile_number },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = response.data;
      Swal.fire({
        position: "top",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
      setOtpSent(true);
      localStorage.setItem('otp', data.otp);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Admin not Found for this Username or Mobile Number", "error");
    }
    setIsLoading(false);
  };

  const verifyOtp = () => {
    if (!otp) {
      Swal.fire("Error", "Please enter OTP", "warning");
      return;
    }
    
    const savedOtp = localStorage.getItem('otp');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://eamms.bluai.ai/api/admin/change-password', 
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      Swal.fire({
        position: "top",
        icon: "success",
        title: "Password updated successfully!",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
      
      setFormData({
        username: '',
        mobile_number: '',
        otp: '',
        new_password: '',
        confirm_password: ''
      });
      setOtpSent(false);
      setOtpVerified(false);
      setOtp('');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(Object.values(error.response.data.errors).flat());
      } else {
        setErrors(['Admin not Found for this Username or Mobile Number']);
      }
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
              Reset Password
            </h4>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-auto p-6">
            {/* Errors */}
            {errors.length > 0 && (
              <div className="alert alert-danger mb-4">
                <ul className="text-red-500 text-sm">
                  {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                </ul>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="alert alert-success mb-4 text-green-500 text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  Username
                </label>
                <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-1">
                  <span className="me-2 text-gray-500">
                    <BsPerson size={18} />
                  </span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Mobile Number + Send OTP */}
              <div className="mb-4">
                <label
                  htmlFor="mobile_number"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  Mobile Number
                </label>
                <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-1 gap-2">
                  <div className="flex items-center rounded-md flex-1">
                    <span className="me-2 text-gray-500">
                      <BsPhone size={18} />
                    </span>
                    <input
                      type="text"
                      id="mobile_number"
                      name="mobile_number"
                      className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                      placeholder="Enter your mobile number"
                      value={formData.mobile_number}
                      onChange={handleChange}
                      required
                      maxLength={10}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-white font-sm bg-blue-500 hover:bg-blue-600 rounded-full px-3 py-1 flex justify-center items-center cursor-pointer disabled:opacity-70"
                    onClick={sendOtp}
                    disabled={isLoading || otpSent}
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
                    ) : otpSent ? (
                      "OTP Sent"
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </div>

              {/* OTP Field */}
              {otpSent && (
                <div className="mb-4">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-bold text-gray-500 mb-1"
                  >
                    OTP
                  </label>
                  <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-1 gap-2">
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
                        onChange={(e) => setOtp(e.target.value)}
                        required
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

              {/* New Password */}
              <div className="mb-4">
                <label
                  htmlFor="new_password"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  New Password
                </label>
                <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-1">
                  <span className="me-2 text-gray-500">
                    <BsLock size={18} />
                  </span>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                    placeholder="Enter new password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  Confirm Password
                </label>
                <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-1">
                  <span className="me-2 text-gray-500">
                    <BsLockFill size={18} />
                  </span>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                    placeholder="Confirm new password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex justify-center items-center text-sm disabled:opacity-50 cursor-pointer"
                disabled={!otpVerified || isLoading}
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
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="flex item-center justify-center bg-transparent py-4 text-center">
            <button
              onClick={() => router.push("/admin-login")}
              className="px-4 py-1 rounded-full text-sm text-gray-500 hover:text-white hover:bg-gray-500 flex item-center border border-gray-500 cursor-pointer"
            >
              <BsArrowLeft size={18} className="me-2" /> Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}