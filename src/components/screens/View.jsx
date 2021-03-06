import React, { Component } from 'react';
import firebase from 'firebase';
import { compose } from 'redux';
import { connect } from "react-redux";
import { firebaseConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import CommentBox from '../tioli/commentBox';
import VotingBox from '../tioli/votingBox';
import moment from 'moment';
import { isEmpty } from '../../helper/functions.js';
import loading from '../../images/loading.svg';

class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      isLoading: true,
      isLoadingComments: false,
      isSubmittingComment: false,
      comment: '',
      isError: false,
      error: '',
      result: [],
      resultComments: [],
      userAvatarUrl: '',
      userVote: null
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.getResult(this, id);
    this.getComments(this, id);
    this.authListener(id);
  }

  authListener(id) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ 
          isLoggedIn: true,
        });
        this.getUserVote(this, id);
      } else {
        this.setState({ 
          isLoggedIn: false,
        });
        this.getUserVote(this, id);
      }
    })
  }

  getResult(context, id) {
    let ref = firebase.database().ref('tioli');

    ref.child(id).once("value").then(function(snapshot) {

      context.setState({ 
        isLoading: false,
        result: {
          question: snapshot.val().question, 
          timestamp: -snapshot.val().timestamp, 
          uid: snapshot.val().uid, 
          username: snapshot.val().username,
          takeVotes: snapshot.val().takeVotes,
          leaveVotes: snapshot.val().leaveVotes
        }
      });

      firebase.storage().ref('images/' + snapshot.val().uid + '/avatar').getDownloadURL().then(result => {
        context.setState({
          userAvatarUrl: result
        });
      }).catch((error) => {
        context.setState({
          userAvatarUrl: null
        });
      });;

    });
  }

  getComments(context, id) {

    // get all comments for question
    let ref = firebase.database().ref('comments/' + id);

    let comments = [];

    ref.orderByChild('timestamp').limitToFirst(10).once("value").then(function(snapshot) {
      snapshot.forEach(element => {
        comments.push(element);

        context.setState({ 
          resultComments: []
        });
      });

      comments.forEach(comment => {

        context.setState({ 
          resultComments: context.state.resultComments.concat([{
            id: comment.key, 
            comment: comment.child('comment').val(), 
            userId: comment.child('uid').val(), 
            timestamp: -comment.child('timestamp').val(),
          }])
        });
      });
    });
  }

  getUserVote(context, id) {

    // check if user is logged in
    let user = firebase.auth().currentUser;

    if (user) {
      
      // get users vote record for tioli
      let ref = firebase.database().ref('voting/' + user.uid + '/' + id);
      ref.once("value").then(function(snapshot) {

        try {

          if (snapshot.val() === null) {

          } else {

            // set the vote state
            if (snapshot.val().vote === 'take') {
              context.setState({
                userVote: 'take'
              });
            } else if (snapshot.val().vote === 'leave') {
              context.setState({
                userVote: 'leave'
              });
            } else {
              context.setState({
                userVote: 'null'
              });
            }
          }
        } catch(error) {

        }
      });
    }
    

  }

  onCommentChange = (event) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  onSubmitComment = (event) => {
    event.preventDefault();

    if (!this.state.isLoggedIn) {
      this.setState({
        error: 'You must be logged in'
      });
      return true;
    }

    this.setState({
      isSubmittingComment: true
    });

    var context = this;

    var user = firebase.auth().currentUser;
    var questionParams = this.props.match.params;
    let comment = this.state.comment;

    // check if comment is empty
    if (isEmpty(comment)) {
      context.setState({
        isError: true, 
        error: 'Please enter a comment', 
        isSubmittingComment: false,
        comment: '',
      });
    } else {
      // get comment id
      var ref = firebase.database().ref('comments/' + questionParams.id).push();

      // submit comment
      firebase.database().ref('comments/' + questionParams.id + '/' + ref.key).update({
        uid: user.uid,
        timestamp: - Date.now(), // store timestamp as negative so firebase displays them is descending order
        comment: comment
      }).then(() => {
        context.setState({
          isSubmittingComment: false,
          comment: '',
          error: ''
        });

        // clear comment textarea
        document.getElementById("comment").value = "";

        // update comments
        let { id } = this.props.match.params;
  
        context.getComments(context, id);
      }).catch((error) => {
        context.setState({error: error.message, isSubmittingComment: false});
      });
    }
  }

  render() { 

    // convert timestamp to date
    let date;
    if (this.state.result.timestamp) {
      date = moment.unix(this.state.result.timestamp / 1000).format("D MMM YYYY \\@ HH:mm a");
    }

    // set loading class
    var LoadingClass = "box-view s_loading";
    if(!this.state.isLoading) {
      LoadingClass = "box-view";
    }

    // show errors if present
    var CommentLoadingClass = "";
    var errorClass = "l_100 errors";
    var errorMessage = "";

    if (this.state.error !== '') {
      errorMessage = this.state.error;
      errorClass = 'field l_100 errors s_active';
    } else {
      errorMessage = this.state.error;
      errorClass = 'field l_100 errors';
    }

    // set avatar image style
    var userAvatarUrl = this.state.userAvatarUrl || null;
    var avatarStyle = {
      backgroundImage: 'url(' + userAvatarUrl + ')',
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%'
    };

    let userLink = '/user/' + this.state.result.username;

    return ( 
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main l_no-margin">

              <div className={LoadingClass}>
                <div className="loading"><img src={loading} alt="" /></div>
                <div className="box-inner">
                  <div className="box-take">{this.state.result.question}</div>
                </div>
                
                <div className="box-details">
                  <div className="avatar-image" style={avatarStyle}></div>
                  <div className="user">By <Link to={userLink}>{this.state.result.username}</Link></div>
                  <div className="date">{date}</div>
                </div>

                <VotingBox 
                  userId={this.state.result.uid}
                  tioliId={this.props.match.params.id}
                  takeVotes={this.state.result.takeVotes}
                  leaveVotes={this.state.result.leaveVotes}
                  voteStatus={this.state.userVote}
                />

              </div>

              <div className="box-comments">
                <div className="comment-submit">
                  <h5>Comments</h5>
                  <form className={CommentLoadingClass} onSubmit={this.onSubmitComment}>
                    <div className="fields">
                      <div className="field l_100">
                        <input type="text" id="comment" className="comment" name="comment" placeholder="Your comment..." value={this.state.comment} onChange={this.onCommentChange} />
                      </div>
                      <div className={errorClass}>
                        <p>{errorMessage}</p>
                      </div>
                      <div className="field l_50">
                        <input className="btn-submit" type="submit" value="Post" />
                        <div className="loading"><img src={loading} alt="" /></div>
                      </div>
                    </div>               
                  </form>
                </div>
                
                <div className="comment-list">

                  {this.state.resultComments.map(item => 
                    <CommentBox 
                      key={item.id} 
                      tioliId={this.props.match.params.id} 
                      tioliAuthorId={this.state.result.uid}
                      commentId={item.id} 
                      comment={item.comment} 
                      userId={item.userId} 
                      timestamp={item.timestamp} 
                    />
                  )}

                </div>

              </div>
                
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    latestTioli: state.firebase.ordered.tioli
  }
}

export default compose(
  connect(mapStateToProps),
  firebaseConnect([
    { path: 'tioli', queryParams: [ 'orderByChild=timestamp', 'limitToFirst=10' ] }
  ])
  )(View);
 