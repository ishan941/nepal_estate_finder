import React, { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  // Initialize formData with currentUser details
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser]);

  // Trigger file upload when a file is selected
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleImageClick = () => {
    fileRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("File exceeds 2 MB size limit.", {
        position: "top-right",
        autoClose: 3000,
        transition: { Slide },
        closeOnClick,
      });
      return;
    }
    setFile(selectedFile);
  };

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
        toast.error("Error uploading image. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({ ...prevData, avatar: downloadURL }));
          toast.success("Image uploaded successfully!", {
            position: "top-center",
            autoClose: 3000,
          });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to update profile.");
      }
      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      dispatch(updateUserFailure(error.message));
      toast.error(error.message || "Error updating profile.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error || !currentUser) {
    return <p>Error loading user data. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto p-8">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-8">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={formData.avatar || currentUser.avatar}
            alt="Profile"
            className="rounded-full h-32 w-32 object-cover border-4 border-gray-200 shadow-md cursor-pointer hover:opacity-90"
            onClick={handleImageClick}
          />
          <input
            onChange={handleFileChange}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {currentUser.username || "No username available"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{currentUser.email}</p>
          <p className="text-sm text-gray-600 mt-1">
            {currentUser.bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Upload Status */}
      <p className="text-sm self-center">
        {filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
        ) : (
          ""
        )}
      </p>

      {/* Update Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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
            value={formData.username}
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
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
            value={formData.email}
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
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
            value={formData.bio}
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>

        {/* Update Button */}
        <button
          type="submit"
          className="w-full py-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? "Loading..." : " Update Profile"}
        </button>
      </form>

      {/* Account Actions */}
      <div className="flex justify-between items-center mt-8">
        <span className="text-sm text-red-600 cursor-pointer hover:underline">
          Delete Account
        </span>
        <Link to="/sign-in">
          <span className="text-sm text-gray-600 cursor-pointer hover:underline">
            Sign Out
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
