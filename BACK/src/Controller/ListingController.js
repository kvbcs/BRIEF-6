const { Listing } = require("../Model/Listing");
const client = require("../Services/MongoConnexion");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { pool } = require("../Services/MySQLConnexion");
const { extractToken } = require("../Utils/extractToken");
require("dotenv").config();

//Fonction pour créer une publication
const ctrlCreateListing = async (req, res) => {
	if (!req.body.title || !req.body.text) {
		res.status(400).send("Missing fields");
		return;
	}
	const token = await extractToken(req);
	let id_user;
	let name;
	let photo;
	console.log(token);

	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		if (err) {
			console.log(err.stack);
			res.status(401).json({ err: "Unauthorized" });
			return;
		} else {
			id_user = authData.id_user;
			name = authData.name;
			photo = authData.photo;
		}
	});

	console.log(id_user, name, photo);
	try {
		let newListing = new Listing(
			req.body.title,
			req.body.text,
			0,
			0,
			0,
			id_user,
			photo,
			name,
			new Date()
		);
		console.log(newListing);
		let result = await client
			.db("BRIEF6")
			.collection("listing")
			.insertOne(newListing);
		res.status(200).json(result);
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error creating listing" });
	}
};

//Fonction pour voir toutes les publications
const ctrlAllListings = async (req, res) => {
	try {
		let apiCall = client.db("BRIEF6").collection("listing").find();

		let listings = await apiCall.toArray();

		res.status(200).json(listings);
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error getting all listings" });
	}
};

//Fonction pour supprimer ses publications
const ctrlDeleteListing = async (req, res) => {
	let listingId = new ObjectId(req.params.id);
	console.log(listingId);
	const token = await extractToken(req);
	let id_user;
	console.log(token);

	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		if (err) {
			console.log(err.stack);
			res.status(401).json({ err: "Unauthorized" });
			return;
		} else {
			id_user = authData.id_user;
		}
	});

	console.log(id_user);

	let listing = await client
		.db("BRIEF6")
		.collection("listing")
		.find({ _id: listingId });

	if (!listing) {
		res.status(401).json({ error: "Listing doesn't exist" });
		return;
	}

	// if (listing.id_user !== jwt.id_user || role.id_role !== 2) {
	// 	res.status(401).json({ error: "Failed to proceed" });
	// 	return;
	// }

	try {
		await client
			.db("BRIEF6")
			.collection("listing")
			.deleteOne({ _id: listingId });
		res.status(200).json({ Success: "Listing deleted" });
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

//Fonction pour modifier ses publications
const ctrlUpdateListing = async (req, res) => {
	let listingId = new ObjectId(req.params.id);
	console.log(listingId);
	const token = await extractToken(req);
	let id_user;
	console.log(token);

	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		if (err) {
			console.log(err.stack);
			res.status(401).json({ err: "Unauthorized" });
			return;
		} else {
			id_user = authData.id_user;
		}
	});

	console.log(id_user);

	let listing = await client
		.db("BRIEF6")
		.collection("listing")
		.find({ _id: req.params.listingId });

	if (!listing) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	try {
		let result = await client
			.db("BRIEF6")
			.collection("listing")
			.updateOne(
				{ _id: listingId },
				{
					$set: { title: req.body.title, text: req.body.text },
				}
			);
		console.log(result);
		res.status(200).json({ Success: "Listing updated" });
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

const ctrlMyListings = async (req, res) => {
	const token = await extractToken(req);

	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		if (err) {
			console.log(err);
			res.status(401).json({ err: "Unauthorized" });
			return;
		} else {
			let listings = await client
				.db("BRIEF6")
				.collection("listing")
				.find({ id_user: authData.id_user });
			let apiResponse = await listings.toArray();

			res.status(200).json(apiResponse);
		}
	});
};

module.exports = {
	ctrlCreateListing,
	ctrlAllListings,
	ctrlDeleteListing,
	ctrlUpdateListing,
	ctrlMyListings,
};
