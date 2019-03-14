import { isEmpty } from "../../helper/functions";

export const createTioli = (tioli) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
    
    if (isEmpty(tioli.question)) {
      dispatch({
        type: 'CREATE_TIOLI_ERROR',
        err: 'Field can not be left blank'
      });

      return;
    }

    if (uid) {
      firebase.database().ref('users/' + uid).once("value").then(function(snapshot) {
        let username = snapshot.val().username;

        let randomstring = require("randomstring");
        let id = randomstring.generate(12);
        let timestamp = - Date.now(); // store timestamp as negative so firebase displays them is descending order

        // add the tioli
        firebase.database().ref('tioli/' + id).update({
          uid: uid,
          username: username,
          timestamp: timestamp, 
          question: tioli.question,
          takeVotes: 0,
          leaveVotes: 0
        }).then(() => {
          dispatch({
            type: 'CREATE_TIOLI',
            err: null,
            id: id
          });
        }).catch((err) => {
          dispatch({
            type: 'CREATE_TIOLI_ERROR',
            err: err.message
          });
        });

      });
    } else {
      dispatch({
        type: 'CREATE_TIOLI_ERROR',
        err: 'You are not signed in'
      });

      return;
    }


    // firestore database
    // fireStore.collection('users').add({
    //   email: 'tester@test.com'
    // }).then(() => {
    //   dispatch({
    //     type: 'CREATE_TIOLI',
    //     tioli: tioli
    //   })
    // }).catch((error) => {
    //   console.log(error);
    //   dispatch({
    //     type: 'CREATE_TIOLI_ERROR',
    //     error: error
    //   })
    // })



  }
}
