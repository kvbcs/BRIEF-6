const mysql = require("mysql2/promise");
require("dotenv").config();

//Fonction de connexion à MySQL
const pool = mysql.createPool({
	host: "localhost",
	user: process.env.MYSQL_USER,
	database: process.env.MYSQL_DATABASE,
	password: process.env.MYSQL_PASSWORD,
	waitForConnections: true,
	multipleStatements: true,
});

//Exportation des modules
module.exports = { pool };
