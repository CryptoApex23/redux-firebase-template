import { searchUsersByUsername } from "../../services/firestore";

export const SEARCH_USERS_REQUEST = "SEARCH_USERS_REQUEST";
export const SEARCH_USERS_SUCCESS = "SEARCH_USERS_SUCCESS";
export const SEARCH_USERS_FAILURE = "SEARCH_USERS_FAILURE";

export const searchUsers = (username) => async (dispatch) => {
  dispatch({ type: SEARCH_USERS_REQUEST });
  try {
    const users = await searchUsersByUsername(username);
    dispatch({ type: SEARCH_USERS_SUCCESS, payload: users });
  } catch (error) {
    dispatch({ type: SEARCH_USERS_FAILURE, payload: error.message });
  }
};
