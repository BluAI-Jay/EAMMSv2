"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BiShow, BiHide, BiRefresh, BiX } from "react-icons/bi"; // Added BiX for the cross icon
import { FaEnvelope, FaLock, FaShieldAlt  } from "react-icons/fa";

export default function LoginPage() {
    const navigate = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Define this at the top of your component
 
    const [generatedCaptcha, setGeneratedCaptcha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [hideCaptcha, setHideCaptcha] = useState(false);
    const [captchaError, setCaptchaError] = useState("");
    const [loginError, setLoginError] = useState("");

    useEffect(() => {
        setGeneratedCaptcha(generateCaptcha()); 

        if (typeof window !== "undefined") {
            const storedUsername = sessionStorage.getItem("username") || "";
            const storedPassword = sessionStorage.getItem("password") || "";
            const storedRemember = sessionStorage.getItem("rememberMe") === "true";
            setUsername(storedUsername);
            setPassword(storedPassword);
            setRememberMe(storedRemember);
        }

        function updateCaptchaRequirement() {
            const minScreenWidth = 768;
            const maxScreenWidth = 1340;
            setHideCaptcha(window.innerWidth >= minScreenWidth && window.innerWidth <= maxScreenWidth);
        }
        updateCaptchaRequirement();
        window.addEventListener("resize", updateCaptchaRequirement);
        return () => window.removeEventListener("resize", updateCaptchaRequirement);
    }, []);

    useEffect(() => {
        if (rememberMe) {
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
            sessionStorage.setItem("rememberMe", "true");
        } else {
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("password");
            sessionStorage.removeItem("rememberMe");
        }
    }, [rememberMe, username, password]);

    function generateCaptcha() {
        const chars = "0123456789";
        return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    }

    const refreshCaptcha = () => {
        setGeneratedCaptcha(generateCaptcha());
        setCaptcha("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setCaptchaError("");
        setLoginError("");
        setIsLoading(true); // Show loader
    
        // CAPTCHA Validation
        if (!hideCaptcha && captcha !== generatedCaptcha) {
            setCaptchaError("Invalid CAPTCHA. Please try again.");
            refreshCaptcha();
            setIsLoading(false); // Stop loader on CAPTCHA error
            return;
        }
    
        try {
            const response = await axios.post("https://eamms.bluai.ai/api/user-login", {
                username1: username,
                password1: password,
            });
    
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate.push('/user-portal/dashboard'); // Redirect after success
            } else {
                setLoginError("Login failed. No token received.");
            }
        } catch (error) {
            setLoginError(error.response?.data?.error || "Login failed. Please try again.");
            refreshCaptcha();
        } finally {
            setIsLoading(false); // Always stop the loader
        }
    };

    return (
        <div className=" bg-transparent w-[90vw] sm:w-[470] max-h-[670] rounded-xl border border-gray-200 shadow-lg p-12">
            <h1 className="flex justify-center mb-4">
                <img src="/company_logo.png" alt="BluAI Logo" className="h-16" />
            </h1>

            <form onSubmit={handleLogin} className="max-h-[90%] flex flex-col gap-5">
                {/* Login Error */}
                {loginError && (
                    <div className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-md transition-all duration-300">
                        <p className="text-sm font-medium">{loginError}</p>
                        <button
                            onClick={() => {
                                setLoginError(""); // Clear the error message
                                setPassword("");   // Clear the password field
                            }}
                            className="ml-4 text-red-700 hover:text-red-900 transition duration-200"
                            aria-label="Dismiss error"
                        >
                            <BiX className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Email */}
                <div className="w-full">
                    <label className="font-bold text-md">Email</label>
                    <div className="p-3 border border-gray-300 bg-white rounded-xl flex items-center gap-4 hover:shadow-lg transition-shadow duration-500">
                        <span className="text-gray-500"><FaEnvelope /></span>
                        <input
                            type=""
                            placeholder="Email Address"
                            className="w-full outline-none placeholder:text-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="w-full">
                    <label className="font-bold text-md">Password</label>
                    <div className="p-3 border border-gray-300 bg-white rounded-xl flex items-center gap-4 hover:shadow-lg transition-shadow duration-500">
                    <span className="text-gray-500"><FaLock /></span>
                        <input
                            className="w-full outline-none  placeholder:text-sm"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <BiHide className="text-xl"/> : <BiShow className="text-xl"/>}
                        </span>
                    </div>
                </div>

                {/* CAPTCHA */}
                {!hideCaptcha && (
                    <div className="w-full">
                        <label className="font-bold text-md">Captcha</label>
                        <div className="flex items-center gap-4 w-full">
                            <div className="px-5 py-3 rounded-lg bg-[#000] text-white">{generatedCaptcha}</div>
                            <div className="flex items-center gap-2 w-[80%] border border-gray-300 bg-white rounded-lg p-3 hover:shadow-lg transition-shadow duration-500">
                                <FaShieldAlt className="text-gray-500"/>
                                <input
                                    type="text"
                                    className="bg-transparent outline-none w-full placeholder:text-sm"
                                    placeholder="Enter Captcha"
                                    value={captcha}
                                    onChange={(e) => setCaptcha(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                                <button type="button" onClick={refreshCaptcha} className="cursor-pointer transform transition-transform duration-500 hover:rotate-360">
                                    <BiRefresh className="text-xl"/>
                                </button>
                            </div>

                        </div>
                        {captchaError && (
                            <div className="py-2">
                                <div className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-md transition-all duration-300">
                                    <p className="text-sm font-medium">{captchaError}</p>
                                    <button
                                        onClick={() => {
                                            setCaptchaError(""); // Clear the error message
                                            setCaptcha(""); // Clear the CAPTCHA input field
                                        }}
                                        className="ml-4 text-red-700 hover:text-red-900 transition duration-200"
                                        aria-label="Dismiss error"
                                    >
                                        <BiX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* Remember Me */}
                <div className="flex gap-4">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        className="cursor-pointer"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label className="text-sm" htmlFor="rememberMe">Remember Me</label>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full text-white font-bold bg-blue-500 hover:bg-blue-600 rounded-full py-3 flex justify-center items-center cursor-pointer"
                    disabled={isLoading}
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
                    ) : (
                        "Log in"
                    )}
                </button>

            </form>

            {/* Footer Buttons */}
            <div className="flex justify-center gap-1 mt-6">
                <button 
                    className="text-gray-700 text-sm transition-colors duration-200 bg-white hover:bg-[#0056b3] hover:text-white px-4 py-2 rounded-full cursor-pointer"
                    onClick={() => navigate.push("/admin-login")}
                >
                    Admin Login
                </button>
                <button 
                    className="text-gray-700 text-sm transition-colors duration-200 bg-white hover:bg-[#0056b3] hover:text-white px-4 py-2 rounded-full cursor-pointer"
                    onClick={() => navigate.push("/guest-register")}
                >
                    Guest Sign up
                </button>
                <button 
                    className="text-gray-700 text-sm transition-colors duration-200 bg-white hover:bg-[#0056b3] hover:text-white px-3 py-2 rounded-full cursor-pointer"
                    onClick={() => navigate.push("/face-recognition")}
                >
                    Face Recognition
                </button>
            </div>
        </div>
    );
}