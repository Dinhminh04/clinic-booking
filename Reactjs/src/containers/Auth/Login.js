import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import axios from "../../axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errMessage: "",
    };
  }

  handleOnChangeEmail = (e) => this.setState({ email: e.target.value });
  handleOnChangePassword = (e) => this.setState({ password: e.target.value });

  handleLogin = async () => {
    this.setState({ errMessage: "" });
    try {
      let res = await axios.post("/api/login", {
        email: this.state.email,
        password: this.state.password,
      });

      if (res && res.errCode !== 0) {
        this.setState({ errMessage: res.message });
        return;
      }

      if (res && res.errCode === 0) {
        this.props.adminLoginSuccess(res.user);

        const params = new URLSearchParams(this.props.location?.search);
        const redirectTo = params.get("redirect");
        const role = res.user.roleId;

        if (role === "R1") {
          this.props.navigate("/system/user-manage");
        } else if (role === "R3" && redirectTo) {
          this.props.navigate(decodeURIComponent(redirectTo));
        } else {
          this.props.navigate("/");
        }
      }
    } catch (e) {
      if (e.response) {
        this.setState({ errMessage: e.response.data.message });
      }
    }
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") this.handleLogin();
  };

  render() {
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content row">
            <div className="col-12 text-login">Đăng nhập</div>

            <div className="col-12 form-group login-input">
              <label>Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập email của bạn"
                value={this.state.email}
                onChange={this.handleOnChangeEmail}
                onKeyDown={this.handleKeyDown}
              />
            </div>

            <div className="col-12 form-group login-input">
              <label>Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={this.state.password}
                onChange={this.handleOnChangePassword}
                onKeyDown={this.handleKeyDown}
              />
            </div>

            {this.state.errMessage && (
              <div className="col-12">
                <span className="text-danger">{this.state.errMessage}</span>
              </div>
            )}

            <div className="col-12">
              <button className="btn-login" onClick={this.handleLogin}>
                Đăng nhập
              </button>
            </div>

            <div className="col-12">
              <span className="forgot-password">Quên mật khẩu?</span>
            </div>

            {/* Divider */}
            <div
              className="col-12"
              style={{
                textAlign: "center",
                color: "#aaa",
                margin: "8px 0",
                fontSize: "13px",
              }}
            >
              hoặc đăng nhập với
            </div>

            {/* Social login */}
            <div className="col-12">
              <div className="social-login">
                <div className="google" title="Đăng nhập với Google">
                  <i className="fab fa-google"></i>
                </div>
                <div className="facebook" title="Đăng nhập với Facebook">
                  <i className="fab fa-facebook-f"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
  navigate: (path) => dispatch(push(path)),
  adminLoginSuccess: (adminInfo) =>
    dispatch(actions.adminLoginSuccess(adminInfo)),
  adminLoginFail: () => dispatch(actions.adminLoginFail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
