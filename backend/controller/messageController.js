const Message = require("../model/messageModel");

//get
const getMessages = async (req, res) => {
 const messages = await Message.find({});
 res.json(messages);
};




//send message
const sendMesssage = async (req, res) => {
  const { newMessage } = req.body;

  if (!newMessage) {
    return res.status(401).json({ message: "message are required" });
  }

  try {
    const message = await new Message({
      message: req.body.newMessage,
    }).save();

    // const createdmess = await Message.save();

    res.status(201).json(message);
  } catch (error) {
    //res.status(500).send({ message: "Error" });
    // res.send(error)
    console.log(error);
  }
};

module.exports = { getMessages, sendMesssage };
