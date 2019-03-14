import Fuse from 'fuse.js';

export const getResult = (query) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const ref = firebase.database().ref('tioli');
    let search = ref.orderByChild('question');
    let allQuestions = [];
    let key = '';

    search.once("value").then(function(snapshot) {

      snapshot.forEach(function(tioli) {
        let question = tioli.child('question').val();
        let username = tioli.child('username').val();
        let uid = tioli.child('uid').val();
        key = tioli.key;
        let list = {
          question: question,
          username: username,
          uid: uid,
          key: key
        };

        allQuestions.push(list);

      });
    }).then(() => {
      var options = {
        shouldSort: true,
        includeScore: true,
        threshold: 0.5,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          "question", "username"
        ]
      };

      var fuse = new Fuse(allQuestions, options);
      var result = fuse.search(query);

      dispatch({
        type: 'GET_RESULT',
        result: result,
        query: query,
        key: key
      });
    });
  }
}
