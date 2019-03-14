const initState = {
  result: '',

};

const searchReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_RESULT':
      console.log('action triggered');
      return {
        ...state,
        result: action.result,
        query: action.query,
        key: action.key
      }
    default:
      return state;
  }
}

export default searchReducer;