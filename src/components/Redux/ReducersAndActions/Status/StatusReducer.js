import {ERROR, LOADING, LOADED, SUCCESS} from "./StatusActionsDefinition";

const initState = {
    loading: true,
    error: false,
    _msg: ""
}

const StatusReducer = (state = initState, payload) => {
    const { type } = payload;
    switch (type) {
        case LOADING:
            return {
                ...state,
                loading: true,
                error: false,
                _msg: "loading"
            }

        case ERROR:
            return {
                ...state,
                error: true,
                loading: false,
                _msg: payload._msg
            }

        case LOADED:
            return {
                ...state,
                loading: false,
                error: false,
                _msg: ""
            }

        case SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                _msg: ""
            }

        default:
            return state;
    }
}

export default StatusReducer;