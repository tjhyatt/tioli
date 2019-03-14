import React, { Component } from 'react';
import firebase from 'firebase';
import ReplyBox from '../tioli/replyBox';

import loading from '../../images/loading.svg';

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tioliId: props.tioliId,
      tioliAuthorId: props.tioliAuthorId,
      commentId: props.commentId,
      comment: props.comment,
      userId: props.userId,
      username: '',
      userAvatarUrl: '',
      timestamp: props.timestamp,
      reply: '',
      replies: [],
      isSubmittingReply: false,
      isReplyVisible: false
    };
  }

  componentDidMount() {
    //console.log('doit '+this.state.userId);
    this.getUserData(this, this.state.userId);
    this.getReplies(this, this.state.commentId);
  }

  isEmpty(text) {
    var isEmpty = false;
    if (text.length === 0 || !text.replace(/\s+/, '').length || text == null) {
      isEmpty = true;
    }
    
    return isEmpty;
  }

  getUserData(context, id) {
    let ref = firebase.database().ref('users');
    let imageRef = firebase.storage().ref('images/' + id + '/avatar');

    imageRef.getDownloadURL().then(result => {
      this.setState({
        userAvatarUrl: result
      });
    }).catch((err) => {
      this.setState({
        userAvatarUrl: null
      });
    });

    ref.child(id).once("value").then(function(snapshot) {
      context.setState({
        username: snapshot.val().username
      });
    });
  }

  onRevealReply = () => {
    if (this.state.isReplyVisible) {
      this.setState({isReplyVisible: false});
    } else {
      this.setState({isReplyVisible: true});
    }
  }


  getReplies(context, id) {

    var replies = [];

    let ref = firebase.database().ref('replies/' + id);

    ref.orderByChild('timestamp').once("value").then(function(snapshot) {

      snapshot.forEach(element => {
        replies.push(element);

        context.setState({ 
          replies: []
        });
      });

      replies.forEach(reply => {

        context.setState({ 
          replies: context.state.replies.concat([{id: reply.key, reply: reply.child('reply').val(), userId: reply.child('uid').val(), timestamp: reply.child('timestamp').val()}])
        });
      });
      
    });


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

    // check if input is empty
    if (this.isEmpty(reply)){

    } else {

      // get reply id
      var ref = firebase.database().ref('replies/' + context.state.commentId).push();

      // submit reply
      firebase.database().ref('replies/' + context.state.commentId + '/' + ref.key).set({
        uid: user.uid,
        timestamp: Date.now(),
        reply: reply
      }).then(() => {
        context.setState({isSubmittingReply: false});

        // clear comment textarea
        document.getElementById("reply").value = "";
        context.setState({reply: ''});

        // update reply
        const commentId = context.state.commentId;
        context.getReplies(context, commentId);
      }).catch((error) => {
        context.setState({error: error.message, isSubmittingReply: false});
      });
    }
  }

  render() { 
    let date;
    const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    if (this.state.timestamp) {
      date = new Date(this.state.timestamp).toLocaleDateString('en-US', DATE_OPTIONS);
      date = date.replace(/,/g, ' ');
    }

    var CommentLoadingClass = "box-reply";
    if (this.state.isReplyVisible) {
      CommentLoadingClass = "box-reply s_active";
    }
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
            {this.props.comment}
          </div>
          <div className="comment-actions" onClick={this.onRevealReply}>reply</div>

          {/* reply to comment */}
          <form className={CommentLoadingClass} onSubmit={this.onSubmitReply}>
            <input type="text" id="reply" className="reply" name="reply" placeholder="Your reply..." value={this.state.question} onChange={this.onReplyChange} />
            <input className="btn-submit btn-reply" type="submit" value="Post" />
            <div className="loading"><img src={loading} alt="" /></div>
          </form>

          {/* list of replies */}
          <div className="reply-list">

            {this.state.replies.map(item => 
              <ReplyBox 
                key={item.id} 
                reply={item.reply} 
                userId={item.userId} 
                tioliAuthorId={this.state.tioliAuthorId}
                timestamp={item.timestamp}
              />
            )}

          </div>

        </div>
      </div>
    );
  }
}
 
export default CommentBox;