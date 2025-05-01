"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import CompanyLogo from "@/assets/company_logo.png";
import { BsEnvelope, BsPhone, BsCamera, BsPersonPlus, BsArrowLeft } from "react-icons/bs";

export default function EmployeeFaceRegister() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageBlob, setImageBlob] = useState(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
        Swal.fire('Camera Error', 'Unable to access your camera. Please check device permissions.', 'error');
      });

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) {
        setImageBlob(blob);
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImageUrl(imageUrl);

        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Image captured successfully!',
          showConfirmButton: false,
          timer: 3000,
          toast: true
        });
      } else {
        Swal.fire('Capture Error', 'Failed to capture image. Please try again.', 'error');
      }
    }, 'image/jpeg');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageBlob) {
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'Please capture an image before submitting the form.',
        showConfirmButton: false,
        timer: 5000,
        toast: true
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('company_mail', email);
    formData.append('mobile_number', phone);
    formData.append('image', imageBlob, 'captured_image.jpg');

    try {
      const response = await fetch('https://eamms.bluai.ai/api/register', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const data = await response.json();

      if (data.message) {
        Swal.fire('Success', data.message, 'success');
        setEmail('');
        setPhone('');
        setCapturedImageUrl(null);
        setImageBlob(null);
      } else {
        Swal.fire('Error', data.error || 'Unexpected server response.', 'error');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-lg flex justify-center">
        <div className="flex flex-col w-[50vw] bg-white/10 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-transparent py-4 text-center border-b border-white/20">
            <Image
              src={CompanyLogo}
              alt="BlutechAI Logo"
              className="mx-auto h-12 w-auto"
              priority
            />
            <h4 className="mt-3 text-xl font-semibold text-black">
              Face Registration
            </h4>
          </div>

          {/* Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  Email Address
                </label>
                <div className="flex items-center bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-1">
                  <span className="me-2 text-gray-500">
                    <BsEnvelope size={18} />
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-gray-500 mb-1"
                >
                  Phone Number
                </label>
                <div className="flex items-center bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-1">
                  <span className="me-2 text-gray-500">
                    <BsPhone size={18} />
                  </span>
                  <input
                    type="text"
                    id="phone"
                    className="flex-1 border-0 focus:ring-0 p-2 outline-none"
                    placeholder="Phone Number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Camera Preview & Capture */}
              <div className="mb-4">
                <div className="relative rounded-lg overflow-hidden bg-black h-64 flex">
                  <div className="flex-1 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                    {!capturedImageUrl && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                        <BsCamera size={24} />
                        <small className="mt-2">Camera Preview</small>
                      </div>
                    )}
                  </div>
                  {capturedImageUrl && (
                    <div className="flex-1 relative border-l border-gray-500">
                      <img
                        src={capturedImageUrl}
                        alt="Captured"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 bg-black/25">
                        <small>Captured Image</small>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={captureImage}
                  className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-2 rounded-md flex items-center text-sm cursor-pointer"
                >
                  <BsCamera size={18} className="me-2" /> Capture
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm disabled:opacity-50 cursor-pointer"
                  disabled={!capturedImageUrl || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Registering...
                    </>
                  ) : (
                    <>
                      <BsPersonPlus size={18} className="me-2" /> Register
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex item-center justify-center bg-transparent py-4 text-center border-t border-white/20">
            <button
              onClick={() => router.push("/face-recognition")}
              className="px-4 py-1 rounded-full text-sm text-gray-500 hover:text-white hover:bg-gray-500 flex item-center border border-gray-500 cursor-pointer"
            >
              <BsArrowLeft size={18} className="me-2" />
              Go to Face Recognition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}