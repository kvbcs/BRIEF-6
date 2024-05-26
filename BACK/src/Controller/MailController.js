const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { pool } = require("../Services/MySQLConnexion");
var validator = require("validator");
const { transporter } = require("../Services/mailer");
require("dotenv").config();

//Fonction d'activation du compte par email -----------------------------------------------------------------------------------------
const activateEmail = async (req, res) => {
	const token = req.params.token;

	//Requête préparée qui compare les tokens d'email
	try {
		const sql = `SELECT * FROM user WHERE token = ?`;
		const values = [token];
		const [result] = await pool.execute(sql, values);

		//Message d'erreur si il n'y a pas de token
		if (!result) {
			res.status(204).json({ error: "Not found" });
			return;

			//Sinon, activation du compte, ajout du role "user" et suppression du token d'email
		} else {
			await pool.execute(
				`UPDATE user SET isActive = ?, id_role = ?, token = NULL WHERE token = ?`,
				[1, 2, token]
			);

			//Redirection sur la page de connexion
			res.redirect("http://127.0.0.1:5500/FRONT/AUTH/login.html");
		}

		//Message d'erreur
	} catch (error) {
		res.status(500).json({ error: "Server error" });
		console.log(error.stack);
	}
};

//Fonction de modification du mot de passe -------------------------------------------------------------------------------------------
const resetPassword = async (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const new_password = req.body.new_password;

	//Vérification que tous les champs sont remplis
	if (!name || !email || !new_password) {
		res.status(400).json("Missing fields");
		return;
	}

	//Requête préparée pour vérifier que l'utilisateur existe
	try {
		const values = [name, email];
		const sql = `SELECT name, email FROM user WHERE name = ? AND email = ?`;
		const [result] = await pool.execute(sql, values);

		//Si l'email ou le nom n'est pas trouvé, message d'erreur
		if (result.length === 0) {
			res.status(400).json("User does not exist");
			return;

			//Si l'utilisateur existe, hashage du nouveau mot de passe et email
		} else {
			const hashedPassword = await bcrypt.hash(new_password, 10);
			const activationToken = await bcrypt.hash(email, 10);
			const cleanToken = activationToken.replaceAll("/", "");

			//Requête préparée qui insère le nouveau mot de passe, un token et désactive le compte
			const sqlInsertRequest = `UPDATE user SET password = ?, token = ?, isActive = ? WHERE name = ? AND email = ?`;
			const insertValues = [hashedPassword, cleanToken, 0, name, email];
			const [rows] = await pool.execute(sqlInsertRequest, insertValues);

			//Envoi d'un email pour réactiver le compte avec le nouveau mot de passe
			const info = await transporter.sendMail({
				from: `${process.env.SMTP_EMAIL}`,
				to: email,
				subject: `Reset your password`,
				html: `<p>Reset your password by clicking on the following link :</p>
                <a href="http://localhost:7000/user/reset/${cleanToken}">Reset link</a>`,
			});

			//Message de succès
			console.log("Message sent: %s", info.messageId);
			res.status(200).json({ Success: `Reset mail sent` });
			console.log(rows);
			return;
		}

		//Message d'erreur
	} catch (error) {
		res.status(500).json({ Error: "Server error" });
		console.log(error.stack);
	}
};

//Fonction d'activation de compte suite au changement de mot de passe ----------------------------------------------------------------
const activateReset = async (req, res) => {
	const token = req.params.token;

	//Requête préparée qui compare les tokens
	try {
		const sql = `SELECT * FROM user WHERE token = ?`;
		const values = [token];
		const [result] = await pool.execute(sql, values);

		//Si négatif, message d'erreur
		if (!result) {
			res.status(204).json({ error: "Not found" });
			return;

			//Sinon, réactivation du compte et suppression du token
		} else {
			await pool.execute(
				`UPDATE user SET isActive = ?, token = NULL WHERE token = ?`,
				[1, token]
			);

			//Redirection à la page de connexion
			res.redirect("http://127.0.0.1:5500/FRONT/AUTH/login.html");
		}

		//Message d'erreur
	} catch (error) {
		res.status(500).json({ error: "Server error" });
		console.log(error.stack);
	}
};

//Exportation des modules ------------------------------------------------------------------------------------------------------------
module.exports = {
	activateEmail,
	resetPassword,
	activateReset,
};
