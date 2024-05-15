const express = require("express");
const { insertPhoto } = require("../MulterController");

const photoRouter = express.Router();

photoRouter.post("/photo", insertPhoto);

module.exports = photoRouter;
