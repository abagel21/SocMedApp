import axios from "axios";
import { ADD_CHAT, SEND_CHAT, CHAT_ERROR, GET_CHAT } from "./types";
import { setAlert } from "./alert";
import setAuthToken from '../utils/setAuthToken'

export const createChat = (userId) => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put(`/api/users/chat/${userId}`, {userId}, config);
        console.log(res.data)
        dispatch({
            type: ADD_CHAT,
            payload: res.data
        })
    } catch (err) {
        console.log(err)
        dispatch({
            type: CHAT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

//placeholder for get chat
export const getChat = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get("/api/users/chat")
        console.log(res.data)
        dispatch({
            type: GET_CHAT,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: CHAT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


//send a chat
export const sendChat = (chatId, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put(`/api/users/chat/send/${chatId}`, formData, config);
        dispatch({
            type: SEND_CHAT,
            payload: res.data
        })
        return await res.data
    } catch (err) {
        dispatch({
            type: CHAT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}