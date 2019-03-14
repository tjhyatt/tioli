export const getUserTiolis = (user) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    const firebase = getFirebase();
    const query = firebase.database().ref('tioli').orderByChild('uid').equalTo(user.uid);

    let data = [];

    query.once("value")
      .then(function(snapshot) {

        let index = 0;
        snapshot.forEach(function(childSnapshot){
          var element = {key: childSnapshot.key, value: childSnapshot.val()};
          data[index] = element;   
          index++;    
        });

        dispatch({
          type: 'GET_USER_TIOLIS',
          tiolis: data
        });
    });

    dispatch({
      type: 'GET_USER_TIOLIS',
      username: user.username,
      uid: user.uid
    });
  }
}
