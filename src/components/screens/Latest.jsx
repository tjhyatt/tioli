import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from "react-redux";
import { firebaseConnect } from 'react-redux-firebase';
import PreviewBox from '../tioli/previewBox';

class Latest extends Component {

  render() { 
    const { latestTioli } = this.props;

    console.log(latestTioli)
    
    return ( 
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main">
              <h1>Latest</h1>
                
              <div className="box-list">
              
                {latestTioli && latestTioli.map(item => 
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

const mapStateToProps = (state) => {
  
  return {
    latestTioli: state.firebase.ordered.tioli
  }
}
 
export default compose(
  connect(mapStateToProps),
  firebaseConnect([
    { path: 'tioli', queryParams: [ 'orderByChild=timestamp', 'limitToFirst=10' ] }
  ])
  )(Latest);
