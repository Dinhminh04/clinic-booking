import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../store/actions";
import { KeyCodeUtils } from "../utils";
import userIcon from "../../src/assets/images/user.svg";
import passIcon from "../../src/assets/images/pass.svg";
import "./Login.scss";
import axios from "../axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.btnLogin = React.createRef();
  }

  state = {
    username: "",
    password: "",
    loginError: "",
  };

  onUsernameChange = (e) => this.setState({ username: e.target.value });
  onPasswordChange = (e) => this.setState({ password: e.target.value });

  processLogin = async () => {
    const { username, password } = this.state;
    this.setState({ loginError: "" });

    try {
      let res = await axios.post("/api/login", {
        email: username,
        password: password,
      });

      if (res && res.errCode !== 0) {
        this.setState({
          loginError: res.message || "Sai tài khoản hoặc mật khẩu!",
        });
        return;
      }

      if (res && res.errCode === 0) {
        // Chỉ cho Admin (R1) vào trang system
        if (res.user.roleId !== "R1") {
          this.setState({ loginError: "Tài khoản không có quyền truy cập!" });
          return;
        }
        this.props.adminLoginSuccess(res.user);
        this.props.navigate("/system/user-manage");
      }
    } catch (e) {
      this.setState({ loginError: "Có lỗi xảy ra, vui lòng thử lại!" });
    }
  };

  handlerKeyDown = (event) => {
    const keyCode = event.which || event.keyCode;
    if (keyCode === KeyCodeUtils.ENTER) {
      event.preventDefault();
      if (!this.btnLogin.current || this.btnLogin.current.disabled) return;
      this.btnLogin.current.click();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handlerKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handlerKeyDown);
    this.setState = () => {};
  }

  render() {
    const { username, password, loginError } = this.state;

    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="form_login">
            <h2 className="title">Admin Login</h2>

            <div className="form-group icon-true">
              <img className="icon" src={userIcon} alt="user" />
              <input
                placeholder="Email"
                type="text"
                className="form-control"
                value={username}
                onChange={this.onUsernameChange}
              />
            </div>

            <div className="form-group icon-true">
              <img className="icon" src={passIcon} alt="pass" />
              <input
                placeholder="Mật khẩu"
                type="password"
                className="form-control"
                value={password}
                onChange={this.onPasswordChange}
              />
            </div>

            {loginError && (
              <div className="login-error">
                <span className="login-error-message">{loginError}</span>
              </div>
            )}

            <div className="form-group login">
              <input
                ref={this.btnLogin}
                type="submit"
                className="btn"
                value="Đăng nhập"
                onClick={this.processLogin}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lang: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
  navigate: (path) => dispatch(push(path)),
  adminLoginSuccess: (adminInfo) =>
    dispatch(actions.adminLoginSuccess(adminInfo)),
  adminLoginFail: () => dispatch(actions.adminLoginFail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
