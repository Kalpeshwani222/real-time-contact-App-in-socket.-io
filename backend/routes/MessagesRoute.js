const express = require("express");
const router = express.Router();
const { getMessages,sendMesssage, deleteContact, updateContact, getSingleContact} = require("../controller/messageController");

router.route('/').get(getMessages);

router.route('/send').post(sendMesssage);

router.route('/:id').delete(deleteContact);

router.route('/:id').get(getSingleContact);


router.route('/:id').put(updateContact);



module.exports = router;