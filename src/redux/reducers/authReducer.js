const initialState = {
  user: null,
  loading: false,
  error: null,
  success: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GETTING_DATA":
      return { ...state, loading: true };
    case "LOGIN_REQUEST":
      return { ...state, loading: true };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, loading: false };
    case "LOGIN_FAILURE":
      return { ...state, error: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, user: null };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        user: action.payload,
        success: "Profile successfully updated!",
        error: null,
      };
    case "UPDATE_PROFILE_ERROR":
      return { ...state, error: action.payload, success: null };
    default:
      return state;
  }
};

export default authReducer;
