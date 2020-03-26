import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import {connect} from 'react-redux'
import {createChat, sendChat, getChat} from '../../actions/chat'
import Spinner from '../layout/Spinner'

const ChatHeader = ({chat, onClick}) => {
  return (
    
                  <div onClick = {e => onClick(chat._id)}>
                  <div className="border-top border-bottom " style = {{padding: "1.5em", "paddingRight" : "15px", "paddingLeft" : "15px" }}>
                    <li className=""></li>{chat.name}{" "}
                    <i className="fas fa-circle text-primary col-2 align-bottom float-right" style = {{"lineHeight" : "1.65"}}></i>
                  </div>
                  </div>
  );
};

ChatHeader.propTypes = {
    chat : PropTypes.object.isRequired,
    onClick : PropTypes.func.isRequired
};

export default ChatHeader;
