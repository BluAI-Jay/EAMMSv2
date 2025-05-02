'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Palette } from "lucide-react";

const ThemeColorSettings = () => {
    const [themeColor, setThemeColor] = useState('#3498db'); // default fallback
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch the current theme color from backend
        axios.get('https://eamms.bluai.ai/api/settings-theme-color')
            .then(response => {
                setThemeColor(response.data.theme_color || '#3498db');
            })
            .catch(error => {
                console.error('Error fetching current theme color:', error);
                setErrorMessage('Failed to fetch current theme color');
            });
    }, []);

    const saveThemeColor = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const response = await axios.post('https://eamms.bluai.ai/api/save-theme-color', {
                theme_color: themeColor,
            }, {
                headers: {
                    Authorization: token,
                },
            });
            
            setSuccessMessage(response.data.success || 'Theme color updated successfully!');
            setErrorMessage('');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error saving theme color:', error);
            setErrorMessage('Failed to save theme color');
            setSuccessMessage('');
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-center p-8">
            <div className="w-full max-w-4xl xl:w-4xl xl:h-fit 2xl:w-full bg-white rounded-xl shadow-lg">
                <div className="flex items-center gap-2 text-white px-4 py-3 rounded-t-xl shadow-lg" 
                    style={{ background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))" }}>
                    <h5 className="font-semibold text-lg flex items-center">
                        <Palette className="w-5 h-5 mr-2" />
                        Select Theme Color
                    </h5>
                </div>
                
                <div className="p-6">
                    {successMessage && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                            {successMessage}
                        </div>
                    )}
                    
                    {errorMessage && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                            {errorMessage}
                        </div>
                    )}
                    
                    <form>
                        <div className="mb-4">
                            <label htmlFor="theme-color" className="block text-sm font-bold text-gray-700 mb-2">
                                Choose your theme color:
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    id="theme-color"
                                    className="w-16 h-16 cursor-pointer rounded-lg border border-gray-300"
                                    value={themeColor}
                                    onChange={(e) => setThemeColor(e.target.value)}
                                />
                                <span className="text-gray-600">{themeColor}</span>
                            </div>
                        </div>
                        
                        <div className="mt-6 text-center border-t border-gray-300 py-4 flex justify-center">
                            <button
                                type="button"
                                onClick={saveThemeColor}
                                className="flex gap-2 items-center text-white py-2 px-6 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
                                style={{ background: "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))" }}
                            >
                                <Palette className="w-5 h-5" />
                                Update Theme
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ThemeColorSettings;