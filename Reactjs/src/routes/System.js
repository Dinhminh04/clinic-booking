import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import AdminLayout from "../containers/System/AdminLayout";
import UserManage from "../containers/System/UserManage";
import ProductManage from "../containers/System/ProductManage";
import RegisterPackageGroupOrAcc from "../containers/System/RegisterPackageGroupOrAcc";
import DoctorManage from "../containers/System/DoctorManage";
import ClinicManage from "../containers/System/ClinicManage";
import SpecialtyManage from "../containers/System/SpecialtyManage";

class System extends Component {
  getPageTitle = (path) => {
    if (path.includes("doctor-manage")) return "Quản lý bác sĩ";
    if (path.includes("clinic-manage")) return "Quản lý phòng khám";
    if (path.includes("specialty-manage")) return "Quản lý chuyên khoa";
    if (path.includes("user-manage")) return "Quản lý người dùng";
    return "Dashboard";
  };

  render() {
    const { systemMenuPath, location } = this.props;
    const pageTitle = this.getPageTitle(location ? location.pathname : "");
    return (
      <AdminLayout pageTitle={pageTitle}>
        <Switch>
          <Route path="/system/user-manage" component={UserManage} />
          <Route path="/system/product-manage" component={ProductManage} />
          <Route
            path="/system/register-package-group-or-account"
            component={RegisterPackageGroupOrAcc}
          />
          <Route path="/system/doctor-manage" component={DoctorManage} />
          <Route path="/system/clinic-manage" component={ClinicManage} />
          <Route path="/system/specialty-manage" component={SpecialtyManage} />
          <Route
            component={() => {
              return <Redirect to={systemMenuPath} />;
            }}
          />
        </Switch>
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  systemMenuPath: state.app.systemMenuPath,
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(System);
