import * as T from "../types";
import { Person } from "../../typedefs";
import { HYDRATE } from "next-redux-wrapper";

interface State {
  people: Person[];
  selectedPerson: Number;
}

const initialState: State = {
  people: [],
  selectedPerson: -1
};

export default function (state = initialState, action) {
  switch (action.type) {
    case HYDRATE:
      return action.payload.people;
    case T.RECEIVE_PEOPLE:
      return { people: action.payload, selectedPerson: -1 };
    case T.SELECT_PERSON:
      return { ...state, selectedPerson: action.payloads };
    default:
      return state;
  }
}
