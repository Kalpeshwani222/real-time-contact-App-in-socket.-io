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
    res.status(200).send({ message: "Deleted Successfully", deleteContact });
  } catch (error) {
    res.status(500).send({ message: "Error" });
  }
};

//get single data
const getSingleContact = async (req, res) => {
  try {
    const id = req.params.id;

    const indvuser = await Message.findById(id);

    return res.status(200).json(indvuser);
  } catch (e) {
    return res.status(401).json({ message: "Not found" });
  }
};

//update the contact

const updateContact = async (req, res) => {
  const { upname, upmobile } = req.body;


  if (!req.params.id) {
    return res.status(403).json({ message: "Not true" });
  }

  try {
  

    const updatedData = await Message.findByIdAndUpdate(
      { _id: req.params.id }, {
        $set: { message: upname, mobile: upmobile },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ updatedData });
  } catch (error) {
    return res.status(401).json({ error });
  }
};
module.exports = {
  getMessages,
  sendMesssage,
  deleteContact,
  updateContact,
  getSingleContact,
};
