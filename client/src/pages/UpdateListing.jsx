import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
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
          setImageUploadError("Image upload failed (2 MB max per image)");
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
          console.log(`Upload is ${progress}% done`);
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

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData({
        ...formData,
        type: id,
        sale: id === "sale",
        rent: id === "rent",
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Payload being sent: ", formData);

    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-lg">
      <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
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
              onChange={handleChange}
              value={formData.name}
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
              onChange={handleChange}
              value={formData.description}
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
              onChange={handleChange}
              value={formData.address}
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
                  onChange={handleChange}
                  checked={formData[item.id]}
                />
                {item.label}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Bedrooms"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms" className="text-gray-700 font-medium">
                Bedrooms
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Bathrooms"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label htmlFor="bathrooms" className="text-gray-700 font-medium">
                Bathrooms
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="0"
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Regular Price"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <label
                htmlFor="regularPrice"
                className="text-gray-700 font-medium"
              >
                Regular Price
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Discount Price"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <label
                htmlFor="discountPrice"
                className="text-gray-700 font-medium"
              >
                Discount Price
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 flex-1 bg-white p-6 rounded-lg shadow-md">
          <div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Photos</h3>
            {formData.imageUrls.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`uploaded-${index}`}
                      className="rounded-lg w-full h-36 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No photos uploaded yet</p>
            )}
          </div>
          <div>
            <label
              htmlFor="fileInput"
              className="block text-gray-700 font-medium mb-2"
            >
              Select Images
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".jpg, .jpeg, .png"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {files.length > 0 && (
              <button
                type="button"
                onClick={handleImageSubmit}
                className="mt-4 bg-blue-600 text-white p-2 rounded-lg w-full"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            )}
            {imageUploadError && (
              <p className="text-red-600 mt-2 text-sm">{imageUploadError}</p>
            )}
          </div>
        </div>
      </form>

      <button
        type="submit"
        onClick={handleSubmit}
        className="mt-8 bg-blue-800 text-white p-4 rounded-lg w-full"
      >
        {loading ? "Updating..." : "Update Listing"}
      </button>

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
    </main>
  );
};

export default UpdateListing;
