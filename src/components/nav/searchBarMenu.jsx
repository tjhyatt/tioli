import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { getResult } from '../../store/actions/searchActions';
import searchIcon from '../../images/search.svg';

class SearchBarMenu extends Component {

  state = {
    query: '',
    isSubmitted: false
  }

  onSubmitSearch = (event) => {
    event.preventDefault();
    this.setState({
      isSubmitted: true
    });
    this.props.onMenuToggle();
    this.props.getResult(this.state.query);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.result !== null && this.state.isSubmitted) {
      this.setState({
        isSubmitted: false
      });
      this.props.history.push('/search');
    }
  }

  onSearchChange = (event) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  render() {
    return ( 
      <React.Fragment>
        <li className="full-width no-hover">
          <form className="form-search" onSubmit={this.onSubmitSearch}>
            <input className="nav-search" type="text" name="query" placeholder="search..." onChange={this.onSearchChange}/>
            <img className="btn-search" src={searchIcon} alt="search" onClick={this.onSubmitSearch} />
          </form>
        </li>
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
 
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBarMenu));