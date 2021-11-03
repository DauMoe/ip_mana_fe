import { combineReducers } from "redux";
import SideBarReducer from './ReducersAndActions/SideBar/SideBarReducer';

const RootReducer = combineReducers({
    SideBar: SideBarReducer
});

export default RootReducer;