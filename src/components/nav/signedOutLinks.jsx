import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedOutLinks = () => {
  return ( 
    <React.Fragment>
      <li className="margin-left"><NavLink exact activeClassName='s_here' to='/login'>Login</NavLink></li>
      <li><NavLink exact activeClassName='s_here' to='/signup'>Sign&nbsp;Up</NavLink></li>
    </React.Fragment>
  );
};

export default SignedOutLinks;