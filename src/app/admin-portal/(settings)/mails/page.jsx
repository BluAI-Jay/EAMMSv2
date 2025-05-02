'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail } from "lucide-react";

const EmailSettings = () => {
  const [formData, setFormData] = useState({
    hr_email: '',
    manager_email: '',
    others_email: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchEmailSettings = async () => {
      try {
        const response = await axios.get('https://eamms.bluai.ai/api/get-email-settings', {
          headers: {
            Authorization: token,
          },
        });
        const data = response.data;
        setFormData({
          hr_email: data.hr_email || '',
          manager_email: data.manager_email || '',
          others_email: data.others_email || '',
        });
      } catch (error) {
        console.error('Error fetching email settings:', error);
        setErrors(['Failed to fetch email settings.']);
      }
    };

    fetchEmailSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage('');

    try {
      const response = await axios.post(
        'https://eamms.bluai.ai/api/update-email-settings',
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessage(response.data.message || 'Email settings updated successfully.');
    } catch (error) {
      console.error('Error updating email settings:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(Object.values(error.response.data.errors).flat());
      } else {
        setErrors(['Failed to update email settings.']);
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-8">
      <div className="w-full max-w-4xl xl:w-4xl xl:h-fit 2xl:w-full bg-white rounded-xl shadow-lg">
        <div
          className="flex items-center gap-2 text-white px-4 py-3 rounded-t-xl shadow-lg"
          style={{
            background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))',
          }}
        >
          <h5 className="font-semibold text-lg flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Update Email Settings
          </h5>
        </div>
        <div className="p-6">
          {message && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
              {message}
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
              <label
                htmlFor="hr_email"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                HR Email:
              </label>
              <input
                type="email"
                name="hr_email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.hr_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="manager_email"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Manager Email:
              </label>
              <input
                type="email"
                name="manager_email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.manager_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="others_email"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Others Email:
              </label>
              <input
                type="email"
                name="others_email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.others_email}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6 text-center border-t border-gray-300 py-4 flex justify-center">
              <button
                type="submit"
                className="flex gap-2 text-white py-2 px-6 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
                style={{
                  background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))',
                }}
              >
                <Mail size={20} color="white" />
                Update Emails
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;