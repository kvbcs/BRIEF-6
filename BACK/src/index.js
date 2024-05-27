const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./Services/MongoConnexion");
const userRouter = require("./Controller/Routes/user");
const listingRouter = require("./Controller/Routes/listing");
const commentRouter = require("./Controller/Routes/comment");
const path = require("path");
require("dotenv").config();

const test = path.join(__dirname, "/public");
app.use(express.static(test));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Connexion à MongoDB
connect("mongodb://127.0.0.1:27017/", (error) => {
	if (error) {
		console.log("Failed to connect");
		process.exit(-1);
	} else {
		console.log("Successfully connected !");
	}
});

//Mise en place des routes
app.use("/user", userRouter);
app.use("/listing", listingRouter);
app.use("/comment", commentRouter);

//Activation du serveur sur le port
app.listen(process.env.PORT, () => {
	console.log("Server is running on PORT", process.env.PORT);
});
