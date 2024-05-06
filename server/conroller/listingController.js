import Listing from "../models/listingmodel.js";

export const createListing = async (req, res, next) => {
  // console.log(req.body);
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
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).send({
      meassage: "List is not found",
      success: false,
    });
  }
  if (req.user.id !== listing.useRef) {
    return res.status(401).send({
      message: "you can only delete your list only",
      success: false,
    });
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "successfully Deleted list",
      success: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
export const getList = async (req, res) => {
  // console.log(req.params.id)
  const listing = await Listing.findById(req.params.id);
 // console.log(listing);
  try {
    if (!listing) {
      return res.status(404).send({
        message: "listing is not found",
        success: false,
      });
    }
    res.status(200).send({
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
export const updateList = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).send({
      message: "listing is not found",
      success: false,
    });
  }
  if (req.user.id !== listing.useRef) {
    return res.status(401).send({
      message: "you can only your own account",
      success: false,
    });
  }
  try {
    const updateList = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res .status(200).send({
      message:"successfully Updatedd",
      success:true
    })
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      success: false,
      data:updateList
    });
  }
};
