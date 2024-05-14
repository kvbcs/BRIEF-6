const express = require("express");
const {
	ctrlRegister,
	ctrlLogin,
	ctrlDeleteUser,
	ctrlUpdateUser,
	ctrlAllUsers,
} = require("../UserController");
const { verifUpdate } = require("../../Middlewares/middlewares");
// const { verifyUser } = require("../../Middlewares/middlewares");

const userRouter = express.Router();

userRouter.get("/all", ctrlAllUsers);
// userRouter.get("/:id", ctrlOneUser);
userRouter.post("/register", ctrlRegister);
userRouter.post("/login", ctrlLogin);
userRouter.delete("/delete/:id", ctrlDeleteUser);
userRouter.patch("/update/:id", verifUpdate, ctrlUpdateUser);

module.exports = userRouter;
