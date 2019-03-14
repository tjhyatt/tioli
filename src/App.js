import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import fbConfig from './config/fbConfig.js';

// screens
import NavBar from './components/nav/navBar';
import Home from './components/screens/Home';
import Latest from './components/screens/Latest';
import View from './components/screens/View';
import Create from './components/screens/Create';
import Signup from './components/screens/Signup';
import Login from './components/screens/Login';
import Account from './components/screens/Account';
import User from './components/screens/User';
import Search from './components/screens/Search';

// import './App.css';

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
    fbConfig.auth().onAuthStateChanged((user) => {
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
            <Route path="/user/:username" component={User} />
            <Route path="/search" component={Search} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
