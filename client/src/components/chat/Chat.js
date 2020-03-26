import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createChat, sendChat, getChat } from "../../actions/chat";
import Spinner from "../layout/Spinner";
import ChatHeader from "./ChatHeader";

const Chat = ({ createChat, sendChat, getChat, auth: { user }, chats }) => {
  const [chat, setChat] = useState({});
  const [text, setText] = useState('')
  useEffect(() => {
  
    getChat();
    if(user) {

    setChat(chat[0])
    }

  }, [getChat]);
  useEffect(() => {
    if(user) {

    setChat(user.chats[0])
    }
  }, [user, setChat])
  while(user === null) {
    return <Spinner />
  }
  
  
  

  let temp = {};
  const onClick = async (id) => {
    temp = chats.filter(chat => chat._id.toString() === id.toString())[0];

    await setChat(temp);
    
    document.querySelector('.messages').scrollTop = Math.abs(674 - document.querySelector('.textcontainer').clientHeight) + 10
  };

  return (
    <Fragment>
      <div className="container">
        <div
          className="jumbotron text-secondary display-4 text-center"
          style={{
            marginBottom: "0",
            paddingTop: ".8em",
            paddingBottom: ".8em"
          }}
        >
          Chat
        </div>
        <div
          className="container-fluid"
          style={{
            height: "75%",
            marginTop: "0",
            paddingRight: "0",
            paddingLeft: "0"
          }}
        >
          <div
            className="row"
            style={{
              height: "750px",
              paddingRight: "15px",
              paddingLeft: "15px"
            }}
          >
            <div
              className="col-3 bg-light text-start border rounded-left"
              style={{ paddingRight: "0", paddingLeft: "0" }}
            >
              <ul className="">
                <div
                  className="border-top border-bottom "
                  style={{
                    padding: "1.5em",
                    paddingRight: "20px",
                    paddingLeft: "15px"
                  }}
                >
                  <li className=""></li>
                  <h4 className="lead" style={{ display: "inline" }}>
                    Messages{" "}
                  </h4>
                  <i
                    className="fas fa-search align-bottom float-right"
                    style={{ justifyContent: "end" }}
                  ></i>
                </div>
                <div>
                  {user && chats && chats.length > 0 &&
                    !chats.loading &&
                    chats.map(chat => {
                      return (
                        <ChatHeader
                          key={chat._id}
                          chat={chat}
                          onClick={onClick}
                        />
                      );
                    })}
                </div>
              </ul>
            </div>
            <div
              className="col-9 bg-light text-center border rounded-right"
              style={{ height: "750px", paddingRight: "0", paddingLeft: "0"}}
              
            >
              <div
                className="border-top border-bottom "
                style={{ padding: ".75em", justifyContent: "start" }}
                onScroll = {e => {e.target.style.position = "absolute"}}
              >
                <img
                  className="round-img"
                  src={"//www.gravatar.com/avatar/fae145d41bb54c558f84feca6adc97cf?s=200&r=pg&d=mm"}
                  alt=""
                  style={{ display: "inline", width: "50px", height: "50px" }}
                />
                <h4
                  className="lead"
                  style={{ display: "inline", paddingLeft: "15px" }}
                >
                  {user && chats && chats.length> 0 && chats[0].name}
                </h4>
              </div>
              
              <div className = 'messages' style = {{"overflowY" : "auto", "overflowX" : "hidden", "height" : "674px", "scrollTop" : "1000"}}>
                <div className = 'textcontainer' >
                     {user && chat && chat.messages && chat.messages.length > 0 && chat.messages.slice(0).reverse().map((item, index) => {
                      if(item.user.toString() === chat.user.toString()) {
                        return (<div key = {index}  style = {{"marginTop" : "10px", "paddingLeft" : "15px"}} className = 'message'>
                        <p className = 'text-left' style = {{"marginBottom" : "2px"}}>{item.name}</p>
                        <div className = 'row'>
                        
                        <p className = 'col-8 border'>{'   '}{item.text}</p>
                        <div className = 'col-4'></div>
                        </div>
                        </div>)
                      } else {
                        return (<div key = {index}  style = {{"marginTop" : "10px", "paddingRight" : "15px"}} className = 'message'>
                          <p className = 'text-right' style = {{"marginBottom" : "2px"}}>{item.name}</p>
                          <div className = 'row'>
                          <div className = 'col-4'></div>
                          <p className = 'col-8 border' style = {{}}>{'   '}{item.text}</p>
                          </div>
                          </div>)
                      }
                    })} 
                    </div>
              </div>

            </div>
          </div>
        </div>
        <div
          className="row"
          style={{ paddingRight: "15px", paddingLeft: "15px" }}
        >
          <div
            className="col-3 bg-light text-start rounded-left"
            style={{ paddingRight: "0", paddingLeft: "0" }}
          ></div>
          <div
            className="col-9 bg-light text-center rounded-right"
            style={{ paddingRight: "0", paddingLeft: "0", borderTop: "none" }}
          >

              <form style={{width: "100%", "display" : "inline" }} onSubmit = {async e => {
                e.preventDefault();
                const holder =(await sendChat(chat._id, {text}))
                const aholder = holder.sendingChat
                setChat(aholder)
                setText('')
                }}>
                <input
                  type="text"
                  placeholder="Write your message here"
                  className="justify-content-start float-left"
                  value = {text}
                  onChange = {e => setText(e.target.value)}
                  style={{
                    display: "inline",
                    width: "96%",
                    padding: "0.4rem",
                    fontSize: "1.2rem",
                    border: "1px solid #ccc"
                  }}
                /> <i
                className="fas fa-paper-plane"
                style={{
                  verticalAlign: "middle",
                  display: "inline",
                  lineHeight: "2.5"
                }}
              ></i>
              
              
              </form>


          </div>
        </div>
      </div>
    </Fragment>
  );
};

Chat.propTypes = {
  createChat: PropTypes.func.isRequired,
  sendChat: PropTypes.func.isRequired,
  getChat: PropTypes.func.isRequired,
  user: PropTypes.object,
  chats : PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  chats : state.chat.chats
});

export default connect(mapStateToProps, {
  createChat,
  sendChat,
  getChat,
})(Chat);
