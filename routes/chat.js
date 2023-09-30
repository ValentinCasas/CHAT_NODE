var express = require('express');
var router = express.Router();
const chatController = require("../controllers/chat");
var isAutenticated = require("../routes/auth").isAutenticated;

router.get("/", chatController.chatView);

module.exports = router;