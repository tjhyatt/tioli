import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase';

import loading from '../images/loading.svg';

class Signup extends Component {
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

  onChange = (event) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({isLoading: true});

    var username = this.state.username;
    var email = this.state.email;
    var password = this.state.password;

    var context = this;

    // check if username is unique
    let ref = firebase.database().ref('usernames');

    ref.child(this.state.username.toUpperCase()).once('value').then(function(snapshot) {

      if (snapshot.val() != null) {
        // username exists, show error
        context.setState({error: 'Username taken, select another.', isLoading: false});
      } else {
        // is unique
        try {
          firebase.auth().createUserWithEmailAndPassword(email, password).then( (e) => {

            // add user details
            firebase.database().ref('users/' + e.user.uid).set({
              email: e.user.email,
              username: username
            });
        
            // add username to list
            firebase.database().ref('usernames/').update({
              [username.toUpperCase()]: e.user.uid
            });

            // update state
            context.setState({
              isLoggedIn: true
            });
        
            }).catch( (e) => {
              context.setState({
                error: e.message, 
                isLoading: false
              });
        
              // TODO: display error message
            })
          } catch(e) {
            if (e instanceof TypeError) {
            console.log(e);
          }
        }
      }
    });
    

    //let userId = firebase.auth().currentUser.uid;


    // firebase.database().ref('users/' + uid).set({
    //   email: "tim@brighter.com.au",
    //   username: newUserName
    // });


  }

  signUp = async (username, email, password) => {
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
    var RedirectUser = null;

    if (this.state.isLoggedIn) {
      RedirectUser = <Redirect to={{ pathname: '/account' }} />
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
      errorMessage = '';
      errorClass = 'field l_100 errors';
    }

    return ( 
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main l_text-centered">
              <h1>Sign up</h1>
            </div>
            <div className="content-main">
              <form className={loadingClass} onSubmit={this.onSubmit}>
                <div className="fields">
                  <div className="field l_100">
                    <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.onChange} />
                  </div>
                  <div className="field l_50">
                    <input type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.onChange} />
                  </div>
                  <div className="field l_50">
                    <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
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
 
export default Signup;