const mongoose = require('mongoose');


const messageSchema = mongoose.Schema(
    {
        message:{
            type:String,
            // required:true,
        },
    },
    {
        timestamps:true,
    }
);

 const Message = mongoose.model("messages",messageSchema);

 module.exports = Message;

 