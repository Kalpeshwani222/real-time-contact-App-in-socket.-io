const express = require("express");
const router = express.Router();
const { getMessages,sendMesssage, deleteContact} = require("../controller/messageController");

router.route('/').get(getMessages);

router.route('/send').post(sendMesssage);

router.route('/:id').delete(deleteContact);


module.exports = router;