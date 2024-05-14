const express = require("express");
const {
	ctrlCreateListing,
	ctrlAllListings,
	ctrlDeleteListing,
	ctrlUpdateListing,
} = require("../ListingController");
const { verifUpdateListing } = require("../../Middlewares/middlewares");

const listingRouter = express.Router();

listingRouter.post("/create", ctrlCreateListing);
listingRouter.get("/all", ctrlAllListings);
listingRouter.delete("/delete/:id", ctrlDeleteListing);
listingRouter.patch("/update/:id", verifUpdateListing, ctrlUpdateListing);

module.exports = listingRouter;
