import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedInLinks = (props) => {
  console.log("S.I.L ", props)
  return ( 
    <li className="margin-left"><NavLink exact activeClassName='s_here' onClick={props.onMenuToggle} to='/account'>{props.displayName}</NavLink></li>
  );
};

export default SignedInLinks;