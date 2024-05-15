const express = require("express");
const {
	ctrlCreateComment,
	ctrlAllComments,
	ctrlDeleteComment,
	ctrlUpdateComment,
} = require("../CommentController");

const commentRouter = express.Router();

commentRouter.post("/create/:id", ctrlCreateComment);
commentRouter.get("/all", ctrlAllComments);
commentRouter.delete("/delete/:id", ctrlDeleteComment);
commentRouter.patch("/update/:id", ctrlUpdateComment);

module.exports = commentRouter;
