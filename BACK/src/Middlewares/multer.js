const multer = require("multer");
const path = require("path");

//Constante de destination du dossier qui recevra les photos
const uploadDirectory = path.join(__dirname, "../public/Uploads");
//Fonction pour insérer une image
const insertPhoto = async (req, res) => {
	console.log(req.body);

	//Variable contenant nom des images
	let newFileName;

	//Variable storage appelant la fonction diskStorage
	let storage = multer.diskStorage({
		//Paramètre de destination où on appelle la constante uploadDirectory
		destination: function (req, file, cb) {
			cb(null, uploadDirectory);
		},

		//Paramètre nom de fichier avec la date et heure actuelle
		filename: function (req, file, cb) {
			newFileName = `${file.fieldname}-${Date.now()}.jpg`;
			cb(null, newFileName);
		},
	});

	//Constante de taille max des fichiers, en octets
	const maxSize = 3 * 1000 * 1000;

	//Variable upload qui utilise la fonction multer
	let upload = multer({
		//Var storage qui définit le dossier source et nom du fichier
		storage: storage,

		//Taille limite en utilisant la constante maxSize
		limits: { fileSize: maxSize },

		//Fonction qui définit les formats acceptés
		fileFilter: function (req, file, cb) {
			//Var des formats acceptés
			var filetypes = /jpeg|jpg|png/;

			//Comparaison avec le format uploadé (appelle du paramètre file)
			var mimetype = filetypes.test(file.mimetype);

			var extname = filetypes.test(
				path.extname(file.originalname).toLowerCase()
			);

			if (mimetype && extname) {
				return cb(null, true);
			}

			//Message d'erreur si le type de fichier n'est pas bon
			cb(
				"Error: File upload only supports the " +
					"following filetypes - " +
					filetypes
			);
		},

		//Nom qu'on va rechercher dans la requête http
	}).single("photo");

	//Fonction qui envoie une erreur si erreur, ou envoi le nom du fichier en http si fonctionne
	upload(req, res, function (err) {
		if (err) {
			//Envoie erreur
			res.send(err);
		} else {
			//Envoi nom du fichier
			res.send({ newFileName: newFileName });
		}
	});
};

//Exportation des modules
module.exports = { insertPhoto };
