import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { withRouter } from "react-router"
import SignedInLinks from './signedInLinks';
import SignedOutLinks from './signedOutLinks';
import SearchBar from './searchBar';

class NavBar extends Component {

  render() {
    const { auth } = this.props;
    const links = auth.uid ? <SignedInLinks displayName={auth.displayName ? auth.displayName : 'Account'} /> : <SignedOutLinks /> 
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
              <ul>
                <SearchBar />
                { links }
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}
 
export default withRouter(connect(mapStateToProps)(NavBar));
