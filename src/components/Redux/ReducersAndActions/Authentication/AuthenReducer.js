import {LOGGED_IN, NOT_LOGGED_IN} from "./AuthenActionsDefinition";
import jwt_decode from "jwt-decode";

const ssid = localStorage.getItem("ssid");

const initState = {
    logged_in: false,
    token: ssid,
    is_admin: ssid !== null && ssid !== undefined ? jwt_decode(ssid).is_admin : false,
    fullname: ssid !== null && ssid !== undefined ? jwt_decode(ssid).fullname : ""
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
                is_admin: jwt_decode(payload.token).is_admin,
                fullname: jwt_decode(payload.token).fullname
            };
        case NOT_LOGGED_IN:
            localStorage.removeItem("ssid");
            return {
                ...state,
                logged_in: false,
                token: null,
                is_admin: false,
                username: ""
            }
        default:
            return state;
    }
}

export default AuthenticationReducer;