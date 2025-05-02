'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsClockHistory } from "react-icons/bs";
import { Image } from "lucide-react";

const LogoUpload = () => {
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        
        axios.get('https://eamms.bluai.ai/api/get-logo', {
            headers: {
                Authorization: token,
            }
        })
        .then(response => {
            if (response.data.logo) {
                setLogoPreview(response.data.logo);
            }
        })
        .catch(error => {
            console.error('Error fetching logo:', error);
            setError('Failed to fetch logo');
        });
    }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setLogoFile(file);
        setError('');
        setSuccessMessage('');

        const reader = new FileReader();
        reader.onload = (event) => {
            setLogoPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const saveLogo = async () => {
        if (!logoFile) {
            setError('Please select a logo to upload.');
            return;
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        const formData = new FormData();
        formData.append('logo', logoFile);

        try {
            const response = await axios.post('https://eamms.bluai.ai/api/save-logo', formData, {
                headers: {
                    Authorization: token,
                }
            });
            setSuccessMessage(response.data.success || 'Logo uploaded successfully!');
            setError('');
        } catch (error) {
            console.error('Error uploading logo:', error);
            setError('Failed to upload logo');
            setSuccessMessage('');
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
                        <Image className="w-5 h-5 mr-2" />
                        Upload Logo
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

                    <form>
                        <div className="mb-4">
                            <label htmlFor="logo-upload" className="block text-sm font-bold text-gray-700 mb-1">
                                Select Logo:
                            </label>
                            <input
                                type="file"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="logo-upload"
                                name="logo"
                                accept="image/*"
                                onChange={handleLogoChange}
                            />
                        </div>
                        
                        {logoPreview && (
                            <div className="mb-4">
                                <img 
                                    src={logoPreview} 
                                    alt="Logo Preview" 
                                    className="max-w-[100px] max-h-[100px] object-contain" 
                                />
                            </div>
                        )}
                        
                        <div className="mt-6 text-center border-t border-gray-300 py-4 flex justify-center">
                            <button
                                type="button"
                                onClick={saveLogo}
                                className="flex gap-2 text-white py-2 px-6 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
                                style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}
                            >
                                Save Logo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LogoUpload;