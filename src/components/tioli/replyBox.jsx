import React, { Component } from 'react';
import firebase from 'firebase';

// import loading from '../../images/loading.svg';

class ReplyBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tioliId: props.tioliId,
      tioliAuthorId: props.tioliAuthorId,
      replyId: props.replyId,
      reply: props.reply,
      userId: props.userId,
      username: '',
      userAvatarUrl: '',
      timestamp: props.timestamp,
      isSubmittingReply: false,
    };
  }

  componentDidMount() {
    //console.log('doit '+this.state.userId);
    this.getUserData(this, this.state.userId);
  }

  getUserData(context, id) {

    let ref = firebase.database().ref('users/');

    ref.child(id).once("value").then(function(snapshot) {
      context.setState({username: snapshot.val().username});
    });

    firebase.storage().ref('images/' + id + '/avatar').getDownloadURL().then(result => {
      this.setState({
        userAvatarUrl: result
      });
    });
  }

  onAction() {
    alert('hi');
  }

  onReplyChange = (event) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  onSubmitReply = (event) => {
    event.preventDefault();
    this.setState({isSubmittingReply: true});

    var context = this;

    var user = firebase.auth().currentUser;
    let reply = this.state.reply;

    // get reply id
    var ref = firebase.database().ref('replies/' + context.state.replyId).push();

    // submit reply
    firebase.database().ref('replies/' + context.state.replyId + '/' + ref.key).set({
      uid: user.uid,
      timestamp: - Date.now(), // store timestamp as negative so firebase displays them is descending order
      reply: reply
    }).then(() => {
      context.setState({isSubmittingReply: false});

      // clear comment textarea
      document.getElementById("reply").value = "";

      // update reply
      // const { id } = this.props.match.params;
      // context.getComments(context, id);
    }).catch((error) => {
      context.setState({error: error.message, isSubmittingReply: false});
    });
  }

  render() { 
    let date;
    const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    if (this.state.timestamp) {
      date = new Date(this.state.timestamp).toLocaleDateString('en-US', DATE_OPTIONS);
      date = date.replace(/,/g, ' ');
    }

    // var CommentLoadingClass = "";
    // var ErrorClass = "l_100 errors";
    // var ErrorMessage = "";

    var avatarStyle = {
      backgroundImage: 'url(' + this.state.userAvatarUrl + ')',
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%'
    };

    let AuthorElement = null;
    if (this.state.tioliAuthorId === this.state.userId) {
      AuthorElement = <span className="author">poster</span>;
    }

    return ( 
      <div className="comment-box">
        <div className="comment-user-avatar" style={avatarStyle}></div>
        <div className="comment-details">
          
          <div className="comment-data">
            <div className="comment-username">
              {this.state.username} {AuthorElement}
            </div>
            <div className="comment-date">
              {date}
            </div>
          </div>
          <div className="comment-body">
            {this.props.reply}
          </div>
          <div className="comment-actions" onClick={this.onAction}></div>
          

        </div>
      </div>
    );
  }
}
 
export default ReplyBox;