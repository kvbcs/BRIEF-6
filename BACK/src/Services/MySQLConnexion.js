const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
	host: "localhost",
	user: process.env.MYSQL_USER,
	database: process.env.MYSQL_DATABASE,
	password: "",
	waitForConnections: true,
	multipleStatements: true,
});

module.exports = { pool };
