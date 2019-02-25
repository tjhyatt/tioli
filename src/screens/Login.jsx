import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import firebase from 'firebase';

import loading from '../images/loading.svg';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      isLoading: false,
      isLoggedIn: false,
      error: ''
    };
  }

  onChange = event => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  onSubmit = event => {
    event.preventDefault();
    this.setState({isLoading: true});
    this.login(this.state.email, this.state.password);
  }

  login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then( () => {
      this.setState({
        isLoading: false,
        isLoggedIn: true
      });
    }).catch( (error) => {
      this.setState({error: error.message, isLoading: false});
    })
  }

  signUp(username, email, password) {
    // check if username is unique
    let ref = firebase.database().ref('usernames');
    // ref.child('username').orderByChild('username').equalTo(username.toUpperCase()).on("value", function(snapshot) {
    //   console.log(snapshot.val());
    //   snapshot.forEach(function(data) {
    //       console.log(data.key);
    //   });
    // });

    // create account
    firebase.auth().createUserWithEmailAndPassword(email, password).then( (e) => {

      // add user details
      firebase.database().ref('users/' + e.user.uid).set({
        email: e.user.email,
        username: username
      });

      // add username to list
      firebase.database().ref('usernames').set({
        [username.toUpperCase()]: e.user.uid
      });

    }).catch( (e) => {
      console.log(e);

      // display error message
    })
  }

  render() { 
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
      errorMessage = '';
      errorClass = 'field l_100 errors';
    }

    var RedirectUser;
    if (this.state.isLoggedIn === true) {
      RedirectUser = <Redirect to={{ pathname: '/account' }} />;
    } else {
      RedirectUser = null;
    }

    return ( 
      <React.Fragment>
        <section className="row content">
          {RedirectUser}
          <div className="row-inner-wide">
            <div className="content-main l_text-centered">
              <h1>Log in</h1>
            </div>
            <div className="content-main">
              <form className={loadingClass} onSubmit={this.onSubmit}>
                <div className="fields">
                  <div className="field l_50">
                    <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.onChange} />
                  </div>
                  <div className="field l_50">
                    <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
                  </div>
                  <div className={errorClass}>
                    <p>{errorMessage}</p>
                  </div>
                  <div className="field l_50">
                    <input className="btn-submit" type="submit" value="Login" />
                    <div className="loading"><img src={loading} alt="" /></div>
                  </div>
                </div>               
              </form>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
 
export default Login;