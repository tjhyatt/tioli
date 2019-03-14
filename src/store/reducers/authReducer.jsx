const initState = {
  authError: null
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        authError: null
      }
    case 'LOGIN_ERROR':
      return {
        ...state,
        authError: 'Login error'
      }
    case 'LOGOUT_SUCCESS':
      return state;
    case 'SIGNUP_SUCCESS':
      console.log('here 2', state);
      return {
        ...state,
        authError: null
      }
    case 'SIGNUP_ERROR':
      return {
        ...state,
        authError: action.err
      }
    default:
      return state;
  }
}

export default authReducer;