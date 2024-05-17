const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { pool } = require("../Services/MySQLConnexion");
var validator = require("validator");
const { transporter } = require("../Services/mailer");
require("dotenv").config();

//Fonction pour s'inscrire
const ctrlRegister = async (req, res) => {
	if (
		!req.body.name ||
		!req.body.photo ||
		!req.body.email ||
		!req.body.password
	) {
		res.status(400).json({ error: "Missing fields" });
		return;
	}

	const name = req.body.name;
	const photo = req.body.photo;
	const email = req.body.email;
	const password = req.body.password;
	console.log(photo);

	try {
		const values = [email];
		const sql = `SELECT email FROM user WHERE email = ?`;
		const [result] = await pool.execute(sql, values);
		if (result.length !== 0) {
			res.status(400).json({ Error: "Email already exists" });
			return;
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);

			const activationToken = await bcrypt.hash(email, 10);
			const cleanToken = activationToken.replaceAll("/", "");

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

			if (rows.affectedRows > 0) {
				const info = await transporter.sendMail({
					from: `${process.env.SMTP_EMAIL}`,
					to: email,
					subject: `Activate your account`,
					html: `<p>Activate your account by clicking on the following link :</p><a href="http://localhost:7000/user/activate/${cleanToken}">Verification link</a>`,
				});

				console.log("Message sent: %s", info.messageId);
				res.status(200).json({ Success: `Registration successful` });
				console.log(rows);
				return;
			} else {
				res.status(400).json({ Error: "Registration failed" });
			}
		}
	} catch (error) {
		console.log(error.stack);
		res.status(500).json({ Error: "Server error" });
		return;
	}
};

const activateEmail = async (req, res) => {
	try {
		const token = req.params.token;
		const sql = `SELECT * FROM user WHERE token = ?`;
		const values = [token];
		const [result] = await pool.execute(sql, values);
		if (!result) {
			res.status(204).json({ error: "Not found" });
			return;
		}
		await pool.execute(
			`UPDATE user SET isActive = 1,id_role = 2, token = NULL WHERE token = ?`,
			[token]
		);
		res.redirect("http://127.0.0.1:5500/FRONT/USER/user.html");
	} catch (error) {
		res.status(500).json({ error: "Server error" });
		console.log(error.stack);
	}
};

const resetPassword = async (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const new_password = req.body.new_password;

	if (!name || !email || !new_password) {
		res.status(400).json("Missing fields");
		return;
	}

	// const values = [new_password];
	// const sql = `SELECT password FROM user WHERE password = ?`;
	// const [result] = await pool.execute(sql, values);
	// if (result.length !== 0) {
	// 	res.status(400).json({ Error: "Email already exists" });
	// 	return;
	// }

	try {
		const values = [name, email];
		const sql = `SELECT name, email FROM user WHERE name = ? AND email = ?`;
		const [result] = await pool.execute(sql, values);
		if (result.length === 0) {
			res.status(400).json("User does not exist");
			return;
		} else {
			const hashedPassword = await bcrypt.hash(new_password, 10);

			const activationToken = await bcrypt.hash(email, 10);
			const cleanToken = activationToken.replaceAll("/", "");

			const sqlInsertRequest = `UPDATE user SET password = ?, token = ?, isActive = ? WHERE name = ? AND email = ?`;

			const insertValues = [hashedPassword, cleanToken, 0, name, email];

			const [rows] = await pool.execute(sqlInsertRequest, insertValues);
			const info = await transporter.sendMail({
				from: `${process.env.SMTP_EMAIL}`,
				to: email,
				subject: `Reset your password`,
				html: `<p>Reset your password by clicking on the following link :</p><a href="http://localhost:7000/user/reset/${cleanToken}">Reset link</a>`,
			});

			console.log("Message sent: %s", info.messageId);
			res.status(200).json({ Success: `Reset mail sent` });
			console.log(rows);
			return;
		}
	} catch (error) {
		res.status(500).json({ Error: "Server error" });
		console.log(error.stack);
	}
};

