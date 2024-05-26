const { Listing } = require("../Model/Listing");
const client = require("../Services/MongoConnexion");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { pool } = require("../Services/MySQLConnexion");
const { extractToken } = require("../Utils/extractToken");
require("dotenv").config();

//Fonction pour créer une publication ------------------------------------------------------------------------------------------------
const ctrlCreateListing = async (req, res) => {
	//Vérification que les champs sont remplis

	if (!req.body.title || !req.body.text) {
		res.status(400).send("Missing fields");
		return;
	}

	//Variables pour le jwt
	const token = await extractToken(req);
	let id_user;
	let name;
	let photo;
	console.log(token);

	//Vérification que le jwt existe
	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		//Si négatif, message d'erreur
		if (err) {
			console.log(err.stack);
			res.status(401).json({ err: "Unauthorized" });
			return;

			//Sinon, récupération des données
		} else {
			id_user = authData.id_user;
			name = authData.name;
			photo = authData.photo;
		}
		console.log(id_user, name, photo);
	});

	//Création d'une nouvelle listing
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

		//Insertion dans la base de données
		let result = await client
			.db("BRIEF6")
			.collection("listing")
			.insertOne(newListing);

		//Message de succès
		res.status(200).json(result);

		//Message d'erreur
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error creating listing" });
	}
};

//Fonction pour voir toutes les publications -----------------------------------------------------------------------------------------
const ctrlAllListings = async (req, res) => {
	//Requête pour trouver les listings

	try {
		let apiCall = client.db("BRIEF6").collection("listing").find();

		//Les listings sont mis dans un tableau
		let listings = await apiCall.toArray();

		//Message de succès
		res.status(200).json(listings);

		//Message d'erreur
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error getting all listings" });
	}
};

//Fonction pour supprimer ses publications --------------------------------------------------------------------------------------------
const ctrlDeleteListing = async (req, res) => {
	//Récupération de l'id

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
		console.log(id_user);
	});

	//Recherche de la listing correspondante dans la DB
	let listing = await client
		.db("BRIEF6")
		.collection("listing")
		.find({ _id: listingId });

	//Si négatif, message d'erreur
	if (!listing) {
		res.status(401).json({ error: "Listing doesn't exist" });
		return;
	}

	//Suppression de la listing
	try {
		await client
			.db("BRIEF6")
			.collection("listing")
			.deleteOne({ _id: listingId });

		//Message de succès
		res.status(200).json({ Success: "Listing deleted" });

		//Message d'erreur
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

//Fonction pour modifier ses publications ---------------------------------------------------------------------------------------------
const ctrlUpdateListing = async (req, res) => {
	//Récupération de l'id

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
		console.log(id_user);
	});

	//Recherche de la listing correspondante dans la DB
	let listing = await client
		.db("BRIEF6")
		.collection("listing")
		.find({ _id: req.params.listingId });

	//Si négatif, message d'erreur
	if (!listing) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	//Requete pour modifier le listing
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

		//Message de succès
		console.log(result);
		res.status(200).json({ Success: "Listing updated" });

		//MEssage d'erreur
	} catch (e) {
		console.log(e.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

//Fonction pour voir ses publications --------------------------------------------------------------------------------------------------
const ctrlMyListings = async (req, res) => {
	const token = await extractToken(req);

	//Vérification du jwt
	jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
		//Si négatif, message d'erreur

		if (err) {
			console.log(err);
			res.status(401).json({ err: "Unauthorized" });
			return;
		}

		//Sinon, recherche de l'id user dans la DB
		try {
			let listings = await client
				.db("BRIEF6")
				.collection("listing")
				.find({ id_user: authData.id_user });

			//Mise en place des listings en tableau
			let apiResponse = await listings.toArray();
			res.status(200).json(apiResponse);

			//Message d'erreur
		} catch (error) {
			console.log(error.stack);
			res.status(500).json({ Error: "Server error" });
		}
	});
};

//Exportation des modules -------------------------------------------------------------------------------------------------------------
module.exports = {
	ctrlCreateListing,
	ctrlAllListings,
	ctrlDeleteListing,
	ctrlUpdateListing,
	ctrlMyListings,
};
