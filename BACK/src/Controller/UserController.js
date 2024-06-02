const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { pool } = require("../Services/MySQLConnexion");
var validator = require("validator");
const { transporter } = require("../Services/mailer");
const { extractToken } = require("../Utils/extractToken");
require("dotenv").config();

//Fonction pour s'inscrire -------------------------------------------------------------------------------------------------------------
const ctrlRegister = async (req, res) => {
	//Vérification que tous les champs sont remplis
	if (
		!req.body.name ||
		!req.body.photo ||
		!req.body.email ||
		!req.body.password
	) {
		res.status(400).json({ error: "Missing fields" });
		return;
	}

	//Constantes prenant les données envoyées par l'utilisateur
	const name = req.body.name;
	const photo = req.body.photo;
	const email = req.body.email;
	const password = req.body.password;
	console.log(photo);

	//Requête préparée qui vérifie si l'email n'existe pas déjà
	try {
		const values = [email];
		const sql = `SELECT email FROM user WHERE email = ?`;
		const [result] = await pool.execute(sql, values);
		if (result.length !== 0) {
			res.status(400).json({ Error: "Email already exists" });
			return;

			//Sinon, hashage du mot de passe et email pour le token
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const activationToken = await bcrypt.hash(email, 10);
			const cleanToken = activationToken.replaceAll("/", "");

			//Requête préparée insérant le nouvel utilisateur
			const sqlInsertRequest = `INSERT INTO user VALUES (NULL, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`;
			const insertValues = [
				name,
				photo,
				email,
				hashedPassword,
				false,
				0,
				cleanToken,
			];
			const [rows] = await pool.execute(sqlInsertRequest, insertValues);

			//Envoi d'un email pour activer le compte
			if (rows.affectedRows > 0) {
				const info = await transporter.sendMail({
					from: `${process.env.SMTP_EMAIL}`,
					to: email,
					subject: `Activate your account`,
					html: `<p>Activate your account by clicking on the following link :
					</p><a href="http://localhost:7000/user/activate/${cleanToken}">Verification link</a>`,
				});

				//Message de succès
				console.log("Message sent: %s", info.messageId);
				res.status(200).json({ Success: `Registration successful` });
				console.log(rows);
				return;

				//Message d'erreur si l'inscription échoue
			} else {
				res.status(400).json({ Error: "Registration failed" });
			}
		}

		//Message d'erreur
	} catch (error) {
		console.log(error.stack);
		res.status(500).json({ Error: "Server error" });
		return;
	}
};

//Fonction pour se connecter --------------------------------------------------------------------------------------------------------
const ctrlLogin = async (req, res) => {
	//Vérification que tous les champs sont remplis
	if (!req.body.email || !req.body.password) {
		res.status(400).json({ Error: "Missing Fields" });
		return;
	}

	//Constantes prenant les données envoyées par l'utilisateur
	const email = req.body.email;
	const password = req.body.password;

	//Requête préparée vérifiant l'email et l'activation du compte de l'utilisateur
	try {
		const values = [email];
		const sql = `SELECT * FROM user INNER JOIN role ON user.id_role = role.id_role WHERE email = ? AND isActive = 1`;
		const [rows] = await pool.execute(sql, values);
		console.log(rows);

		//Si résultat négatif, message d'erreur
		if (rows.length === 0) {
			res.status(400).json({ Error: "Invalid email" });
			return;

			//Sinon, comparaison du mot passe hashé avec celui envoyé par l'utilisateur
		} else {
			const isValidPassword = await bcrypt.compare(
				req.body.password,
				rows[0].password
			);
			console.log(isValidPassword);

			//Message d'erreur si le mot de passe ne correspond pas
			if (!isValidPassword) {
				res.status(400).json({ Error: "Invalid password" });
				return;

				//Sinon, création d'un token jwt avec les données de l'utilisateur
			} else {
				const token = jwt.sign(
					{
						id_user: rows[0].id_user,
						name: rows[0].name,
						photo: rows[0].photo,
						email: rows[0].email,
					},
					process.env.SECRET_KEY,
					{
						expiresIn: "1d",
					}
				);

				//Message de succès
				console.log(rows);
				res.status(200).json({ jwt: token, role: rows[0].name_role });
				return;
			}
		}

		//Message d'erreur
	} catch (error) {
		console.log(error.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

//Fonction pour obtenir tous les utilisateurs pour l'admin ----------------------------------------------------------------------------
const ctrlAllUsers = async (req, res) => {
	const token = await extractToken(req);

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
		}
		console.log(id_user);
	});
	//Requête récupérant tous les utilisateurs
	try {
		const values = [id_user];
		const sql = "SELECT * FROM user WHERE id_user = ?";
		const [rows] = await pool.query(sql, values);

		//eEssage de succès
		console.log(rows);
		res.status(200).json(rows);

		//Message d'erreur
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error getting all users" });
	}
};

//Fonction pour supprimer un utilisateur ----------------------------------------------------------------------------------------------
const ctrlDeleteUser = async (req, res) => {
	let id = req.params.id;

	//Requête préparée supprimant l'utilisateur via l'id
	try {
		const values = [id];
		const sql = `DELETE FROM user WHERE id_user = ?`;
		const [rows] = await pool.execute(sql, values);

		//Message de succès
		console.log(rows);
		res.status(200).json({ Success: "Deleted user successful !" });

		//Message d'erreur
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error deleting an user" });
	}
};

//Fonction pour que l'utilisateur modifie son profil --------------------------------------------------------------------------------
const ctrlUpdateUser = async (req, res) => {
	//Requête préparée qui modifie l'utilisateur en utilisant un middleware
	try {
		let data = req.data;
		let values = req.values;
		const sql = `UPDATE user SET ${data} where id_user = ? `;
		const [result] = await pool.execute(sql, values);

		//Message de succès
		res.status(200).json(result);

		//Message d'erreur
	} catch (error) {
		console.log(error.stack);
		res.status(500).json({ Error: "Server Error" });
	}
};

//Exportation des modules ------------------------------------------------------------------------------------------------------------
module.exports = {
	ctrlLogin,
	ctrlRegister,
	ctrlDeleteUser,
	ctrlUpdateUser,
	ctrlAllUsers,
};
