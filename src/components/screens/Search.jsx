import React, { Component } from 'react';
import { connect } from "react-redux";
import { getResult } from '../../store/actions/searchActions';
import PreviewBox from '../tioli/previewBox';

class Search extends Component {

  render() { 
    let { result } = this.props;

    return ( 
      <React.Fragment>
        <section className="row content">
          <div className="row-inner-wide">
            <div className="content-main">
              <h2>Search</h2>
              <div className="box-list">

                {result.result && result.result.map(item => 
                  <PreviewBox 
                    key={item.item.key} 
                    id={item.item.key} 
                    question={item.item.question} 
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
    getResult: (query) => dispatch(getResult(query))
  }
}

const mapStateToProps = (state) => {
  return {
    result: state.search
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(Search);