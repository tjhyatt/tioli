const initState = {
  result: '',
  isSearching: false
};

const searchReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_RESULT':
      return {
        ...state,
        result: action.result,
        query: action.query,
        key: action.key,
        isSearching: false
      }
    default:
      return state;
  }
}

export default searchReducer;