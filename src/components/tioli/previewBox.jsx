import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PreviewBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: props.question,
      id: props.id,
      takeVotes: props.takeVotes,
      leaveVotes: props.leaveVotes
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    let boxTake = this.refs.boxTake;
    let boxTakeWidth = boxTake.getAttribute('data-width');
    let boxLeave = this.refs.boxLeave;
    let boxLeaveWidth = boxLeave.getAttribute('data-width');

    boxTake.style.width = boxTakeWidth + '%';
    boxTake.style.opacity = '.8';
    boxLeave.style.width = boxLeaveWidth + '%';
    boxLeave.style.opacity = '.8';
  }

  handleMouseLeave() {
    let boxTake = this.refs.boxTake;
    let boxLeave = this.refs.boxLeave;

    boxTake.style.width = '4px';
    boxTake.style.opacity = '.5';
    boxLeave.style.width = '4px';
    boxLeave.style.opacity = '.5';
  }

  render() { 
    let takeVotes = this.state.takeVotes;
    let leaveVotes = this.state.leaveVotes
    let totalVotes = takeVotes + leaveVotes;
    let takeWidth = Math.round(takeVotes / totalVotes * 100);
    let leaveWidth = Math.round(leaveVotes / totalVotes * 100);

    if (isNaN(takeWidth)) {
      takeWidth = 0
    }

    if (isNaN(leaveWidth)) {
      leaveWidth = 0
    }

    return ( 
      <Link className="box-preview" to={'/view/' + this.state.id} onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.handleMouseLeave}>
        <div className="box-inner">
          <div className="box-content">
            <div className="contents">{this.state.question}</div>
          </div>
          <div className="box-take" ref="boxTake" data-width={takeWidth}></div>
          <div className="box-leave" ref="boxLeave" data-width={leaveWidth}></div>
        </div>
      </Link>
    );
  }
}
 
export default PreviewBox;