'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { BsCheckCircle } from "react-icons/bs";
import { User } from "lucide-react"; 

const UpdateAdmin = () => {
  const [formData, setFormData] = useState({
    username: '',
    mobile_number: '',
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');

    try {
      const response = await axios.post(
        'https://eamms.bluai.ai/api/admin/update',
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSuccessMessage('Admin credentials updated successfully.');
      setFormData({ username: '', mobile_number: '' });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(Object.values(error.response.data.errors).flat());
      } else {
        setErrors(['An error occurred. Please try again.']);
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center px-8">
      <div className="w-full h-fit max-w-4xl bg-white rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-white px-4 py-3 rounded-t-xl shadow-lg"style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}>
          <h5 className="font-semibold text-lg flex items-center">
          <User size={24} color="white" className="mr-2"/>
            Update Admin Credentials
          </h5>
        </div>
        <div className="p-6">
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
              {successMessage}
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <ul className="list-disc pl-5 m-0">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1">
                Username:
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="mobile_number"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Mobile Number:
              </label>
              <input
                type="text"
                name="mobile_number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.mobile_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-6 text-center border-t border-gray-300 py-4 flex justify-center">
              <button
                type="submit"
                className="flex gap-2 text-white py-2 px-6 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
                style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}
              >
                 <BsCheckCircle size={20} color="white" />  Update Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdmin;