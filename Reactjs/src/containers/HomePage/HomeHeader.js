import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./HomeHeader.scss";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { menuOpen: false };
  }

  render() {
    const { menuOpen } = this.state;
    return (
      <div className="home-header-container">
        <div className="home-header-content">
          {/* Hamburger - chỉ hiện trên mobile */}
          <div
            className="hamburger"
            onClick={() => this.setState({ menuOpen: !menuOpen })}
          >
            <i className="fas fa-bars"></i>
          </div>

          {/* Logo */}
          <div
            className="header-logo"
            onClick={() => this.props.history.push("/")}
          >
            <span className="logo-med">Med</span>
            <span className="logo-care">Care</span>
          </div>

          {/* Nav menu */}
          <div className={`header-nav ${menuOpen ? "open" : ""}`}>
            <div
              className="nav-item"
              onClick={() => this.props.history.push("/specialty")}
            >
              <span>Chuyên khoa</span>
              <p>Tìm bác sĩ theo chuyên khoa</p>
            </div>
            <div
              className="nav-item"
              onClick={() => this.props.history.push("/clinic")}
            >
              <span>Phòng khám</span>
              <p>Chọn bệnh viện phòng khám</p>
            </div>
            <div
              className="nav-item"
              onClick={() => this.props.history.push("/doctor")}
            >
              <span>Bác sĩ HP</span>
              <p>Tìm bác sĩ tại Hải Phòng</p>
            </div>
            <div
              className="nav-item"
              onClick={() => this.props.history.push("/doctor")}
            >
              <span>Đặt lịch khám</span>
              <p>Đặt lịch theo khung giờ</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="header-actions">
            <div className="action-item">
              <i className="fas fa-calendar-check"></i>
              <span>Lịch hẹn</span>
            </div>
            <div className="action-item">
              <i className="fas fa-search"></i>
              <span>Tìm kiếm</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader),
);
