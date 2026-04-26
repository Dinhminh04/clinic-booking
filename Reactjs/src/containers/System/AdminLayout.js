import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from "../../store/actions";
import "./AdminLayout.scss";

class AdminLayout extends Component {
  render() {
    const { processLogout } = this.props;
    return (
      <div className="admin-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <span className="logo-text">MedCare HP</span>
          </div>
          <div className="sidebar-menu">
            <div className="menu-section">
              <span className="menu-section-title">TỔNG QUAN</span>
              <NavLink
                to="/system/dashboard"
                className="menu-item"
                activeClassName="active"
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </NavLink>
            </div>
            <div className="menu-section">
              <span className="menu-section-title">QUẢN LÝ</span>
              <NavLink
                to="/system/doctor-manage"
                className="menu-item"
                activeClassName="active"
              >
                <i className="fas fa-user-md"></i>
                <span>Bác sĩ</span>
              </NavLink>
              <NavLink
                to="/system/clinic-manage"
                className="menu-item"
                activeClassName="active"
              >
                <i className="fas fa-hospital"></i>
                <span>Phòng khám</span>
              </NavLink>
              <NavLink
                to="/system/specialty-manage"
                className="menu-item"
                activeClassName="active"
              >
                <i className="fas fa-stethoscope"></i>
                <span>Chuyên khoa</span>
              </NavLink>
              <NavLink
                to="/system/booking-manage"
                className="menu-item"
                activeClassName="active"
              >
                <i className="fas fa-calendar-check"></i>
                <span>Lịch hẹn</span>
              </NavLink>
            </div>
          </div>
          <div className="sidebar-footer">
            <div className="admin-info">
              <div className="admin-avatar">AD</div>
              <div className="admin-detail">
                <span className="admin-name">Admin</span>
                <span className="admin-role">Quản trị viên</span>
              </div>
            </div>
            <button className="btn-logout" onClick={processLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          <div className="top-bar">
            <span className="page-title">
              Trang chủ / {this.props.pageTitle}
            </span>
            <span className="current-date">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
          <div className="content-area">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.admin.isLoggedIn,
});
const mapDispatchToProps = (dispatch) => ({
  processLogout: () => dispatch(actions.processLogout()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout);
