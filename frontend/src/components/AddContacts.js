import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import axios from "axios";

const socket = io.connect("http://localhost:5000");
const userName = nanoid(4);

const AddContacts = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

      socket.emit("chat", data, userName);

      setMessages([...messages, data]);
    } catch (error) {
      console.log(error.response.data.message);
      // setError(error.response.data.message);
    }
  };

  useEffect(() => {
    socket.on("chat", (payload, name) => {
      if (userName != name) {
        setMessages([...messages, payload]);
      }
    });
  });

  return (
    <>
      <div className="container">
        <div className="main-heading">
          <h1>CONTACT APP</h1>
        </div>
        <div className="row add-data">
          <div className="col-md-8 col-lg-6">
            <form onSubmit={sendMessage}>
              {/* <input
            type=""
            name="chat"
            placeholder="send text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          <button type="submit">Send</button> */}

              <div
                className="card"
                style={{
                  background: "#fff",
                  margin: "5px",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className="mb-2">
                  <label for="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>

                {/* <div className="mb-2">
                  <label for="mobile" className="form-label">
                    Mobile no
                  </label>
                  <input type="number" className="form-control" />
                </div> */}

                {/* <button type="submit" className="btn btn-primary">
                  ADD
                </button> */}
                <button type="submit">Send</button>
              </div>
            </form>
          </div>
        </div>

        {/* contacts list */}
        <div className="row container-fluid mt-3">
          <div className="col -md-10">
            <h6>contacts Lists</h6>
            {messages.map((payload, index) => {
              return (
                <>
                  <ul className="contact-box" key={index}>
                    <li className="card border-light mb-3">
                      <div className="card-body">
                        <p className="text">
                          <span className="">{userName} : </span>{" "}
                          {payload.message}{" "}
                        </p>

                        <p className="text">wani@gmail.com</p>
                      </div>
                    </li>
                  </ul>
                </>
              );
            })}
          </div>
        </div>
        {/* end contacts list */}
      </div>
    </>
  );
};

export default AddContacts;
