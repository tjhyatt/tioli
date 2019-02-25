import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
// import NavBarLink from '../nav/navBarLink'; <NavBarLink name="Login" url="/login" />

import firebase from '../../config/firebase.js';
import loading from '../../images/loading.svg';

class NavBar extends Component {

  state = { 
    isLoggedIn: false,
    isLoading: true
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isLoggedIn: true, isLoading: false });
      } else {
        this.setState({ isLoggedIn: false, isLoading: false });
      }
    })
  }

  render() { 
    var user = firebase.auth().currentUser;
    var LoginNav;

    if (this.state.isLoading) {
      LoginNav = 
        <ul>
          <li><img src={loading} alt="loading" width="30px"/></li>
        </ul>;
    }

    if (!this.state.isLoading) {
      if (user) {
        // User is signed in.
        LoginNav = 
          <ul>
            <li><NavLink exact activeClassName='s_here' to='/account'>Account</NavLink></li>
          </ul>;
  
      } else {
        // No user is signed in.
        LoginNav = 
          <ul>
            <li><NavLink exact activeClassName='s_here' to='/signup'>Sign Up</NavLink></li>
            <li><NavLink exact activeClassName='s_here' to='/login'>Login</NavLink></li>
          </ul>;
      }
    }

    
    return ( 
      <nav className="row nav">
        <div className="row-inner-wide">
          <div className="nav-main">
            <div className="item-hover"></div>
            <div className="logo">
              <ul>
                <li><NavLink exact activeClassName='s_here' to='/'>TIOLI</NavLink></li>
              </ul>
            </div>
            <div className="items">
              <ul>
                <li><NavLink exact activeClassName='s_here' to='/latest'>Latest</NavLink></li>
                <li><NavLink exact activeClassName='s_here' to='/create'>Create</NavLink></li>
              </ul>
            </div>
            <div className="items-aside">
              {LoginNav}
            </div>
          </div>
        </div>
      </nav>
    );
    
  }
}
 
export default NavBar;