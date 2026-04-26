import React, { Component } from "react";
import { connect } from "react-redux";
import HomePage from "../containers/HomePage/HomePage";

class Home extends Component {
  render() {
    return <HomePage />;
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.admin.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
