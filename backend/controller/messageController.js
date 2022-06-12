const Message = require("../model/messageModel");

//get
const getMessages = async (req, res) => {
  const messages = await Message.find({});
  res.json(messages);
};

//send message
const sendMesssage = async (req, res) => {
  const { newMessage, mobile } = req.body;

  if (!newMessage) {
    return res.status(401).json({ message: "message are required" });
  }

  if (!mobile) {
    return res.status(401).json({ message: "mobile no are required" });
  }

  try {
    const message = await new Message({
      message: newMessage,
      mobile: mobile,
    }).save();

    res.status(201).json(message);
  } catch (error) {
    //res.status(500).send({ message: "Error" });
    // res.send(error)
    console.log(error);
  }
};

//delete the contact

const deleteContact = async (req, res) => {

  const contact = await Message.findById(req.params.id);
  
  try {
    const deleteContact = await contact.remove();
    res.status(200).send({ message: "Deleted Successfully",deleteContact });
  } catch (error) {
    res.status(500).send({ message: "Error" });
  }
};

module.exports = { getMessages, sendMesssage, deleteContact };
