const { Listing } = require("../Model/Listing");
const client = require("../Services/MongoConnexion");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { pool } = require("../Services/MySQLConnexion");
const { extractToken } = require("../Utils/extractToken");
const { Comment } = require("../Model/Comment");
require("dotenv").config();

//Fonction pour créer une publication
const ctrlCreateComment = async (req, res) => {
	if (!req.body.message) {
		res.status(400).send("Missing field");
		return;
	}
	const token = await extractToken(req);
	let id_user;
	let photo;
	let name;
	console.log(token);

	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		if (err) {
			console.log(err.stack);
			res.status(401).json({ err: "Unauthorized" });
			return;
		} else {
			id_user = authData.id_user;
			photo = authData.photo;
			name = authData.name;
		}
	});

	console.log(id_user, photo, name);
	let id_listing = req.params.id;
	try {
		let newComment = new Comment(
			req.body.message,
			id_listing,
			id_user,
			photo,
			name
		);
		let result = await client
			.db("BRIEF6")
			.collection("comment")
			.insertOne(newComment);
		res.status(200).json(result);
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error creating comment" });
	}
};

//Fonction pour voir tous les commentaires
const ctrlAllComments = async (req, res) => {
	try {
		let apiCall = client.db("BRIEF6").collection("comment").find();

		let comments = await apiCall.toArray();

		res.status(200).json(comments);
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error getting all comments" });
	}
};

//Fonction pour supprimer ses publications
const ctrlDeleteComment = async (req, res) => {
	let commentId = new ObjectId(req.params.id);
	console.log(commentId);
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

	let comment = await client
		.db("BRIEF6")
		.collection("comment")
		.find({ _id: commentId });

	if (!comment) {
		res.status(401).json({ error: "Comment doesn't exist" });
		return;
	}

	try {
		await client
			.db("BRIEF6")
			.collection("comment")
			.deleteOne({ _id: commentId });
		res.status(200).json({ Success: "Comment deleted" });
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

//Fonction pour modifier ses publications
const ctrlUpdateComment = async (req, res) => {
	let commentId = new ObjectId(req.params.id);
	console.log(commentId);
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

	let comment = await client
		.db("BRIEF6")
		.collection("comment")
		.find({ _id: req.params.commentId });

	if (!comment) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	try {
		let result = await client
			.db("BRIEF6")
			.collection("comment")
			.updateOne(
				{ _id: commentId },
				{
					$set: { message: req.body.message },
				}
			);
		console.log(result);
		res.status(200).json({ Success: "comment updated" });
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

module.exports = {
	ctrlCreateComment,
	ctrlAllComments,
	ctrlDeleteComment,
	ctrlUpdateComment,
};
