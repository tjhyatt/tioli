import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { signUp } from '../../store/actions/authActions';

import loading from '../../images/loading.svg';

class Signup extends Component {
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

  onKeyPress = (event) => {

    if (event.charCode === 32) {
      this.setState({
        error: 'Spaces in the username are not allowed'
      });
    } else {
      this.setState({
        error: ''
      });
    }
  }

  onChange = (event) => {
    event.preventDefault()
    const target = event.target;
    const name = target.name;

    let username = '';
    if (name === 'username') {
      username = event.target.value.replace(/\s/g, '');
    } else {
      username = event.target.value;
    }

    event.target.value = username;

    this.setState({
      [name]: event.target.value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.signUp(this.state);
  }

  render() { 

    var loadingClass;
    if (this.state.isLoading === true) {
      loadingClass = 's_loading';
    } else {
      loadingClass = '';
    }

    var errorMessage  = this.state.error;

    // redirect if not logged in
    const { auth, authError } = this.props;
    if (auth.uid) {
      return <Redirect to="/account" />
    }

    return ( 
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main l_text-centered">
              <h1>Sign up</h1>
            </div>
            <div className="content-main">
              <form className={loadingClass} onSubmit={this.onSubmit}>
                <div className="fields">
                  <div className="field l_100">
                    <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.onChange} />
                  </div>
                  <div className="field l_50">
                    <input type="text" name="username" placeholder="Username" value={this.state.username} onKeyPress={this.onKeyPress} onChange={this.onChange} />
                  </div>
                  <div className="field l_50">
                    <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
                  </div>
                  {authError ? <div className="field l_100 errors s_active"><p>{ authError }</p></div> : null}
                  {errorMessage ? <div className="field l_100 errors s_active"><p>{ errorMessage }</p></div> : null}
                  <div className="field l_50">
                    <input className="btn-submit" type="submit" value="Submit" />
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
    signUp: (creds) => dispatch(signUp(creds))
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
