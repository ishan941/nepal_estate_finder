import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  return (
    <div className="bg-white shadow-lg hover:shadow-xl transition-all rounded-xl overflow-hidden w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`} className="block group">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={
              listing.imageUrls[0] ||
              "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
            }
            alt="listing cover"
            className="h-[320px] sm:h-[240px] w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-green-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
            {listing.discountPrice ? "Discount" : "New"}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">
            {listing.name}
          </h3>

          {/* Address */}
          <div className="flex items-center text-gray-600 gap-2 text-sm">
            <MdLocationOn className="text-green-700 w-5 h-5" />
            <p className="truncate">{listing.address}</p>
          </div>
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
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* Pricing */}
          <div className="mt-2">
            {listing.discountPrice && listing.regularPrice ? (
              <div>
                {/* Original Price */}
                <p className="text-gray-400 text-sm line-through">
                  Rs. {formatPrice(listing.regularPrice)}
                </p>

                {/* Discounted Price */}
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold text-green-600">
                    Rs.{" "}
                    {formatPrice(listing.regularPrice - listing.discountPrice)}
                  </p>
                  {listing.type === "rent" && (
                    <span className=" text-gray-400 font-medium">/ month</span>
                  )}
                </div>

                {/* Savings */}
                <p className="text-sm text-red-500">
                  Save Rs. {formatPrice(listing.discountPrice)} (
                  {Math.round(
                    (listing.discountPrice / listing.regularPrice) * 100
                  )}
                  % OFF)
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold text-green-600">
                Rs. {formatPrice(listing.regularPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
