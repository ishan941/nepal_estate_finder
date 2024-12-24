import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(400, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own Listings!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(400, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own Listings!"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(400, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
//search funcanality
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    //made offer false at first
    let offer = req.query.offer;
    if (offer === "undefined" || offer === "false") {
      offer = { $in: [false, true] };

      //made furnished false at first
      let furnished = req.query.furnished;
      if (furnished === "undefined" || furnished === "false") {
        furnished = { $in: [false, true] };
      }
      //made parking false at first
      let parking = req.query.parking;
      if (parking === "undefined" || parking === "false") {
        parking = { $in: [false, true] };
      }

      //made type false at first
      let type = req.query.type;
      if (type === "undefined" || type === "all") {
        type = { $in: ["sale", "rent"] };
      }
      const searchTerm = req.query.searchTerm || "";
      const sort = req.query.sort || "createdAt";
      const order = req.query.order || "desc";

      //uppercase and lowercase
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: "i" },
        offer,
        furnished,
        parking,
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
      return res.status(200).json(listings);
    }
  } catch (error) {
    next(error);
  }
};
