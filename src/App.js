import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import fire from './config/firebase.js';

// screens
import NavBar from './components/nav/navBar';
import Home from './screens/Home';
import Latest from './screens/Latest';
import View from './screens/View';
import Create from './screens/Create';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Account from './screens/Account';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      email: '', 
      password: '', 
      error: '', 
      loading: false,
      user: null,
      username: '',
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user, username: 'hello' });
        console.log('Logged in');
      } else {
        this.setState({ user: null, username: '' });
        console.log('Guest');
      }
    })
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/latest" component={Latest} />
            <Route path="/create" component={Create} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/account" component={Account} />
            <Route path="/view/:id" component={View} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
