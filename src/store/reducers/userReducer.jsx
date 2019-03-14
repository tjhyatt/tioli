const initState = {
  username: '',
  uid: ''
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_USER_TIOLIS':
      return {
        ...state,
        tiolis: action.tiolis
      }
    default:
      return state;
  }
}

export default userReducer;