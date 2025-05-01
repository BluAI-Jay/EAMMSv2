"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import CompanyLogo from "@/assets/company_logo.png";
import { BiShow, BiHide } from "react-icons/bi";

export default function NewUser() {
  const navigation = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    company_mail: "",
    username1: "",
    password1: "",
    upload_image: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile_number") {
      const cleaned = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      Swal.fire("Error", "File size exceeds 2MB.", "error");
      return;
    }
    setFormData({ ...formData, upload_image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.upload_image) {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Please upload a profile image.",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
      return;
    }

    setIsLoading(true);

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value);
    });

    try {
      const response = await fetch("https://eamms.bluai.ai/api/new-user-register", {
        method: "POST",
        body: formPayload,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const data = await response.json();

      if (data.message) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "User created successfully!",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
        setFormData({
          first_name: "",
          last_name: "",
          mobile_number: "",
          company_mail: "",
          username1: "",
          password1: "",
          upload_image: null,
        });
        navigation.push("/admin-portal/existing-user");
      } else {
        Swal.fire("Error", data.error || "Failed to create user.", "error");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
    <div className="w-full h-[80vh] max-w-xl border border-gray-200 bg-transparent rounded-4xl shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="text-center py-4 border-b border-gray-300">
        <a href="https://bluai.ai/" className="inline-block">
          <Image
            src={CompanyLogo}
            alt="BlutechAI Logo"
            className="mx-auto h-15 w-auto"
            priority
          />
        </a>
        <h4 className="text-xl font-semibold text-gray-800">
          Create New Employee
        </h4>
      </div>
      
      {/* Scrollable Form Container */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Your existing form content */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="relative">
              <input
                type="text"
                name="first_name"
                id="first_name"
                className="w-full peer px-4 py-2 pt-6 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="first_name"
                className="absolute left-4 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
              >
                First Name
              </label>
            </div>
  
            {/* Last Name */}
            <div className="relative">
              <input
                type="text"
                name="last_name"
                id="last_name"
                className="w-full peer px-4 py-2 pt-6 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="last_name"
                className="absolute left-4 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
              >
                Last Name
              </label>
            </div>
          </div>
  
          {/* Mobile Number */}
          <div className="relative">
            <input
              type="tel"
              name="mobile_number"
              id="mobile_number"
              className="w-full peer px-4 py-2 pt-6 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
              placeholder="Mobile Number"
              value={formData.mobile_number}
              onChange={handleChange}
              maxLength={10}
              required
            />
            <label
              htmlFor="mobile_number"
              className="absolute left-4 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
            >
              Mobile Number
            </label>
          </div>
  
          {/* Company Email */}
          <div className="relative">
            <input
              type="email"
              name="company_mail"
              id="company_mail"
              className="w-full peer px-4 py-2 pt-6 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
              placeholder="Company Email"
              value={formData.company_mail}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="company_mail"
              className="absolute left-4 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
            >
              Company Email
            </label>
          </div>
  
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username1"
              id="username1"
              className="w-full peer px-4 py-2 pt-6 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
              placeholder="Username"
              value={formData.username1}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="username1"
              className="absolute left-4 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
            >
              Username
            </label>
          </div>
  
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password1"
              id="password1"
              className="w-full peer px-4 py-2 pt-6 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
              placeholder="Password"
              value={formData.password1}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="password1"
              className="absolute left-4 top-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
            >
              Password
            </label>
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
            </button>
          </div>
  
          {/* File Upload */}
          <div>
            <label
              htmlFor="upload_image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profile Image
            </label>
            <input
              type="file"
              name="upload_image"
              id="upload_image"
              accept="image/*"
              className="w-full border border-gray-300 rounded-2xl px-4 py-2 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              onChange={handleFileChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a clear profile photo (Max 2MB)
            </p>
          </div>
  
          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium disabled:opacity-50 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2 inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}