const activateReset = async (req, res) => {
	try {
		const token = req.params.token;
		const sql = `SELECT * FROM user WHERE token = ?`;
		const values = [token];
		const [result] = await pool.execute(sql, values);
		if (!result) {
			res.status(204).json({ error: "Not found" });
			return;
		}
		await pool.execute(
			`UPDATE user SET isActive = ?, token = NULL WHERE token = ?`,
			[1, token]
		);
		res.redirect("http://127.0.0.1:5500/FRONT/AUTH/login.html");
	} catch (error) {
		res.status(500).json({ error: "Server error" });
		console.log(error.stack);
	}
};

//Fonction pour se connecter
const ctrlLogin = async (req, res) => {
	if (!req.body.email || !req.body.password) {
		res.status(400).json({ Error: "Missing Fields" });
		return;
	}
	const email = req.body.email;
	const password = req.body.password;

	try {
		const values = [email];
		const sql = `SELECT * FROM user INNER JOIN role ON user.id_role = role.id_role WHERE email = ? AND isActive = 1`;
		const [rows] = await pool.execute(sql, values);

		console.log(rows);

		if (rows.length === 0) {
			res.status(400).json({ Error: "Invalid email" });
			return;
		} else {
			const isValidPassword = await bcrypt.compare(
				req.body.password,
				rows[0].password
			);
			console.log(isValidPassword);
			if (!isValidPassword) {
				res.status(400).json({ Error: "Invalid password" });
				return;
			} else {
				const token = jwt.sign(
					{
						id_user: rows[0].id_user,
						email: rows[0].email,
					},
					process.env.SECRET_KEY,
					{
						expiresIn: "1d",
					}
				);
				console.log(rows);
				res.status(200).json({ jwt: token, role: rows[0].name_role });
				return;
			}
		}
	} catch (error) {
		console.log(error.stack);
		res.status(500).json({ Error: "Server error" });
	}
};

//Fonction pour obtenier tous les utilisateurs pour l'admin
const ctrlAllUsers = async (req, res) => {
	try {
		const sql = "SELECT id_user, name FROM user";
		const [rows] = await pool.query(sql);
		console.log(rows);
		res.status(200).json(rows);
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error getting all users" });
	}
};

//Fonction pour supprimer un utilisateur
const ctrlDeleteUser = async (req, res) => {
	let id = req.params.id;

	try {
		const values = [id];
		const sql = `DELETE FROM user WHERE id_user = ?`;
		const [rows] = await pool.execute(sql, values);

		console.log(rows);
		res.status(200).json({ Success: "Deleted user successful !" });
	} catch (error) {
		console.log(error.stack);
		res.status(400).json({ Error: "Error deleting an user" });
	}
};

//Fonction pour modifier ses informations
const ctrlUpdateUser = async (req, res) => {
	try {
		let data = req.data;
		let values = req.values;
		const sql = `UPDATE user SET ${data} where id_user = ? `;
		const [result] = await pool.execute(sql, values);
		res.status(200).json(result);
	} catch (error) {
		console.log(error.stack);
		res.status(500).json({ Error: "Server Error" });
	}
};

const testEmail = async (req, res) => {
	const info = await transporter.sendMail({
		from: `${process.env.SMTP_EMAIL}`,
		to: `kyllianvibancos2@gmail.com`,
		subject: `Hello`,
		html: `<p>Hello</p>`,
	});
	console.log("Message sent: %s", info.messageId);
	res.status(200).json(`Message send with the id ${info.messageId}`);
};

module.exports = {
	ctrlLogin,
	ctrlRegister,
	ctrlDeleteUser,
	ctrlUpdateUser,
	ctrlAllUsers,
	testEmail,
	activateEmail,
	resetPassword,
	activateReset,
};
