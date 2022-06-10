const express = require("express");
const router = express.Router();
const { getMessages,sendMesssage} = require("../controller/messageController");

router.route('/').get(getMessages);

router.route('/send').post(sendMesssage);


module.exports = router;