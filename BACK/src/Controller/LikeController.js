const { Listing } = require("../Model/Listing");
const client = require("../Services/MongoConnexion");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { pool } = require("../Services/MySQLConnexion");
const { extractToken } = require("../Utils/extractToken");
require("dotenv").config();

//Fonction pour "liker" ----------------------------------------------------------------------------------------------------------------
const ctrlLike = async (req, res) => {
	//Récupération de l'id du listing cliqué
	let listingId = new ObjectId(req.params.id);
	console.log(listingId);

	const token = await extractToken(req);
	let id_user;
	console.log(token);

	//Vérification du jwt
	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		//Si négatif, message d'erreur
		if (err) {
			console.log(err.stack);
			res.status(401).json({ err: "Unauthorized" });
			return;

			//Sinon, récupération de l'id user
		} else {
			id_user = authData.id_user;
		}
	});

	console.log(id_user);

	//Récupération du listing dans la DB avec l'id correspondant
	let listing = await client
		.db("BRIEF6")
		.collection("listing")
		.find({ _id: req.params.listingId });

	//Si négatif, message d'erreur
	if (!listing) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	//Requête pour incrémenter le compteur de likes
	try {
		let result = await client
			.db("BRIEF6")
			.collection("listing")
			.updateOne(
				{ _id: listingId },
				{
					$inc: { like_number: +1 },
				}
			);

		//Message d'erreur si rien n'a été modifié
		if (result.modifiedCount === 0) {
			res.status(400).json({ Error: "Like not updated" });

			//Sinon, message de succès
		} else {
			console.log(result);
			res.status(200).json({ Success: "Like updated" });
		}

		//Message d'erreur
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

//Fonction pour "disliker" ----------------------------------------------------------------------------------------------------------------
const ctrlDislike = async (req, res) => {
	//Récupération de l'id du listing cliqué
	let listingId = new ObjectId(req.params.id);
	console.log(listingId);

	//Variables
	const token = await extractToken(req);
	let id_user;
	console.log(token);

	//Vérification du jwt
	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		//Si négatif, message d'erreur
		if (err) {
			console.log(err.stack);
			res.status(401).json({ err: "Unauthorized" });
			return;

			//Sinon, récupération, de l'id user
		} else {
			id_user = authData.id_user;
		}
	});

	console.log(id_user);

	//Récupération du listing dans la DB avec l'id correspondant
	let listing = await client
		.db("BRIEF6")
		.collection("listing")
		.find({ _id: req.params.listingId });

	//Si négatif, message d'erreur
	if (!listing) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	//Requête pour incrémenter le compteur de dislikes
	try {
		let result = await client
			.db("BRIEF6")
			.collection("listing")
			.updateOne(
				{ _id: listingId },
				{
					$inc: { dislike_number: +1 },
				}
			);

		//Message d'erreur si rien n'a été modifié
		if (result.modifiedCount === 0) {
			res.status(400).json({ Error: "Dislike not updated" });

			//Sinon, message de succès
		} else {
			console.log(result);
			res.status(200).json({ Success: "Dislike updated" });
		}

		//Message d'erreur
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

//Exportation des modules -------------------------------------------------------------------------------------------------------------
module.exports = {
	ctrlDislike,
	ctrlLike,
};
