const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/socket-io", {
            useUnifiedTopology:true,
            useNewUrlParser:true,
            
        });
        console.log(`mongodb  connected ${conn.connection.host} `)
    } catch (error) {
        console.error(`Error : ${error.message}`);
        process.exit();
    }
};
module.exports = connectDB;

