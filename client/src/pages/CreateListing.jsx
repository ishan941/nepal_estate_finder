import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setFiles([]);
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  return (
    <main className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-lg">
      <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
        Create a Listing
      </h1>
      <form className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-6 flex-1 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter the listing name"
              className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              maxLength="62"
              minLength="10"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter the description"
              className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none h-32 resize-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-gray-700 font-medium mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter the address"
              className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { id: "sale", label: "Sell" },
              { id: "rent", label: "Rent" },
              { id: "parking", label: "Parking Spot" },
              { id: "furnished", label: "Furnished" },
              { id: "offer", label: "Offer" },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <input
                  type="checkbox"
                  id={item.id}
                  className="w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Images</label>
            <p className="text-sm text-gray-500">
              The first image will be the cover (max 6 images)
            </p>
            <div className="flex gap-4 items-center">
              <input
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
              <button
                type="button"
                disabled={uploading || files.length === 0}
                onClick={handleImageSubmit}
                className={`p-3 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg uppercase transition-all ${
                  uploading ? "opacity-50" : "hover:shadow-lg hover:scale-105"
                }`}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          {formData.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="relative border p-3 rounded-lg shadow hover:shadow-md"
                >
                  <img
                    src={url}
                    alt="Uploaded"
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-red-700">
            {" "}
            {imageUploadError && imageUploadError}
          </p>
          <button className="p-4 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-lg uppercase hover:shadow-lg hover:scale-105 transition-all">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
