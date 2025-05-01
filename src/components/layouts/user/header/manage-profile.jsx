"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import from next/navigation
import defaultImage from "../../../../assets/photo.png"; // Adjust path as needed
import { CgProfile } from "react-icons/cg";
import { FiUpload, FiTrash2  } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs"; 

const Profile = () => {
  const router = useRouter(); // Using the useRouter hook from next/navigation
  const [user, setUser] = useState(null);
  const [previewImg, setPreviewImg] = useState(defaultImage);
  const [removeImage, setRemoveImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    upload_image: null,
  });

  useEffect(() => {
    axios
      .get("https://eamms.bluai.ai/api/user-profile", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          mobile: response.data.mobile,
        });
        setPreviewImg(response.data.profile_image);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        router.push("/user-portal"); // Redirect using router.push
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImg(event.target.result);
        setRemoveImage(false);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, upload_image: file });
    }
  };

  const handleRemoveImage = () => {
    setPreviewImg(defaultImage);
    setRemoveImage(true);
    setFormData({ ...formData, upload_image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    if (formData.upload_image) {
      data.append("upload_image", formData.upload_image);
    }
    data.append("remove_image", removeImage ? "1" : "0");

    axios
      .post("https://eamms.bluai.ai/api/update-profile", data, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Profile updated successfully!");
        window.location.reload(); // Add this line
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[55vw] h-fit max-w-6xl bg-white shadow-lg rounded-xl">
        <div
          className="flex items-center justify-between text-white px-4 py-2 rounded-t-xl"
          style={{
            background:
              "linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))",
          }}
        >
          <h5 className="text-lg font-semibold flex items-center gap-2">
            <CgProfile size={20} color="white" /> Manage Profile
          </h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4">
            {/* Left Section - Form */}
            <div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-500 font-bold"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-500 font-bold"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="mobile"
                  className="block text-gray-500 font-bold"
                >
                  Mobile No:
                </label>
                <input
                  type="text"
                  id="mobile"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Right Section - Image */}
            <div className="flex flex-col items-center">
              <div className="mb-4 relative">
                <img
                  src={previewImg}
                  alt="Profile"
                  className="rounded-full border-4 border-gray-400 shadow-sm w-40 h-40 object-cover"
                />
                <input
                  type="hidden"
                  name="remove_image"
                  value={removeImage ? "1" : "0"}
                />
              </div>

              <div className="flex space-x-4">
                <label
                  htmlFor="fileInput"
                  className="btn group border border-blue-500 hover:bg-blue-500 rounded-md text-sm py-2 px-3 cursor-pointer"
                >
                  <FiUpload size={16} className="text-blue-500 group-hover:text-white" />
                </label>

                <button
                  type="button"
                  className="btn group border border-red-500 hover:bg-red-500 rounded-md text-sm py-2 px-3 cursor-pointer"
                  onClick={handleRemoveImage}
                >
                  <FiTrash2  size={16} className="text-red-500 group-hover:text-white"/> 
                </button>
              </div>
              <input
                type="file"
                id="fileInput"
                name="upload_image"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-6 text-center border-t border-gray-300 py-4 flex justify-center">
            <button
              type="submit"
              className="flex gap-2 text-white py-2 px-6 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer"
              style={{ background: 'linear-gradient(225deg, rgb(45, 116, 163), rgb(0, 66, 104))' }}
            >
               <BsCheckCircle size={20} color="white" />  Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
