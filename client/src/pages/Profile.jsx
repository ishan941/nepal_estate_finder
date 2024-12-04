import React, { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const handleImageClick = () => {
    fileRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Update state
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.error("Upload failed:", error.message);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({ ...prevData, avatar: downloadURL }));
        });
      }
    );
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error || !currentUser) {
    return <p>Error loading user data. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto p-8">
      {/* Profile Header (Image + Basic Info) */}
      <div className="flex items-center space-x-6 mb-8">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={formData.avatar || currentUser.avatar}
            alt="Profile"
            className="rounded-full h-32 w-32 object-cover border-4 border-gray-200 shadow-md cursor-pointer hover:opacity-90"
            onClick={handleImageClick} // Make image clickable
          />
          {/* Hidden File Input */}
          <input
            onChange={handleFileChange}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
        </div>
        <div>
          {/* User Info */}
          <h2 className="text-2xl font-semibold text-gray-800">
            {currentUser.username || "No username available"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{currentUser.email}</p>
          <p className="text-sm text-gray-600 mt-1">
            {currentUser.bio || "No bio available"}
          </p>
          {/* Social Links (Optional) */}
          <div className="mt-4">
            {currentUser.github && (
              <a
                href={currentUser.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition duration-200"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Upload Status */}
      <p className="text-sm self-center">
        {fileUploadError ? (
          <span className="text-red-700">
            Error uploading image (ensure it's less than 2 MB).
          </span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
        ) : filePerc === 100 ? (
          <span className="text-green-700">Image successfully uploaded!</span>
        ) : (
          ""
        )}
      </p>

      {/* Form for updating info */}
      <form className="space-y-6">
        {/* Username Input */}
        <div>
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-medium"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            defaultValue={currentUser.username}
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            defaultValue={currentUser.email}
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bio Input */}
        <div>
          <label
            htmlFor="bio"
            className="block text-gray-700 text-sm font-medium"
          >
            Bio
          </label>
          <textarea
            id="bio"
            placeholder="Tell us about yourself"
            defaultValue={currentUser.bio}
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter new password"
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Update Button */}
        <button
          type="submit"
          className="w-full py-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Profile
        </button>
      </form>

      {/* Account Actions: Delete Account and Sign Out */}
      <div className="flex justify-between items-center mt-8">
        <span className="text-sm text-red-600 cursor-pointer hover:underline">
          Delete Account
        </span>
        <span className="text-sm text-gray-600 cursor-pointer hover:underline">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
