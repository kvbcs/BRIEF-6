const express = require("express");
const {
	ctrlCreateListing,
	ctrlAllListings,
	ctrlDeleteListing,
	ctrlUpdateListing,
	ctrlMyListings,
	ctrlLike,
	ctrlDislike,
} = require("../ListingController");
const { verifUpdateListing } = require("../../Middlewares/middlewares");
const { extractToken } = require("../../Utils/extractToken");

const listingRouter = express.Router();

listingRouter.post("/create", ctrlCreateListing);
listingRouter.post("/like/:id", ctrlLike);
listingRouter.post("/dislike/:id", ctrlDislike);
listingRouter.get("/all", ctrlAllListings);
listingRouter.route("/mine", extractToken).post(ctrlMyListings);
listingRouter.delete("/delete/:id", ctrlDeleteListing);
listingRouter.patch("/update/:id", verifUpdateListing, ctrlUpdateListing);

module.exports = listingRouter;
