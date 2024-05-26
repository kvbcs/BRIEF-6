const { Listing } = require("../Model/Listing");
const client = require("../Services/MongoConnexion");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { pool } = require("../Services/MySQLConnexion");
const { extractToken } = require("../Utils/extractToken");
const { Comment } = require("../Model/Comment");
require("dotenv").config();

//Fonction pour créer un commentaire --------------------------------------------------------------------------------------------
const ctrlCreateComment = async (req, res) => {
	//Vérification que le champ est rempli
	if (!req.body.message) {
		res.status(400).send("Missing field");
		return;
	}

	const token = await extractToken(req);
	console.log(token);

	let id_user;
	let photo;
	let name;

	//Vérification du jwt
	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		//Si négatif, message d'erreur
		if (err) {
			console.log(err.stack);
			res.status(401).json({ err: "Unauthorized" });
			return;

			//Sinon, on autorise l'user
		} else {
			id_user = authData.id_user;
			photo = authData.photo;
			name = authData.name;
		}
		console.log(id_user, photo, name);
	});

	let id_listing = req.params.id;

	//Création du commentaire
	try {
		let newComment = new Comment(
			req.body.message,
			id_listing,
			id_user,
			photo,
			name
		);

		//Insertion du commentaire dans la DB
		let result = await client
			.db("BRIEF6")
			.collection("comment")
			.insertOne(newComment);

		//MEssage de succès
		res.status(200).json(result);

		//Message d'erreur
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error creating comment" });
	}
};

//Fonction pour voir tous les commentaires -------------------------------------------------------------------------------------------
const ctrlAllComments = async (req, res) => {
	//Requête pour trouver tous les commentaires
	try {
		let apiCall = client.db("BRIEF6").collection("comment").find();
		let comments = await apiCall.toArray();

		//Message de succès
		res.status(200).json(comments);

		//Message d'erreur
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error getting all comments" });
	}
};

//Fonction pour supprimer ses commentaires --------------------------------------------------------------------------------------------
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

//Fonction pour modifier ses commentaires -------------------------------------------------------------------------------------------
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

//Exportation des modules ------------------------------------------------------------------------------------------------------------
module.exports = {
	ctrlCreateComment,
	ctrlAllComments,
	ctrlDeleteComment,
	ctrlUpdateComment,
};
