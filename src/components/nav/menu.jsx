import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import SignedInLinks from './signedInLinks';
import SignedOutLinks from './signedOutLinks';
import SearchBarMenu from './searchBarMenu';

class Menu extends Component {

  state = {
    isActive: false,
    willCloseMenu: false
  }

  render() {
    let { isActive, onMenuToggle } = this.props;

    let menuClass = "row menu";
    if (isActive) {
      menuClass = "row menu s_active";
    } else {
      menuClass = "row menu";
    }
    const { auth } = this.props;
    const links = auth.uid ? <SignedInLinks onMenuToggle={this.props.onMenuToggle} displayName={auth.displayName ? auth.displayName : 'Account'} /> : <SignedOutLinks onMenuToggle={this.props.onMenuToggle} /> 
    return ( 
      <div className={menuClass}>
        <div className="row-inner-wide">
          <div className="menu-main">
          
            <ul>
              <SearchBarMenu onMenuToggle={onMenuToggle}/>
              <li><NavLink exact activeClassName='s_here' onClick={onMenuToggle} to='/latest'>Latest</NavLink></li>
              <li><NavLink exact activeClassName='s_here' onClick={onMenuToggle} to='/create'>Create</NavLink></li>
              { links }
            </ul>
            
          </div>
        </div>
      </div>
    );
  }
}
 
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}
 
export default connect(mapStateToProps)(Menu);
