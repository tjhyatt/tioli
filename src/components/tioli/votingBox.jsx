import React, { Component } from 'react';
import firebase from 'firebase';

class VotingBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      tioliId: null,
      takeVotes: null,
      leaveVotes: null,
      voteStatus: null
    };

    this.handleTakeClick = this.handleTakeClick.bind(this);
    this.handleLeaveClick = this.handleLeaveClick.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      userId: this.props.uid,
      tioliId: this.props.tioliId,
      takeVotes: this.props.takeVotes,
      leaveVotes: this.props.leaveVotes,
      voteStatus: this.props.voteStatus
    });
  }

  handleTakeClick() {
    let id = this.state.tioliId;
    let user = firebase.auth().currentUser;
    let context = this;

    if (user) {

      // check if user has voted on this already
      let refVoting = firebase.database().ref('voting/' + user.uid + '/' + id);
      refVoting.once("value").then(function(snapshot) {

        try {

          // if the user hasn't made a vote
          if (snapshot.val().vote === 'null' || snapshot.val().vote === null) {
            context.modifyVote(user.uid, id, 'take', 1, 0);
          } 
          
          // if the user has already voted for take
          if (snapshot.val().vote === 'take') {
            context.modifyVote(user.uid, id, 'null', -1, 0);
          } 
          
          // if the user has previously voted for leave
          if (snapshot.val().vote === 'leave') {
            context.modifyVote(user.uid, id, 'take', 1, -1);
          } 

        } catch {
          context.modifyVote(user.uid, id, 'take', 1, 0);
        }
      });

    } else {
      // user not logged in
    }
  }

  handleLeaveClick() {
    let id = this.state.tioliId;
    let user = firebase.auth().currentUser;
    let context = this;

    if (user) {

      // check if user has voted on this already
      let refVoting = firebase.database().ref('voting/' + user.uid + '/' + id);
      refVoting.once("value").then(function(snapshot) {

        try {

          // if the user hasn't made a vote
          if (snapshot.val().vote === 'null' || snapshot.val().vote === null) {
            context.modifyVote(user.uid, id, 'leave', 0, 1);
          } 
          
          // if the user has already voted for leave
          if (snapshot.val().vote === 'leave') {
            context.modifyVote(user.uid, id, 'null', 0, -1);
          } 
          
          // if the user has previously voted for take
          if (snapshot.val().vote === 'take') {
            context.modifyVote(user.uid, id, 'leave', -1, 1);
          } 

        } catch {
          // snapshot is null
          context.modifyVote(user.uid, id, 'leave', 0, 1);
        }
      });

    } else {
      // user not logged in
    }
  }

  modifyVote(uid, tioliId, state, takeChange, leaveChange) {

    let context = this;

    // increase take counter without changing leave counter 
    let ref = firebase.database().ref('tioli');
    ref.child(tioliId).once("value").then(function(snapshot) {

      // get current votes
      let takeVotes = snapshot.val().takeVotes + takeChange;
      let leaveVotes = snapshot.val().leaveVotes + leaveChange;

      // update vote counter
      firebase.database().ref('tioli/' + tioliId).update({
        takeVotes: takeVotes,
        leaveVotes: leaveVotes
      }).catch((error) => { 
        alert(error);
      });
      
      // set voteStatus state
      context.setState({
        voteStatus: state,
        takeVotes: takeVotes,
        leaveVotes: leaveVotes
      });

      // set voting node to take
      firebase.database().ref('voting/' + uid + '/' + tioliId).update({
        vote: state,
        timestamp: Date.now()
      }).catch((error) => { });
    });
  }

  

  render() { 

    // set if voting is enabled
    let boxVotingClass = "box-voting";
    if (this.state.voteStatus === 'take') {
      boxVotingClass = "box-voting focus-take";
    } else if (this.state.voteStatus === 'leave') {
      boxVotingClass = "box-voting focus-leave";
    } else {
      boxVotingClass = "box-voting focus-both";
    }

    // get votes
    // set width of vote bar
    let takeVotes = this.state.takeVotes;
    let leaveVotes = this.state.leaveVotes;
    let totalVotes = takeVotes + leaveVotes;
    let takeWidth = Math.round(takeVotes / totalVotes * 100);
    let leaveWidth = Math.round(leaveVotes / totalVotes * 100);
    let minTakeWidth = this.refs.takeBtn;
    let minLeaveWidth = this.refs.leaveBtn;

    let votingTakeStyle;
    let votingLeaveStyle;

    if (minTakeWidth && minLeaveWidth) {

      votingTakeStyle = {
        width: takeWidth + '%',
        minWidth: minTakeWidth.clientWidth + 'px'
      }

      votingLeaveStyle = {
        width: leaveWidth + '%',
        minWidth: minLeaveWidth.clientWidth + 'px'
      }
    }

    return ( 
      <React.Fragment>
        <div className={boxVotingClass}>
          <div className="voting-holder green" style={votingTakeStyle}>
            <span className="btn btn-vote" ref="takeBtn" onClick={this.handleTakeClick}>Take it</span>
          </div>
          <div className="voting-holder red" style={votingLeaveStyle}>
            <span className="btn btn-vote btn-right" ref="leaveBtn" onClick={this.handleLeaveClick}>Leave it</span>
          </div>
        </div>

        <div className="box-voting-numbers">
          <div className="voting-take">{this.state.takeVotes}</div>
          <div className="voting-leave">{this.state.leaveVotes}</div>
        </div>
      </React.Fragment>
    );
  }
}
 
export default VotingBox;