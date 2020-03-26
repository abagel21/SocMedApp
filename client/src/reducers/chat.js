import { ADD_CHAT, SEND_CHAT, CHAT_ERROR, GET_CHAT } from "../actions/types";

const initialState = {
    chats : [],
    loading : true,
    somethingElse : 'no'
};

export default function(state = initialState, action) {
    const {type, payload} = action
    switch(type) {
        case GET_CHAT :
            return {
                ...state,
                chats : payload,
                loading : false,
                somethingElse : 'hello'
            };
        case ADD_CHAT :
            return {
                 ...state, 
                chats : payload,
                  loading : false
            };
        case CHAT_ERROR :
            return {
                 ...state,
                 loading : false
            };
        default :
            return state;
    };
}