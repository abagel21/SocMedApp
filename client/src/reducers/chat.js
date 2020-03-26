import { ADD_CHAT, SEND_CHAT, CHAT_ERROR, GET_CHAT } from "../actions/types";

const initialState = {
    chat : [],
    loading : true
};

export default function(state = initialState, action) {
    const {type, payload} = action
    switch(type) {
        case GET_CHAT :
            return {
                ...state,
                chat : payload,
                loading : false
            }
            case ADD_CHAT :
                return {
                    ...state, 
                    chat : [payload, ...state.chat],
                    loading : false
                }
                case CHAT_ERROR :
                    return {
                        ...state,
                        loading : false
                    }
                    default :
                    return state;
    }
}