const { MongoClient, Db } = require("mongodb");

var client = null;

//Fonction de connexion à MongoDB
function connect(url, callback) {
	if (client === null) {
		client = new MongoClient(url);
		client.connect((error) => {
			if (error) {
				client = null;
				callback(error);
			} else {
				callback();
			}
		});
	} else {
		callback();
	}
}

//Fonction de création de base de données
function db(dbName) {
	return new Db(client, dbName);
}

//Fonction de fermeture de connexion
function closeConnect() {
	if (client) {
		client.close();
		client = null;
	}
}

//Exportation des modules
module.exports = { connect, db, closeConnect };
