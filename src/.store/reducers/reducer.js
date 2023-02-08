import { combineReducers } from "redux";
import appReducer from "./app";
import casesReducer from "./cases";
import officersReducer from "./officers"

export default combineReducers ({
    appReducer,
    casesReducer,
    officersReducer
})