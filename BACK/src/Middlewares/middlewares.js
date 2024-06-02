var validator = require("validator");

//Fonction qui vérifie la conformité des données d'inscription
const verifData = async (req, res, next) => {
	//Récupération des données envoyées par les utilisateurs
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	//Vérification que le nom ne contient que des lettres
	if (!validator.isAlphanumeric(name)) {
		return res.json({ message: "Name must contain letters and numbers" });
	}

	//Vérification que l'email soit conforme
	if (!validator.isEmail(email)) {
		return res.json({ message: "Invalid email" });
	}

	//Vérification que le mot de passe soit fort
	if (!validator.isStrongPassword(password)) {
		return res.json({ message: "Weak password" });
	}

	req.name = name;
	req.email = email;
	req.password = password;

	next();
};

//Fonction qui vérifie si l'utilisateur a modifié son profil
const verifUpdateUser = async (req, res, next) => {
	const id = req.params.id;
	const { name, photo, email, password } = req.body;
	let data = [];
	let values = [];
	if (name) {
		data.push("name= ?");
		values.push(name);
	}
	if (photo) {
		data.push("photo= ?");
		values.push(photo);
	}
	if (email) {
		data.push("email= ?");
		values.push(email);
	}
	if (password) {
		data.push("password= ?");
		values.push(password);
	}
	console.log(values);
	if (data.length == 0) {
		return res.json({ message: "No modification done" });
	}
	values.push(id);
	data = data.join(",");
	req.data = data;
	req.values = values;
	next();
};

//Fonction qui vérifie si l'utilisateur a modifié son post
const verifUpdateListing = async (req, res, next) => {
	const id = req.params.id;
	const { title, text } = req.body;
	let data = [];
	let values = [];
	if (title) {
		data.push("title= ?");
		values.push(title);
	}
	if (text) {
		data.push("text= ?");
		values.push(text);
	}
	console.log(values);
	if (data.length == 0) {
		return res.json({ message: "No modification done" });
	}
	values.push(id);
	data = data.join(",");
	req.data = data;
	req.values = values;
	next();
};

//Exportation des modules
module.exports = { verifData, verifUpdateUser, verifUpdateListing };
