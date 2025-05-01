'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaTicketAlt } from "react-icons/fa"; // Font Awesome

const RaiseTicket = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    ticketNo: '',
    serviceCategory: '',
    serviceSubCategory: '',
    serviceSubSubCategory: '',
    issueDescription: '',
    image: null,
  });

  const [fileName, setFileName] = useState('');
  const [selectValue, setSelectValue] = useState('add');

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ticketNo: generateTicketNumber()
    }));
  }, []);

  const generateTicketNumber = () => {
    const prefix = 'EAMMS';
    const date = new Date();
    const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    return `${prefix}${timestamp}${randomNumber}`;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, image: files[0] }));
      setFileName(files[0].name);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteFile = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formPayload.append(key, value);
      });

      const response = await axios.post('https://eamms.bluai.ai/api/raise-ticket', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });

      console.log(response.data.message);

      setFormData({
        ticketNo: '',
        serviceCategory: '',
        serviceSubCategory: '',
        serviceSubSubCategory: '',
        issueDescription: '',
        image: null,
      });
      setFileName('');

      router.push('/user-portal/raise-ticket-details');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit raise ticket.');
    }
  };

  const handleViewChange = (e) => {
    const value = e.target.value;
    setSelectValue(value);
    if (value === 'view') {
      router.push('/user-portal/raise-ticket-details');
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[68vw] h-fit max-w-6xl bg-white shadow-lg rounded-lg">
        <div className="flex items-center justify-between text-white px-4 py-2 rounded-t" style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}>
          <h5 className="text-lg font-semibold flex items-center gap-2">
            <FaTicketAlt size={20} color="white"/>Raise Ticket
          </h5>
          <div className="relative w-50">
              <select
                  className="appearance-none w-full text-black text-sm font-medium px-5 py-2 pr-10 rounded-md bg-white border border-gray-300 outline-none cursor-pointer"
                  value={selectValue}
                  onChange={handleViewChange}
              >
                  <option value="add">Add New Details</option>
                  <option value="view">View Details</option>
              </select>
              {/* Custom icon */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                      className="h-4 w-4 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                  >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
              </div>
          </div>
        </div>

        <form className="p-8" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Ticket No.</label>
              <input
                type="text"
                name="ticketNo"
                value={formData.ticketNo}
                readOnly
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Service Category</label>
              <select
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select</option>
                <option value="Administration">Administration</option>
                <option value="Human Resource">Human Resource</option>
                <option value="IT Helpdesk">IT Helpdesk</option>
                <option value="Software Application">Software Application</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Service Sub Category</label>
              <select
                name="serviceSubCategory"
                value={formData.serviceSubCategory}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select</option>
                <option value="Administration">Administration</option>
                <option value="Human Resource">Human Resource</option>
                <option value="IT Helpdesk">IT Helpdesk</option>
                <option value="Software Application">Software Application</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Service Sub SubCategory</label>
              <select
                name="serviceSubSubCategory"
                value={formData.serviceSubSubCategory}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select</option>
                <option value="Administration">Administration</option>
                <option value="Human Resource">Human Resource</option>
                <option value="IT Helpdesk">IT Helpdesk</option>
                <option value="Software Application">Software Application</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Issue Description</label>
            <textarea
              name="issueDescription"
              rows="3"
              value={formData.issueDescription}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Image</label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                id="fileInput"
                className="hidden"
              />
              <button
                type="button"
                className="text-white font-medium px-4 py-1 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
                style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                Upload Image
              </button>
              {fileName && <span className="text-sm">{fileName}</span>}
              {fileName && (
                <button
                  type="button"
                  className="text-white font-medium px-2 py-0 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
                style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}
                  onClick={handleDeleteFile}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="text-white font-medium px-6 py-2 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
                style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;
