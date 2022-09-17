const express = require("express");
const app = express();
const connectDb = require("./config/db");
const cors = require("cors");
const messageRoutes = require("./routes/MessagesRoute");

//for cors policy
app.use(cors());

//database
connectDb();

app.use(express.json());

app.use("/api/messages", messageRoutes);

// const server = require('http').createServer(app);

// const io = require('socket.io')(server,{
//     cors:{
//         origin:"*",
//     },
// });

// io.on("connection",(socket) =>{
//     console.log("what is socket:", socket);

//     console.log("socket is active to be connected");

//     socket.on("chat", (payload)=>{
//         console.log("what is payload:", payload);

//         //respond to event
//         io.emit("chat",payload)

//     })
// })

// app.listen(5000,()=>{
//     console.log("server is running");
// })

const server = app.listen(5000, () => {
  console.log("server is listing on 5000");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // console.log("connected to socket.io");

  socket.on("chat", (payload, userName) => {
    // console.log(payload.message + payload.mobile);
    // console.log(userName);
    //send back to the frontend
    io.emit("chat", payload, userName);
  });

  //delete
  socket.on("delete", (payload) => {
    //send back to the frontend
    io.emit("delete", payload);
  });

  
  // update
  socket.on("update", (payload) => {
    // console.log(payload);
    io.emit("update", payload);
  });
});
