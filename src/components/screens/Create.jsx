import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import loading from '../../images/loading.svg';

import { createTioli } from '../../store/actions/tioliActions';

class Create extends Component {
  state = {
    question: '',
    user: null,
    isSubmitted: false
  };

  onChange = (event) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({ isSubmitted: true });
    this.props.createTioli(this.state);
  }

  render() { 
    const { auth, tioli } = this.props;
    const tioliError = tioli.tioliError;
    const tioliLink = tioli.tioliLink;

    var loadingClass;

    if (auth.isLoaded) {
      loadingClass = '';
    }

    if (this.state.isSubmitted & tioliLink !== '') {
      return <Redirect to={{ pathname: '/view/' + tioliLink }} />
    }

    return ( 
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main">
              <h1>Create</h1>
            </div>
            <div className="content-main">
              <form id="question" className={loadingClass} onSubmit={this.onSubmit}>
                <div className="fields">
                  <div className="field l_100">
                    <textarea className="question" name="question" placeholder="Your question..." value={this.state.question} onChange={this.onChange}></textarea>
                  </div>
                  {tioliError ? <div className="field l_100 errors s_active"><p>{ tioliError }</p></div> : null}
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
    createTioli: (tioli) => dispatch(createTioli(tioli))
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    tioli: state.tioli
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(Create);
