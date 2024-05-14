const express = require("express");
const {
	ctrlCreateListing,
	ctrlAllListings,
	ctrlDeleteListing,
	ctrlUpdateListing,
} = require("../ListingController");

const listingRouter = express.Router();

listingRouter.post("/create", ctrlCreateListing);
listingRouter.get("/all", ctrlAllListings);
listingRouter.delete("/delete/:id", ctrlDeleteListing);
listingRouter.patch("/update/:id", ctrlUpdateListing);

module.exports = listingRouter;
