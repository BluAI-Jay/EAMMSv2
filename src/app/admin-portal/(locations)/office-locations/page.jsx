'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MapPin, Navigation, Trash2, Edit, X, Power, PowerOff } from 'lucide-react';

const OfficeLocationsAdmin = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    max_distance: 50,
    is_active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://eamms.bluai.ai/api/office-locations', {
        headers: { Authorization: localStorage.getItem('token') }
      });
  
      const data = response.data;
      const locations = Array.isArray(data.office_locations) ? data.office_locations : [];
      setLocations(locations);
      setMaxDistance(data.max_distance || 50);
    } catch (error) {
      toast.error('Failed to fetch locations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_distance' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.post(`https://eamms.bluai.ai/api/office-locations/update/${editingId}`, formData, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        toast.success('Location updated successfully');
      } else {
        await axios.post('https://eamms.bluai.ai/api/office-locations/create', formData, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        toast.success('Location created successfully');
      }
      resetForm();
      fetchLocations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location) => {
    setFormData({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      max_distance: location.max_distance,
      is_active: location.is_active
    });
    setEditingId(location.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this location?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`https://eamms.bluai.ai/api/office-locations/delete/${id}`, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      toast.success('Location deleted permanently');
      fetchLocations();
    } catch (error) {
      toast.error('Failed to delete location');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      await axios.post(`https://eamms.bluai.ai/api/office-locations/toggle-status/${id}`, {
        is_active: !currentStatus
      }, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      toast.success(`Location ${currentStatus ? 'disabled' : 'enabled'} successfully`);
      fetchLocations();
    } catch (error) {
      toast.error(`Failed to ${currentStatus ? 'disable' : 'enable'} location`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      latitude: '',
      longitude: '',
      max_distance: 50,
      is_active: true
    });
    setEditingId(null);
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <div className="w-[68vw] max-h-[68vh] xl:h-[60vh] 2xl:max-h-[68vh] max-w-6xl rounded-lg">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 text-white px-4 py-3" style={{
            background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}>
            <MapPin className="w-5 h-5" />
            <h5 className="font-semibold text-lg">Office Locations Management</h5>
          </div>
    
          <div className="p-4 flex flex-1 gap-6 overflow-hidden">
            {/* Form Section - Fixed width */}
            <div className="w-1/3 flex flex-col">
              <h5 className="text-black font-semibold text-lg border-b pb-2 mb-4 flex items-center">
                <Navigation size={20} className="me-2"/>
                {editingId ? 'Edit Location' : 'Add New Location'}
              </h5>
              
              <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Location Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Latitude</label>
                      <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        step="0.00000001"
                        min="-90"
                        max="90"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500">Longitude</label>
                      <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        step="0.00000001"
                        min="-180"
                        max="180"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Max Distance (meters)</label>
                    <input
                      type="number"
                      name="max_distance"
                      value={formData.max_distance}
                      onChange={handleInputChange}
                      min="10"
                      max="10000"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {editingId && (
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            is_active: e.target.checked
                          }))}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-700">
                          {formData.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4 pt-4 mt-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-white font-medium px-6 py-2 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer disabled:opacity-50"
                    style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}
                  >
                    {loading ? 'Processing...' : (editingId ? 'Update' : 'Save')}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex items-center gap-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      <X size={16} /> Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
    
            {/* List Section - Scrollable */}
            <div className="flex-1 flex flex-col min-h-0">
              <h5 className="text-black font-semibold text-lg border-b pb-2 mb-4 flex items-center shrink-0">
                <MapPin size={20} className="me-2" />Office Locations
              </h5>
              
              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2">
                  {loading && locations.length === 0 ? (
                    <div className="h-full flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : locations.length === 0 ? (
                    <div className="h-full flex justify-center items-center">
                      <p className="text-gray-500">No office locations found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pb-2">
                      {locations.map(location => (
                        <div 
                          key={location.id} 
                          className={`border rounded-lg p-4 transition-all ${location.is_active ? 'border-gray-200 hover:shadow-md bg-white' : 'border-gray-100 bg-gray-50'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h6 className={`font-bold ${location.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {location.name}
                                </h6>
                                {!location.is_active && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                                    Disabled
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                                <p className={location.is_active ? "text-gray-600" : "text-gray-400"}>
                                  <span className="font-semibold">Latitude:</span> {location.latitude}
                                </p>
                                <p className={location.is_active ? "text-gray-600" : "text-gray-400"}>
                                  <span className="font-semibold">Longitude:</span> {location.longitude}
                                </p>
                                <p className={`col-span-2 ${location.is_active ? "text-gray-600" : "text-gray-400"}`}>
                                  <span className="font-semibold">Radius:</span> {location.max_distance}m
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleActiveStatus(location.id, location.is_active)}
                                className={`p-2 rounded-full cursor-pointer ${
                                  location.is_active 
                                    ? 'text-yellow-600 hover:bg-yellow-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={location.is_active ? 'Disable' : 'Enable'}
                                disabled={loading}
                              >
                                {location.is_active ? <PowerOff size={18} /> : <Power size={18} />}
                              </button>
                              <button
                                onClick={() => handleEdit(location)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer"
                                title="Edit"
                                disabled={loading}
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(location.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                                title="Delete"
                                disabled={loading}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeLocationsAdmin;