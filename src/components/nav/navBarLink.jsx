import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavBarLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      url: props.url
    };
  }

  render() { 
    return ( 
      <NavLink 
        exact
        activeClassName='s_here'
        to={this.state.url}>
        {this.state.name}
      </NavLink>
    );
  }
}
 
export default NavBarLink;