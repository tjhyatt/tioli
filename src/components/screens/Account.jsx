import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { signOut } from '../../store/actions/authActions';
import firebase from 'firebase';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadImage: null,
      uploadUrl: '',
      uploadError: '',
      isUploadReady: false
    }
  }

  onSignOut = e => {
    try {
      this.props.signOut();
    } catch (e) {

    }
  }

  onUploadImage = () => {
    if (!this.state.isUploadReady) {
      return true;
    }

    let user = firebase.auth().currentUser;
    const {uploadImage} = this.state;

    if (uploadImage.type === 'image/gif' || uploadImage.type === 'image/jpeg' ||uploadImage.type === 'image/png') {
      const filesize = uploadImage.size;
      const upload = firebase.storage().ref('images/' + user.uid + '/avatar').put(uploadImage);

      upload.on('state_changed', 
      (snapshot) => {
        var percentage = Math.ceil(snapshot.bytesTransferred / filesize * 100);
        var button  = document.getElementById('uploadBtn');
        button.innerText = "" + percentage + "%";
      }, 
      (error) => {
        this.setState({
          //uploadError: error,
        });
      }, 
      () => {
        firebase.storage().ref('images/' + user.uid + '/avatar').getDownloadURL().then(url => {
          //this.setState({uploadUrl: url});
        });
        var button  = document.getElementById('uploadBtn');
        button.innerText = "Upload image";
      });
    } else {
      this.setState({
        //uploadError: 'Unexpected error occured, please try again'
      });
    }
  }

  onUploadChange = (event) => {
    if (event.target.files[0]) {
      const image = event.target.files[0];

      if (image.size > 2097152) {
        this.setState({
          uploadError: 'File size is too large',
          isUploadReady: false
        });
      } else if (image.type === 'image/gif' || image.type === 'image/jpeg' || image.type === 'image/png') {
        this.setState({
          uploadImage: image,
          uploadError: '',
          isUploadReady: true
        });
      } else {
        this.setState({
          uploadError: 'Wrong file type',
          isUploadReady: false
        });
      }
    }
  }

  render() { 
    // redirect if not logged in
    const { auth } = this.props;
    if (!auth.uid) {
      return <Redirect to="/login" />
    } else {

      firebase.storage().ref('images/' + auth.uid + '/avatar').getDownloadURL().then(result => {
        this.setState({
          uploadUrl: result
        });
      }).catch((err) => {
        console.log(err);
      });
    }

    var avatarStyle = {
      backgroundImage: 'url(' + this.state.uploadUrl + ')',
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%'
    };

    var uploadBtnClass = 'btn disabled';
    if (this.state.isUploadReady) {
      uploadBtnClass = 'btn';
    }

    var errorClass = 'setting-error hidden';
    if (this.state.uploadError !== '') {
      errorClass = 'setting-error';
    }



    return ( 
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main">
              <h1>Account</h1>
              <div className="account-setting">
                <div className="setting-title"><strong>Change profile image</strong><p><small>Max file size 2MB</small></p></div>
                <div className="setting-box">
                  <div className="avatar-image" style={avatarStyle}></div>
                  <div className="setting-input">
                    <input type="file" onChange={this.onUploadChange} />
                  </div>


                  <div className="setting-change">
                    <button id="uploadBtn" className={uploadBtnClass} onClick={() => this.onUploadImage()}>Upload image</button>
                  </div>
                  <div className={errorClass}>
                    <div className="error-message">{this.state.uploadError}</div>
                  </div>
                </div>
              </div>
              
              <button className="btn warning" onClick={() => this.onSignOut()}>logout</button>
              
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
 
const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(Account);
