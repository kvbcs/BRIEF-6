const express = require("express");
const {
	ctrlCreateComment,
	ctrlAllComments,
	ctrlDeleteComment,
	ctrlUpdateComment,
} = require("../CommentController");

//Initialisation du router
const commentRouter = express.Router();

//Instanciation des routes du CRUD pour les commentaires
commentRouter.post("/create/:id", ctrlCreateComment);
commentRouter.get("/all", ctrlAllComments);
commentRouter.delete("/delete/:id", ctrlDeleteComment);
commentRouter.patch("/update/:id", ctrlUpdateComment);

//Exportation du router
module.exports = commentRouter;
