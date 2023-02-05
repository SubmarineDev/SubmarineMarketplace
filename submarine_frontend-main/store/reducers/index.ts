import { combineReducers } from "redux";
import people from "./people";
import init from "./init";

export default combineReducers({ people: people, init: init });
