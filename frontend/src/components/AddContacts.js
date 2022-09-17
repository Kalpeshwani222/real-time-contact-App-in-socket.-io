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

  const [show, setShow] = useState(false);

  //update
  const [upname, SetupName] = useState("");
  const [upmobile, setupMobile] = useState("");
  const [upId, setUpId] = useState("");

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

        let de = messages.filter((item) => item._id !== id);
        socket.emit("delete", data);

        setMessages([...de]);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  // view single data
  const viewSingledata = async (id) => {
    setShow(true);

    const { data } = await axios.get(`/api/messages/${id}`);

    SetupName(data.message);
    setupMobile(data.mobile);
    setUpId(data._id);
  };

  //update data api call
  const updateData = async (e) => {
    e.preventDefault();

    console.log(upId);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `/api/messages/${upId}`,
      { upname, upmobile },
      config
    );

    socket.emit("update", data);

    setMessages(
      messages.map((ele) => {
        if (ele._id === data.updatedData._id) {
          return {
            ...ele,
            message: data.updatedData.message,
            mobile: data.updatedData.mobile,
          };
        }
        return ele;
      })
    );
    setShow(false);
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

    //update
    socket.on("update", (payload) => {
      console.log(payload);
      setMessages(
        messages.map((ele) => {
          if (ele._id === payload.updatedData._id) {
            return {
              ...ele,
              message: payload.updatedData.message,
              mobile: payload.updatedData.mobile,
            };
          }
          return ele;
        })
      );
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
                <button type="submit">Add </button>
              </div>
            </form>
          </div>
        </div>

        {/* contacts list */}
        <div className="row container-fluid mt-3 justify-content-center">
          <div className="col-md-8 ">
            <h6>contacts Lists</h6>
            {messages.map((payload, index) => {
              return (
                <>

                  <div className="card mb-2">
                    <div
                      className="card-profile"
                     
                    >
                      <img
                        src="./img.jfif"
                        alt="profile-img"
                        className="profile-image"
                      />

                      <div className="card-profile-info">
                        <p className="text">
                          <span className="">{userName} : </span>{" "}
                          {payload.message}
                        </p>

                        <p className="text">{payload.mobile}</p>
                      </div>
                     

                        <div className="btns-div">
                        <button
                         className="btn btn-danger"
                          onClick={() => deleteHandler(payload._id)}
                        >
                          Delete
                        </button>
                
                        <button
                        className="btn btn-warning"

                          onClick={() => viewSingledata(payload._id)}
                        >
                          Edit
                        </button>
                        </div>
                      
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        {/* end contacts list */}
      </div>

      {/* for model */}

      {show ? (
        <>
          <div
            className="modal"
            style={{
              position: "fixed",
              left: "0",
              right: "0",
              top: "0",
              bottom: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <form onSubmit={updateData}>
              <div
                style={{
                  width: "500px",
                  backgroundColor: "#fff",
                }}
              >
                <div>
                  <input
                    type="text"
                    value={upname}
                    onChange={(e) => SetupName(e.target.value)}
                    style={{
                      width: "240px",
                      height: "35px",
                    }}
                  />
                  <br />
                  <br />

                  <input
                    type="text"
                    value={upmobile}
                    onChange={(e) => setupMobile(e.target.value)}
                    style={{
                      width: "240px",
                      height: "35px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button type="submit" style={{ background: "yellow" }}>
                      Update
                    </button>

                    <button onClick={() => setShow(false)}>Close</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        null
      )}
    </>
  );
};

export default AddContacts;
