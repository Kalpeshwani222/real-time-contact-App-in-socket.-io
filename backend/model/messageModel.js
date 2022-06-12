const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        message:{
            type:String,
            // required:true,
        },
        mobile:{
            type:Number,

        }
    },
    {
        timestamps:true,
    }
);

 const Message = mongoose.model("messages",messageSchema);

 module.exports = Message;

 