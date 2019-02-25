import React, { Component } from 'react';
import firebase from 'firebase';

import PreviewBox from '../components/tioli/previewBox';

class Latest extends Component {

  state = {
    results: []
  }

  componentDidMount() {
    this.getResults(this);
  }

  getResults(context) {
    // get latest submissions
    let ref = firebase.database().ref('tioli');

    let results = [];

    ref.orderByChild('timestamp').limitToFirst(10).once("value").then(function(snapshot) {
      snapshot.forEach(element => {
        results.push(element);
      });

      results.forEach(result => {

        context.setState({ 
          results: context.state.results.concat([{
            id: result.key, 
            question: result.child('question').val(),
            takeVotes: result.child('takeVotes').val(),
            leaveVotes: result.child('leaveVotes').val(),
          }])
        });
      });
    });
  }

  render() { 
    return ( 
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main l_text-centered">
              <h1>Latest</h1>
                
              <div className="box-list">

                {this.state.results.map(item => 
                  <PreviewBox 
                    key={item.id} 
                    id={item.id} 
                    question={item.question} 
                    takeVotes={item.takeVotes} 
                    leaveVotes={item.leaveVotes} 
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
 
export default Latest;