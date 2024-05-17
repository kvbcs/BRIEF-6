const express = require("express");
const {
	ctrlRegister,
	ctrlLogin,
	ctrlDeleteUser,
	ctrlUpdateUser,
	ctrlAllUsers,
	activateEmail,
	activateReset,
	resetPassword,
} = require("../UserController");
const { verifUpdateUser, verifData } = require("../../Middlewares/middlewares");
const { insertPhoto } = require("../../Middlewares/multer");

const userRouter = express.Router();

userRouter.get("/all", ctrlAllUsers);
userRouter.post("/register", ctrlRegister);
userRouter.post("/photo", insertPhoto);
userRouter.post("/login", ctrlLogin);
userRouter.get("/activate/:token", activateEmail);
userRouter.post("/reset", resetPassword);
userRouter.get("/reset/:token", activateReset);
userRouter.delete("/delete/:id", ctrlDeleteUser);
userRouter.patch("/update/:id", verifUpdateUser, ctrlUpdateUser);

module.exports = userRouter;
