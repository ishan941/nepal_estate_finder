import React from "react";

const Search = () => {
  return (
    <div className="flex flex-col  md:flex-row ">
      <div className="p-4 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className=" flex items-center gap-2">
            <label className="whitespace-nowrap"></label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="bg-gray-100  flex flex-col gap-4 rounded-md p-3">
            <div className="flex gap-2 flex-wrap">
              <label className="font-semibold  text-slate-700">Type:</label>
              <div className=" flex gap-2">
                <input type="checkbox" id="all" className="w-5" />
                <span> Rent & Sale</span>
              </div>
              <div className=" flex gap-2">
                <input type="checkbox" id="rent" className="w-5" />
                <span> Rent</span>
              </div>
              <div className=" flex gap-2">
                <input type="checkbox" id="sale" className="w-5" />
                <span>Sale</span>
              </div>
              <div className=" flex gap-2">
                <input type="checkbox" id="offer" className="w-5" />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <label className="font-semibold  text-slate-700">
                Amenities:
              </label>
              <div className=" flex gap-2">
                <input type="checkbox" id="parking" className="w-5" />
                <span>Parking</span>
              </div>
              <div className=" flex gap-2">
                <input type="checkbox" id="furnished" className="w-5" />
                <span> Furnished</span>
              </div>
            </div>
            <div className=" flex items-center gap-2">
              <label className="font-semibold  text-slate-700">Sort:</label>
              <select id="sort_order" className="border rounded-lg p-3">
                <option> Price high to low</option>
                <option> Price low to high</option>
                <option> Price latest</option>
                <option> Price oldest</option>
              </select>
            </div>
          </div>

          <button className="bg-blue-600 text-white p-3 rounded-lg font-semibold uppercase hover:bg-blue-700 transition-all">
            Search
          </button>
        </form>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-4 rounded-md p-3">
          <h1 className=" text-3xl font-semibold border-b text-slate-700">
            Listing results:{" "}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Search;
