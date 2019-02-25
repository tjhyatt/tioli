import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase';
import { isEmpty } from '../components/tioli/functions.js';
import loading from '../images/loading.svg';

class Create extends Component {
  state = {
    isLoggedIn: false,
    question: '',
    username: '',
    isLoading: true,
    isSubmitted: false,
    redirectLink: '',
    error: ''
  };
  
  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ 
          isLoggedIn: true,
          isLoading: false 
        });
      } else {
        this.setState({ 
          isLoggedIn: false,
          isLoading: false 
        });
      }
    })
  }

  onChange = (event) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();

    if (!this.state.isLoggedIn) {
      this.setState({
        error: 'You must be logged in'
      });
      return true;
    }

    this.setState({
      isLoading: true
    });

    var context = this;
    var user = firebase.auth().currentUser;
    var question = context.state.question;

    // check if input is empty
    if (isEmpty(question)) {
      context.setState({error: 'Please enter a question', isLoading: false});
    } else {
      // get username
      firebase.database().ref('users/' + user.uid).once("value").then(function(snapshot) {
        var username = snapshot.val().username;

        var randomstring = require("randomstring");
        var ref = randomstring.generate(20);

        //var ref = firebase.database().ref('tioli').push();

        firebase.database().ref('tioli/' + ref).set({
          uid: user.uid,
          username: username,
          timestamp: - Date.now(), // store timestamp as negative so firebase displays them is descending order
          question: question,
          takeVotes: 0,
          leaveVotes: 0
        }).then(() => {
          context.setState({
            question: '',
            error: '',
            isLoading: false,
            isSubmitted: true,
            redirectLink: ref
          });

          document.getElementById("question").value = "";

        }).catch((error) => {
          context.setState({
            error: error.message, 
            isLoading: false
          });
        });
      });
    }
  }

  render() { 
    var RedirectUser = null;

    if (this.state.isSubmitted) {
      RedirectUser = <Redirect to={{ pathname: '/view/' + this.state.redirectLink }} />
    }

    
    var loadingClass;
    if (this.state.isLoading === true) {
      loadingClass = 's_loading';
    } else {
      loadingClass = '';
    }

    var errorMessage;
    var errorClass;
    if (this.state.error !== '') {
      errorMessage = this.state.error;
      errorClass = 'field l_100 errors s_active';
    } else {
      errorMessage = this.state.error;
      errorClass = 'field l_100 errors';
    }

    return ( 
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main l_text-centered">
              <h1>Create</h1>
            </div>
            <div className="content-main">
              <form id="question" className={loadingClass} onSubmit={this.onSubmit}>
                <div className="fields">
                  <div className="field l_100">
                    <textarea className="question" name="question" placeholder="Your question..." value={this.state.question} onChange={this.onChange}></textarea>
                  </div>
                  <div className={errorClass}>
                    <p>{errorMessage}</p>
                  </div>
                  <div className="field l_50">
                    <input className="btn-submit" type="submit" value="Submit" />
                    <div className="loading"><img src={loading} alt="" /></div>
                  </div>
                </div>               
              </form>
            </div>
          </div>
          {RedirectUser}
        </section>
      </React.Fragment>
    );
  }
}
 
export default Create;