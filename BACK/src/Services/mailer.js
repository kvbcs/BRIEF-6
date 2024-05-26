const nodemailer = require("nodemailer");
require("dotenv").config();

//Fonction d'emailing
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: 26,
	secure: false,
	auth: {
		user: process.env.SMTP_EMAIL,
		pass: process.env.SMTP_PASSWORD,
	},
});

//Exportation des modules
module.exports = { transporter };
