import React, { Component } from 'react';
import firebase from 'firebase';
import { compose } from 'redux';
import { connect } from "react-redux";
import { firebaseConnect } from 'react-redux-firebase';
import { getUserTiolis } from '../../store/actions/userActions';
import PreviewBox from '../tioli/previewBox';

class User extends Component {

  componentDidMount() {
    let { username } = this.props.match.params;
    this.getUserByUsername(username);
  }

  getUserByUsername(username) {
    let name = username.toUpperCase();
    let uid = null;
    const ref = firebase.database().ref('usernames');
    
    ref.child(name).once('value').then(function(snapshot) {
      uid = snapshot.val();
    }).then(() => {
      this.props.getUserTiolis({
        username: name,
        uid: uid
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const { user } = this.props;
    let tiolis = [];
    let noSubs = null;

    if (user.tiolis !== undefined) {
      tiolis = user.tiolis;

      if (tiolis.length === 0) {
        noSubs = <p>No submissions found.</p>;
      }
    }

    return(
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main">
              <h2>Submissions</h2>
              {noSubs}

              <div className="box-list">

                {tiolis && tiolis.map(item => 
                  <PreviewBox 
                    key={item.key} 
                    id={item.key} 
                    question={item.value.question} 
                    takeVotes={item.value.takeVotes} 
                    leaveVotes={item.value.leaveVotes} 
                  />
                )}

              </div>

            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserTiolis: (user) => dispatch(getUserTiolis(user))
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const fbWrapped = firebaseConnect((props, state) => ([
  { path: `submissions/${props.uid}`, queryParams: [ 'orderByChild=timestamp', 'limitToFirst=10' ] }
]));
 
export default compose(
  connect(mapStateToProps, mapDispatchToProps),(fbWrapped)
  ) (User);
  