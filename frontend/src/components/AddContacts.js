import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import axios from "axios";
import { Link } from "react-router-dom";

const socket = io.connect("http://localhost:5000");
const userName = nanoid(4);

const AddContacts = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [mobile, setMobile] = useState("");

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

  // send
  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const config = {
        Headers: {
          "Content-type": "applications/json",
        },
      };
      setNewMessage("");
      setMobile("");
      const { data } = await axios.post(
        `/api/messages/send`,
        {
          newMessage,
          mobile,
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

  // delete
  const deleteHandler = async (id) => {
    if (window.confirm("are you sure")) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const { data } = await axios.delete(`/api/messages/${id}`, config);
        console.log(data);

        // socket.emit("delete", data);

        let de = messages.filter((item) => item._id !== id);
        socket.emit("delete", data);

        setMessages([...de]);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    socket.on("chat", (payload, name) => {
      if (userName != name) {
        setMessages([...messages, payload]);
      }
    });

    //delete
    socket.on("delete", (payload) => {
      console.log(payload.deleteContact._id);
      // console.log(messages);

      let de = messages.filter(
        (item) => item._id !== payload.deleteContact._id
      );
      setMessages([...de]);
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
                    style={{
                      boxShadow: "none",
                    }}
                    type="text"
                    className="form-control"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label for="mobile" className="form-label">
                    Mobile no
                  </label>
                  <input
                    style={{
                      boxShadow: "none",
                    }}
                    type="number"
                    className="form-control"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

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

                        <p className="text">{payload.mobile}</p>

                        {/* delete  */}
                        <span>
                          <button
                            style={{ background: "yellow" }}
                            onClick={() => deleteHandler(payload._id)}
                          >
                            delete
                          </button>
                        </span>

                        {/* <Link to={`/note/${note._id}`}>
                              <Fab
                                color="primary"
                                aria-label="edit"
                                size="small"
                              >
                                <EditIcon />
                              </Fab>
                            </Link>  */}
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
