import { combineReducers } from "redux";
import StatusReducer from './ReducersAndActions/Status/StatusReducer';
import AuthenticationReducer from "./ReducersAndActions/Authentication/AuthenReducer";

const RootReducer = combineReducers({
    Status: StatusReducer,
    Authen: AuthenticationReducer
});

export default RootReducer;