import { RECEIVE_PEOPLE, SELECT_PERSON } from "store/types";

export const selectPerson = (id: Number) => ({
  type: SELECT_PERSON,
  payload: id
});

export const fetchPeople = () => {
  return async dispatch => {
    const payload = await fetchPeopleSync();
    return dispatch(receivePeople(payload));
  };
};

export const receivePeople = people => ({
  type: RECEIVE_PEOPLE,
  payload: people
});

export const fetchPeopleSync = async () =>
  (await import("../../public/data.json")).default;
