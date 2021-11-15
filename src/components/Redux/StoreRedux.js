import { createStore } from "redux";
import RootReducer from './RootReducer';

console.log(process.env.NODE_ENV);
let store;
if (process.env.NODE_ENV === "development") {
    store = createStore(RootReducer,  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
} else {
    store = createStore(RootReducer);
}

export default store;