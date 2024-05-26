const express = require("express");
const {
	ctrlCreateListing,
	ctrlAllListings,
	ctrlDeleteListing,
	ctrlUpdateListing,
	ctrlMyListings,
} = require("../ListingController");
const { verifUpdateListing } = require("../../Middlewares/middlewares");
const { extractToken } = require("../../Utils/extractToken");
const { ctrlLike, ctrlDislike } = require("../LikeController");

//Initialisation du router
const listingRouter = express.Router();

//Instanciation des routes du CRUD pour listings
listingRouter.post("/create", ctrlCreateListing);
listingRouter.get("/all", ctrlAllListings);
listingRouter.route("/mine", extractToken).post(ctrlMyListings);
listingRouter.delete("/delete/:id", ctrlDeleteListing);
listingRouter.patch("/update/:id", verifUpdateListing, ctrlUpdateListing);

//Instanciation des routes pour les likes/dislikes
listingRouter.post("/like/:id", ctrlLike);
listingRouter.post("/dislike/:id", ctrlDislike);

//Exportation du router
module.exports = listingRouter;
