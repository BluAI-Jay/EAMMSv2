'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsCheckCircle } from "react-icons/bs";
import { Copyright } from "lucide-react";

const CopyrightSettings = () => {
  const [copyrightText, setCopyrightText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch existing copyright text on component load
  useEffect(() => {
    const fetchCopyright = async () => {
      try {
        const response = await axios.get('https://eamms.bluai.ai/api/copyright', {
          headers: {
            Authorization: token,
          },
        });
        if (response.data && response.data.data) {
          setCopyrightText(response.data.data.copyright_text);
        }
      } catch (err) {
        console.error('Error fetching copyright:', err);
        setError('Failed to load copyright settings.');
      }
    };

    fetchCopyright();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    try {
      const response = await axios.post(
        'https://eamms.bluai.ai/api/copyright1',
        { copyright_text: copyrightText },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSuccessMessage(response.data.success || 'Copyright updated successfully.');
    } catch (err) {
      console.error('Error updating copyright:', err);
      setError('Failed to update copyright information.');
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-8">
      <div className="w-full max-w-4xl xl:w-4xl xl:h-fit 2xl:w-full bg-white rounded-xl shadow-lg">
        <div
          className="flex items-center gap-2 text-white px-4 py-3 rounded-t-xl shadow-lg"
          style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h5 className="font-semibold text-lg flex items-center">
            <Copyright className="w-5 h-5 mr-2" />
            Update Copyright Information
          </h5>
        </div>
        <div className="p-6">
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="copyright_text"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Copyright Text:
              </label>
              <input
                type="text"
                id="copyright_text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                required
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
                <BsCheckCircle size={20} color="white" /> Save Copyright
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CopyrightSettings;