'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsCheckCircle, BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Megaphone } from "lucide-react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('https://eamms.bluai.ai/api/announcements', {
        headers: { Authorization: token },
      });
      setAnnouncements(response.data.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingId) {
        await axios.post(
          `https://eamms.bluai.ai/api/announcements/${editingId}`,
          { announcement: announcementText },
          { headers: { Authorization: token } }
        );
        setMessage('Announcement updated successfully.');
      } else {
        await axios.post(
          'https://eamms.bluai.ai/api/announcements',
          { announcement: announcementText },
          { headers: { Authorization: token } }
        );
        setMessage('Announcement added successfully.');
      }
      setAnnouncementText('');
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(`Failed to ${editingId ? 'update' : 'create'} announcement.`);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`https://eamms.bluai.ai/api/announcements/${id}`, {
        headers: { Authorization: token },
      });
      setAnnouncementText(response.data.announcement);
      setEditingId(id);
    } catch (error) {
      console.error('Error fetching announcement:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://eamms.bluai.ai/api/announcements/${id}`, {
        headers: { Authorization: token },
      });
      setMessage('Announcement deleted successfully.');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setMessage('Failed to delete announcement.');
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-8">
      <div className="w-full max-w-6xl xl:w-4xl xl:h-fit 2xl:w-full bg-white rounded-xl shadow-lg">
        <div
          className="flex items-center gap-2 text-white px-4 py-3 rounded-t-xl shadow-lg"
          style={{
            background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))',
          }}
        >
          <h5 className="font-semibold text-lg flex items-center">
             <Megaphone className="w-5 h-5 mr-2" />
            Announcements
          </h5>
        </div>
        <div className="p-6">
          {message && (
            <div
              className={`${
                message.includes('successfully')
                  ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
                  : 'bg-red-100 border-l-4 border-red-500 text-red-700'
              } p-4 mb-4 rounded`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="announcement" className="block text-sm font-bold text-gray-700 mb-1">
                Announcement:
              </label>
              <textarea
                id="announcement"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Write your announcement here"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="flex items-center gap-2 text-white py-2 px-6 rounded-lg shadow transition duration-150 ease-in-out"
                style={{
                  background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))',
                }}
              >
                <BsCheckCircle size={20} />
                {editingId ? 'Update' : 'Save'} Announcement
              </button>
            </div>
          </form>

          <div className="max-h-64 overflow-y-auto">
            {announcements.length > 0 ? (
              <ul className="space-y-2">
                {announcements.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-gray-700">{item.announcement}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="flex items-center gap-1 text-white py-1 px-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition"
                      >
                        <BsPencilSquare size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 text-white py-1 px-3 rounded-lg bg-red-500 hover:bg-red-600 transition"
                      >
                        <BsTrash size={16} />
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No announcements available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;