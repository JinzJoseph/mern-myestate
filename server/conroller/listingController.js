import Listing from "../models/listingmodel.js";

export const createListing = async (req, res, next) => {
  console.log(req.body);
    try {
      
      const listing = await Listing.create(req.body);
      return res.status(201).json(listing);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
          message: "Server Error",
          success: false,
        });
    }
}  