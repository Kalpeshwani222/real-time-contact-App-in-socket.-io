import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import axios from "axios";

const socket = io.connect("http://localhost:5000");
const userName = nanoid(4);

const App = () => {
  

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // const [socketConnected, setSocketConnected] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get("/api/messages");

      setMessages(data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const config = {
        Headers: {
          "Content-type": "applications/json",
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        `/api/messages/send`,
        {
          newMessage,
        },
        config
      );

      socket.emit("chat", data,userName);

      setMessages([...messages, data]);
    } catch (error) {
      console.log(error.response.data.message);
      // setError(error.response.data.message);
    }
  };

  useEffect(() => {

    socket.on("chat", (payload,name) => {


      if(userName != name){
        setMessages([...messages, payload]);
     
      } 
     
      
      
      // console.log(payload);
    });
  });

  return (
    <>
      <div className="main-div">
        <div className="chat">
          {messages.map((payload, index) => {
            return (
              <>
                <p key={index}>
                  <span className="">{userName}</span> {payload.message}{" "}
                </p>
              </>
            );
          })}
        </div>

        <form onSubmit={sendMessage}>
          <input
            type=""
            name="chat"
            placeholder="send text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default App;
