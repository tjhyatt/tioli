import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { withRouter } from "react-router"
import SignedInLinks from './signedInLinks';
import SignedOutLinks from './signedOutLinks';
import SearchBar from './searchBar';
import Menu from '../nav/menu';

class NavBar extends Component {

  state = {
    isMenuActive: false
  }

  onMenuToggle = (event) => {
    if (this.state.isMenuActive) {
      this.setState({
        isMenuActive: false
      })
      document.body.classList.toggle('s_menu-active', false);
    } else {
      this.setState({
        isMenuActive: true
      })
      document.body.classList.toggle('s_menu-active', true);
    }
  }

  render() {
    const { auth } = this.props;
    const links = auth.uid ? <SignedInLinks displayName={auth.displayName ? auth.displayName : 'Account'} /> : <SignedOutLinks /> 

    let menuHandleClass = 'menu-handle';
    if (this.state.isMenuActive) {
      menuHandleClass = 'menu-handle s_active';
    } else {
      menuHandleClass = 'menu-handle';
    }

    return ( 
      <React.Fragment>
        <nav className="row nav">
          <div className="row-inner-wide">
            <div className="nav-main">
              <div className="item-hover"></div>
              <div className="logo">
                <ul>
                  <li><NavLink exact activeClassName='s_here' onClick={this.state.isMenuActive ? this.onMenuToggle : null} to='/'>TIOLI</NavLink></li>
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
              <div className="nav-menu">
                <div className={menuHandleClass} onClick={this.onMenuToggle}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <Menu onMenuToggle={this.onMenuToggle} isActive={this.state.isMenuActive} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}
 
export default withRouter(connect(mapStateToProps)(NavBar));
