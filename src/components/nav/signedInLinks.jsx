import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedInLinks = (props) => {
  return ( 
    <li className="margin-left"><NavLink exact activeClassName='s_here' to='/account'>{props.displayName}</NavLink></li>
  );
};

export default SignedInLinks;