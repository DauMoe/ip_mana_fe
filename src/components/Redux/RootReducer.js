import { combineReducers } from "redux";
import SideBarReducer from './ReducersAndActions/SideBar/SideBarReducer';
import StatusReducer from './ReducersAndActions/Status/StatusReducer';

const RootReducer = combineReducers({
    Status: StatusReducer
});

export default RootReducer;