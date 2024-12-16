import React, { useRef, useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

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
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Listing from "../../../api/models/listing.model";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const dispatch = useDispatch();
  const [userListings, setUserListings] = useState([]);

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
      toast.error("File exceeds 2 MB size limit.", { autoClose: 3000 });
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
        toast.error("Error uploading image. Please try again.", {
          autoClose: 3000,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
          toast.success("Image uploaded successfully!", { autoClose: 3000 });
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to update profile.");
      }
      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully!", { autoClose: 3000 });
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message || "Error updating profile.", {
        autoClose: 3000,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutUser = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  if (loading) return <p>Loading user data...</p>;
  if (error || !currentUser) return <p>Error loading user data.</p>;

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer />

      {/* Profile Header */}
      <div className="flex items-center mb-8 space-x-6">
        <img
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
          className="h-32 w-32 rounded-full border shadow cursor-pointer"
          onClick={handleImageClick}
        />
        <input
          type="file"
          ref={fileRef}
          onChange={handleFileChange}
          hidden
          accept="image/*"
        />
        <div>
          <h1 className="text-2xl font-bold">{currentUser.username}</h1>
          <p className="text-sm text-gray-500">{currentUser.email}</p>
          <p className="text-sm text-gray-600">{currentUser.bio}</p>
        </div>
      </div>

      {filePerc > 0 && filePerc < 100 && (
        <p className="text-sm text-gray-500">Uploading: {filePerc}%</p>
      )}

      {/* Update Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Username"
          id="username"
          value={formData.username}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          label="Bio"
          id="bio"
          value={formData.bio}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          id="password"
          type="password"
          placeholder="Enter new password"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded"
        >
          {loading ? "Loading..." : "Update Profile"}
        </button>
        <Link
          to="/create-listing"
          className="block text-center p-3 bg-green-600 text-white rounded"
        >
          Create Listing
        </Link>
      </form>

      {/* Actions */}
      <div className="mt-6 flex justify-between text-sm">
        <span
          onClick={handleDeleteUser}
          className="text-red-600 cursor-pointer hover:underline"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOutUser}
          className="text-gray-600 cursor-pointer hover:underline"
        >
          Sign Out
        </span>
      </div>
      <button onClick={handleShowListings} className="text-green-500 w-full">
        show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {userListings &&
        userListings.length > 0 &&
        userListings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            {/* Listing Image */}
            <Link to={`/listing/${listing._id}`} className="block">
              <img
                src={listing.imageUrls[0]}
                alt="Listing Cover"
                className="h-48 w-full object-cover"
              />
            </Link>

            {/* Listing Details */}
            <div className="p-4">
              <Link to={`/listing/${listing._id}`}>
                <h3 className="text-lg font-semibold text-gray-800 hover:underline truncate">
                  {listing.name}
                </h3>
              </Link>
              <p className="text-gray-500 mt-2 line-clamp-2">
                {listing.description}
              </p>

              {/* Price */}
              <div className="mt-3">
                {listing.discountPrice && listing.regularPrice ? (
                  <div>
                    {/* Regular Price with Line-through */}
                    <div className="text-sm text-gray-500 line-through">
                      Rs. {listing.regularPrice}
                    </div>

                    <div className="text-lg font-bold text-green-600">
                      Rs. {listing.regularPrice - listing.discountPrice}
                    </div>
                    <div className="text-sm text-red-500">
                      Save Rs. {listing.discountPrice} (
                      {Math.round(
                        (listing.discountPrice / listing.regularPrice) * 100
                      )}
                      % OFF)
                    </div>
                  </div>
                ) : (
                  <div className="text-lg font-bold text-green-600">
                    Rs. {listing.regularPrice}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center bg-gray-100 p-3">
              <button
                onClick={() => handleEditListing(listing._id)}
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaEdit className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteListing(listing._id)}
                className="text-red-500 hover:text-red-600 flex items-center"
              >
                <FaTrashAlt className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

const InputField = ({ label, id, type = "text", ...props }) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 text-sm font-medium">
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...props}
      className="w-full mt-1 p-3 rounded border focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Profile;
