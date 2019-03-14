import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import authReducer from './authReducer';
import tioliReducer from './tioliReducer';
import userReducer from './userReducer';
import searchReducer from './searchReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  tioli: tioliReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  user: userReducer,
  search: searchReducer
});

export default rootReducer;