import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import HomeBody from "./HomeBody";
import "./HomePage.scss";

class HomePage extends Component {
  render() {
    return (
      <div className="homepage-container">
        <HomeHeader />
        <HomeBody />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
