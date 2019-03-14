const initState = {
  tioliError: null,
  tioliLink: ''
};

const tioliReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_TIOLI':
      return {
        ...state,
        tioliError: null,
        tioliLink: action.id
      }
    case 'CREATE_TIOLI_ERROR':
      return {
        ...state,
        tioliError: action.err,
        tioliLink: ''
      }
    case 'CREATE_TIOLI_REF':
      return {
        ...state,
        tioliError: null,
      }
    case 'CREATE_TIOLI_REF_ERROR':
      return {
        ...state,
        tioliError: action.err,
      }
    default:
      return state;
  }
}

export default tioliReducer;