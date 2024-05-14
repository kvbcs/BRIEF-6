const { Listing } = require("../Model/Listing");
const client = require("../Services/MongoConnexion");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { pool } = require("../Services/MySQLConnexion");
const { extractToken } = require("../Utils/extractToken");
require("dotenv").config();

const ctrlCreateListing = async (req, res) => {
	if (!req.body.title || !req.body.text) {
		res.status(400).send("Missing fields");
		return;
	}
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

	try {
		let newListing = new Listing(req.body.title, req.body.text, 0, id_user);
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

const ctrlDeleteListing = async (req, res) => {
	let listingId = new ObjectId(req.body.listingId);

	const id = req.body.id_user;
	try {
		const sql = `SELECT * FROM user WHERE id_user=?`;
		const values = [id];
		const [rows] = await pool.execute(sql, values);
		console.log(rows);
		res.status(200).json(rows);
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error getting user id" });
	}

	let listing = await client
		.db("BRIEF6")
		.collection("listing")
		.find({ _id: listingId });

	if (!listing) {
		res.status(401).json({ error: "no" });
		return;
	}

	// if (listing.userId !== user._id || user.role !== "user") {
	// 	res.status(401).json({ error: "Unauthorized" });
	// 	return;
	// }

	try {
		await client
			.db("BRIEF6")
			.collection("listing")
			.deleteOne({ _id: listingId });
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};
//TODO: marche pas :(

const ctrlUpdateListing = async (req, res) => {
	if (!req.body.title || !req.body.text || !req.body.userId) {
		res.status(400).json({ error: "Missing fields" });
	}

	const id = req.body.id;
	try {
		const sql = `SELECT * FROM users WHERE user_id=?`;
		const values = [id];
		const [rows] = await pool.execute(sql, values);
		console.log(rows);
		res.status(200).json(rows);
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error getting user id" });
	}

	let listing = await client
		.db("BRIEF6")
		.collection("listing")
		.find({ _id: req.params.listingId });

	if (!user || !listing) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	if (listing.userId !== user._id || user.role !== "user") {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	try {
		await client
			.db("BRIEF6")
			.collection("listing")
			.updateOne(
				{ _id: listing._id },
				{
					$set: {
						title: req.body.title,
						text: req.body.text,
					},
				}
			);
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};
//TODO: à tester

module.exports = {
	ctrlCreateListing,
	ctrlAllListings,
	ctrlDeleteListing,
	ctrlUpdateListing,
};
