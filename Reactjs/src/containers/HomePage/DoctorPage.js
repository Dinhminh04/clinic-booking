import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "../../axios";
import HomeHeader from "./HomeHeader";
import "./DoctorPage.scss";

class DoctorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      loading: true,
    };
  }

  async componentDidMount() {
    let specialtyId = new URLSearchParams(this.props.location.search).get(
      "specialtyId",
    );
    let url = specialtyId
      ? `/api/get-all-doctors?specialtyId=${specialtyId}`
      : "/api/get-all-doctors";
    let res = await axios.get(url);
    if (res && res.errCode === 0) {
      this.setState({ doctors: res.data, loading: false });
    } else {
      this.setState({ loading: false });
    }
  }

  getPositionName = (positionId) => {
    let positions = {
      P0: "BS.",
      P1: "ThS. Bác sĩ",
      P2: "TS. Bác sĩ",
      P3: "PGS.TS. Bác sĩ",
      P4: "GS.TS. Bác sĩ",
    };
    return positions[positionId] || "BS.";
  };

  getImageSrc(doctor) {
    if (!doctor.image) return null;
    if (doctor.image.startsWith("http")) return doctor.image;
    return `data:image/jpeg;base64,${doctor.image}`;
  }

  render() {
    let { doctors, loading } = this.state;

    return (
      <div className="doctor-page">
        <HomeHeader />

        {/* Thanh xanh mỏng - y hệt Specialty/Clinic */}
        <div className="doctor-header">
          <i
            className="fas fa-arrow-left back-btn"
            onClick={() => this.props.history.goBack()}
          ></i>
          <div className="header-actions">
            <div className="action-item">
              <i className="fas fa-calendar-check"></i>
              <span>Lịch hẹn</span>
            </div>
            <div className="action-item">
              <i className="fas fa-question-circle"></i>
              <span>Hỗ trợ</span>
            </div>
          </div>
        </div>

        <div className="doctor-content">
          <div className="doctor-list-container">
            <h2>Danh sách bác sĩ</h2>

            {loading ? (
              <div className="no-doctor">
                <p>Đang tải...</p>
              </div>
            ) : (
              <div className="doctor-list">
                {doctors && doctors.length > 0 ? (
                  doctors.map((doctor) => {
                    const imgSrc = this.getImageSrc(doctor);
                    return (
                      <div
                        className="doctor-row"
                        key={doctor.id}
                        onClick={() =>
                          this.props.history.push(`/detail-doctor/${doctor.id}`)
                        }
                      >
                        <div className="doctor-avatar">
                          {imgSrc ? (
                            <img src={imgSrc} alt={doctor.firstName} />
                          ) : (
                            <div className="avatar-fallback">
                              {doctor.firstName
                                ? doctor.firstName.charAt(0)
                                : "D"}
                            </div>
                          )}
                        </div>
                        <div className="doctor-info">
                          <span className="doctor-name">
                            {this.getPositionName(doctor.positionId)}{" "}
                            {doctor.firstName} {doctor.lastName}
                          </span>
                          <span className="doctor-specialty">
                            {doctor.specialtyName || "Đa khoa"}
                          </span>
                          {doctor.clinicName && (
                            <span className="doctor-clinic">
                              <i className="fas fa-hospital-alt"></i>{" "}
                              {doctor.clinicName}
                            </span>
                          )}
                        </div>
                        <div className="doctor-arrow">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-doctor">
                    <i className="fas fa-user-md"></i>
                    <p>Chưa có bác sĩ trong chuyên khoa này</p>
                    <button
                      className="btn-back"
                      onClick={() => this.props.history.push("/specialty")}
                    >
                      Xem chuyên khoa khác
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorPage),
);
