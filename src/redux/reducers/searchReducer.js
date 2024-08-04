import {
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAILURE,
} from "../actions/searchActions";

const initialState = {
  searchResults: [],
  loading: false,
  error: null,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case SEARCH_USERS_SUCCESS:
      return { ...state, loading: false, searchResults: action.payload };
    case SEARCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default searchReducer;
