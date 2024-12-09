import React from "react";

const CreateListing = () => {
  return (
    <main className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 text-center my-6">
        Create a Listing
      </h1>
      <form className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-6 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            placeholder="Description"
            className="border p-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 h-24 resize-none"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            id="address"
            required
          />
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
                className="flex items-center gap-2 text-gray-700"
              >
                <input type="checkbox" id={item.id} className="w-5 h-5" />
                {item.label}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: "bedroom", label: "Beds", min: 1, max: 10 },
              { id: "beds", label: "Baths", min: 1, max: 10 },
              { id: "regularPrice", label: "Regular Price", min: 1, max: 10 },
              {
                id: "discountPrice",
                label: "Discounted Price",
                min: 1,
                max: 10,
              },
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="number"
                  id={item.id}
                  min={item.min}
                  max={item.max}
                  required
                  className="p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <label htmlFor={item.id} className="text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-6">
          <p className="font-semibold text-gray-800">
            Images:
            <span className="font-normal text-gray-500 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 items-center">
            <input
              className="p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 text-blue-700 border border-blue-700 rounded-lg uppercase hover:bg-blue-700 hover:text-white transition-all">
              Upload
            </button>
          </div>
          <button className="p-3 bg-blue-600 text-white rounded-lg uppercase hover:bg-blue-500 transition-all">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
