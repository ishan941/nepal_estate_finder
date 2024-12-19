import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import "swiper/css/bundle";
import Contact from "../components/Contact";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="min-h-screen p-3 bg-gray-50">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && (
        <div>
          {/* Swiper Section */}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                    borderRadius: 8,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Copy Link */}
          <div className="fixed top-14 right-8 z-10">
            <button
              className="p-3 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <FaShare className="text-gray-500" />
            </button>
            {copied && (
              <p className="mt-2 text-sm bg-white shadow p-2 rounded">
                Link copied!
              </p>
            )}
          </div>

          {/* Listing Details */}
          <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg mt-6">
            {/* Title and Price */}
            <h1 className="text-3xl font-bold text-gray-800">
              {listing.name}{" "}
            </h1>

            {/* Address */}
            <p className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="text-green-600 mr-2" />{" "}
              {listing.address}
            </p>

            {/* Tags */}
            <div className="flex space-x-3">
              <span
                className={`px-4 py-2 text-sm font-semibold rounded-full ${
                  listing.type === "rent"
                    ? "bg-blue-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
              {listing.discountPrice && (
                <span className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-full">
                  Rs {listing.discountPrice} OFF
                </span>
              )}
            </div>

            {/* Price Details */}
            <div className="p-4 bg-gray-100 rounded-lg shadow">
              {listing.discountPrice ? (
                <>
                  <p className="line-through text-gray-400">
                    Rs. {listing.regularPrice.toLocaleString("en-US")}
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    Rs.{" "}
                    {(
                      listing.regularPrice - listing.discountPrice
                    ).toLocaleString("en-US")}
                  </p>
                  <p className="text-sm text-red-500">
                    Save Rs. {listing.discountPrice.toLocaleString("en-US")} (
                    {Math.round(
                      (listing.discountPrice / listing.regularPrice) * 100
                    )}
                    % OFF)
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-green-600">
                  Rs. {listing.regularPrice.toLocaleString("en-US")}
                </p>
              )}
            </div>

            {/* Features */}
            <ul className="grid grid-cols-2 gap-4 text-gray-800">
              <li className="flex items-center">
                <FaBed className="text-blue-600 mr-2" />{" "}
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>
              <li className="flex items-center">
                <FaBath className="text-blue-600 mr-2" />{" "}
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </li>
              <li className="flex items-center">
                <FaParking className="text-blue-600 mr-2" />{" "}
                {listing.parking ? "Parking Spot" : "No Parking"}
              </li>
              <li className="flex items-center">
                <FaChair className="text-blue-600 mr-2" />{" "}
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>

            {/* Description */}
            <p className="text-gray-600">
              <span className="font-semibold">Description: </span>
              {listing.description}
            </p>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
