import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { signIn } from '../../store/actions/authActions';

import loading from '../../images/loading.svg';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      isLoading: false,
      isLoggedIn: false,
      error: ''
    };
  }

  onChange = event => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  onSubmit = event => {
    event.preventDefault();
    this.props.signIn(this.state);
  }

  render() { 
    var loadingClass;
    if (this.state.isLoading === true) {
      loadingClass = 's_loading';
    } else {
      loadingClass = '';
    }

    var errorMessage;
    var errorClass;
    if (this.state.error !== '') {
      errorMessage = this.state.error;
      errorClass = 'field l_100 errors s_active';
    } else {
      errorMessage = '';
      errorClass = 'field l_100 errors';
    }

    var RedirectUser;
    if (this.state.isLoggedIn === true) {
      RedirectUser = <Redirect to={{ pathname: '/account' }} />;
    } else {
      RedirectUser = null;
    }

    const { auth, authError } = this.props;
    if (auth.uid) {
      return <Redirect to="/account" />
    }

    return ( 
      <React.Fragment>
        <section className="row content">
          {RedirectUser}
          <div className="row-inner-wide">
            <div className="content-main">
              <h1>Log in</h1>
            </div>
            <div className="content-main">
              <form className={loadingClass} onSubmit={this.onSubmit}>
                <div className="fields">
                  <div className="field l_50">
                    <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.onChange} />
                  </div>
                  <div className="field l_50">
                    <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
                  </div>
                  {authError ? <div className="field l_100 errors s_active"><p>{ authError }</p></div> : null}
                  <div className="field l_50">
                    <input className="btn-submit" type="submit" value="Login" />
                    <div className="loading"><img src={loading} alt="" /></div>
                  </div>
                </div>               
              </form>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
 
const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds) => dispatch(signIn(creds))
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(Login);
