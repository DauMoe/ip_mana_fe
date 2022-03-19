import {LOGGED_IN, NOT_LOGGED_IN} from "./AuthenActionsDefinition";

const initState = {
    logged_in: false,
    token: localStorage.getItem("ssid"),
    is_admin: false
}

const AuthenticationReducer = (state = initState, payload) => {
    const { type } = payload;
    switch (type) {
        case LOGGED_IN:
            localStorage.setItem("ssid", payload.token);
            return {
                ...state,
                logged_in: true,
                token: payload.token,
                is_admin: payload.is_admin
            };
        case NOT_LOGGED_IN:
            localStorage.removeItem("ssid");
            return {
                ...state,
                logged_in: false,
                token: null,
                is_admin: false
            }
        default:
            return state;
    }
}

export default AuthenticationReducer;