const express = require("express");
const {
	ctrlRegister,
	ctrlLogin,
	ctrlDeleteUser,
	ctrlUpdateUser,
	ctrlAllUsers,
} = require("../UserController");
const { verifUpdateUser, verifData } = require("../../Middlewares/middlewares");
const { insertPhoto } = require("../../Middlewares/multer");
const {
	activateEmail,
	resetPassword,
	activateReset,
} = require("../MailController");

//Initialisation du router
const userRouter = express.Router();

//Instanciation des routes du CRUD pour user
userRouter.post("/register", ctrlRegister);
userRouter.post("/login", ctrlLogin);
userRouter.get("/all", ctrlAllUsers);
userRouter.delete("/delete/:id", ctrlDeleteUser);
userRouter.patch("/update/:id", verifUpdateUser, ctrlUpdateUser);

//Instanciation de la route pour le multer
userRouter.post("/photo", insertPhoto);

//Instanciation des routes pour l'emailing
userRouter.get("/activate/:token", activateEmail);
userRouter.post("/reset", resetPassword);
userRouter.get("/reset/:token", activateReset);

//Exportation du router
module.exports = userRouter;
