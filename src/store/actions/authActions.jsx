import { isEmpty } from '../../helper/functions.js';

export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    
    const firebase = getFirebase();

    firebase.auth().signInWithEmailAndPassword(
      credentials.email, 
      credentials.password
    ).then(() => {
      dispatch({
        type: 'LOGIN_SUCCESS',
        err: null
      })
    }).catch((err) => {
      dispatch({
        type: 'LOGIN_ERROR',
        err: err
      })
    });
  }
}

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    
    const firebase = getFirebase();

    firebase.auth().signOut()
    .then(() => {
      dispatch({
        type: 'LOGOUT_SUCCESS',
        err: null
      })
    }).catch((err) => {
      dispatch({
        type: 'LOGOUT_ERROR',
        err: err
      })
    });
  }
}

export const signUp = (newUser) => {
  return (dispatch, getState, { getFirebase }) => {
    
    const firebase = getFirebase();

    // check if fields are empty
    if (isEmpty(newUser.email) || isEmpty(newUser.username) || isEmpty(newUser.password)){
      dispatch({
        type: 'SIGNUP_ERROR',
        err: 'Please fill out all fields'
      });

      return;
    }

    // check if username is unique
    let ref = firebase.database().ref('usernames');
    ref.child(newUser.username.toUpperCase()).once('value').then(function(snapshot){

      if (snapshot.val() != null) {

        // username exists, show error
        dispatch({
          type: 'SIGNUP_ERROR',
          err: 'Username already exists, choose another'
        });
      } else {

        // username is unique, sign up user
        try {
          firebase.auth().createUserWithEmailAndPassword(
            newUser.email, 
            newUser.password
          ).then((res) => {

            console.log('here 1', res.user);

            // add display name
            res.user.updateProfile({
              displayName: newUser.username
            }).then(function() {
              // Profile updated successfully!
              // "Jane Q. User"
              var displayName = res.user.displayName;
              console.log("DISP NAME: ", displayName);
  
            }, function(err) {
              console.log("ERROR: ", err);
            });
      
            // add user details
            firebase.database().ref('users/' + res.user.uid).set({
              email: newUser.email,
              username: newUser.username
            });
      
            // add username to list
            firebase.database().ref('usernames').update({
              [newUser.username.toUpperCase()]: res.user.uid
            });

            // dispatch
            dispatch({
              type: 'SIGNUP_SUCCESS',
              err: null
            });
          }).catch((err) => {
            console.log('here 3', err);
            dispatch({
              type: 'SIGNUP_ERROR',
              err: err.message
            });
          })
        } catch(err) {
          if (err instanceof TypeError) {
            dispatch({
              type: 'SIGNUP_ERROR',
              err: err.message
            });
          }
        }
      }
    });
  }
}
