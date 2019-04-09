import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedOutLinks = (props) => {
  return ( 
    <React.Fragment>
      <li className="margin-left"><NavLink exact activeClassName='s_here' onClick={props.onMenuToggle} to='/login'>Login</NavLink></li>
      <li><NavLink exact activeClassName='s_here' onClick={props.onMenuToggle} to='/signup'>Sign&nbsp;Up</NavLink></li>
    </React.Fragment>
  );
};

export default SignedOutLinks;