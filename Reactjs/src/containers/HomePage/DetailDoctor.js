import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "../../axios";
import HomeHeader from "./HomeHeader";
import "./DetailDoctor.scss";

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: null,
      selectedDate: 0,
      showDateDropdown: false,
      selectedTime: null,
      bookingSuccess: false,
      bookingError: "",
    };
    this.dropdownRef = React.createRef();
  }

  async componentDidMount() {
    let id = this.props.match.params.id;
    let res = await axios.get("/api/get-all-doctors");
    if (res && res.errCode === 0) {
      let doctor = res.data.find((d) => d.id === parseInt(id));
      this.setState({ doctor });
    }
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(e.target)
    ) {
      this.setState({ showDateDropdown: false });
    }
  };

  getPositionName = (positionId) => {
    let positions = {
      P0: "Bác sĩ",
      P1: "Thạc sĩ, Bác sĩ",
      P2: "Tiến sĩ, Bác sĩ",
      P3: "PGS.TS, Bác sĩ",
      P4: "GS.TS, Bác sĩ",
    };
    return positions[positionId] || "Bác sĩ";
  };

  getImageSrc(doctor) {
    if (!doctor.image) return null;
    if (doctor.image.startsWith("http")) return doctor.image;
    return `data:image/jpeg;base64,${doctor.image}`;
  }

  getDays = () => {
    const days = [
      "Chủ Nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const result = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push({
        label: i === 0 ? "Hôm nay" : days[d.getDay()],
        date: d.getDate(),
        month: d.getMonth() + 1,
        full: d,
      });
    }
    return result;
  };

  timeSlots = [
    "08:00 - 08:30",
    "08:30 - 09:00",
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "11:00 - 11:30",
    "11:30 - 12:00",
    "13:00 - 13:30",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
    "15:00 - 15:30",
    "15:30 - 16:00",
    "16:00 - 16:30",
    "16:30 - 17:00",
  ];

  handleBooking = async () => {
    const { isLoggedIn, adminInfo } = this.props;
    if (!isLoggedIn) {
      const currentPath = this.props.location.pathname;
      this.props.history.push(
        `/login?redirect=${encodeURIComponent(currentPath)}`,
      );
      return;
    }
    const { doctor, selectedTime, selectedDate } = this.state;
    if (!selectedTime) return;
    const days = this.getDays();
    const chosenDate = days[selectedDate].full;
    try {
      let res = await axios.post("/api/create-booking", {
        doctorId: doctor.id,
        patientID: adminInfo.id,
        date: chosenDate.toISOString(),
        timeType: selectedTime,
        statusId: "S1",
      });
      if (res && res.errCode === 0) {
        this.setState({
          bookingSuccess: true,
          bookingError: "",
          selectedTime: null,
        });
      } else {
        this.setState({ bookingError: res.errMessage || "Có lỗi xảy ra!" });
      }
    } catch (e) {
      this.setState({ bookingError: "Có lỗi xảy ra, vui lòng thử lại!" });
    }
  };

  render() {
    let {
      doctor,
      selectedTime,
      selectedDate,
      showDateDropdown,
      bookingSuccess,
      bookingError,
    } = this.state;
    const { isLoggedIn } = this.props;
    if (!doctor) return <div className="loading">Đang tải...</div>;

    const imgSrc = this.getImageSrc(doctor);
    const days = this.getDays();
    const currentDay = days[selectedDate];

    return (
      <div className="detail-doctor-page">
        <HomeHeader />

        <div className="detail-header">
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

        <div className="detail-content">
          <div className="detail-main">
            <div className="detail-left">
              {/* Doctor profile */}
              <div className="doctor-profile">
                <div className="doctor-avatar">
                  {imgSrc ? (
                    <img src={imgSrc} alt={doctor.firstName} />
                  ) : (
                    <div className="avatar-fallback">
                      {doctor.firstName ? doctor.firstName.charAt(0) : "D"}
                    </div>
                  )}
                </div>
                <div className="doctor-detail">
                  <h2>
                    {this.getPositionName(doctor.positionId)} {doctor.firstName}{" "}
                    {doctor.lastName}
                  </h2>
                  <p className="doctor-desc">
                    Bác sĩ chuyên khoa {doctor.specialtyName} tại{" "}
                    {doctor.clinicName}
                  </p>
                  <p className="doctor-location">
                    <i className="fas fa-map-marker-alt"></i> Hải Phòng
                  </p>
                  <div className="doctor-btns">
                    <button className="btn-consult">Tư vấn sâu</button>
                    <button className="btn-share">Chia sẻ</button>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="schedule-section">
                {/* Dropdown chọn ngày - giống BookingCare */}
                <div className="date-dropdown-wrap" ref={this.dropdownRef}>
                  <div
                    className="date-dropdown-trigger"
                    onClick={() =>
                      this.setState({ showDateDropdown: !showDateDropdown })
                    }
                  >
                    <i className="fas fa-calendar"></i>
                    <span>
                      {currentDay.label} - {currentDay.date}/{currentDay.month}
                    </span>
                    <i
                      className={`fas fa-chevron-down arrow ${showDateDropdown ? "open" : ""}`}
                    ></i>
                  </div>

                  {showDateDropdown && (
                    <div className="date-dropdown-list">
                      {days.map((day, index) => (
                        <div
                          key={index}
                          className={`date-dropdown-item ${selectedDate === index ? "active" : ""}`}
                          onClick={() =>
                            this.setState({
                              selectedDate: index,
                              selectedTime: null,
                              showDateDropdown: false,
                              bookingSuccess: false,
                            })
                          }
                        >
                          {day.label} - {day.date}/{day.month}
                        </div>
                      ))}
                      <div
                        className="date-dropdown-item skip"
                        onClick={() =>
                          this.setState({ showDateDropdown: false })
                        }
                      >
                        Bỏ qua
                      </div>
                    </div>
                  )}
                </div>

                <div className="schedule-label">
                  <i className="fas fa-calendar-alt"></i> LỊCH KHÁM
                </div>

                <div className="time-slots">
                  {this.timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`time-slot ${selectedTime === slot ? "selected" : ""}`}
                      onClick={() =>
                        this.setState({
                          selectedTime: slot,
                          bookingSuccess: false,
                        })
                      }
                    >
                      {slot}
                    </div>
                  ))}
                </div>

                <p className="schedule-note">
                  Chọn <i className="fas fa-hand-pointer"></i> và đặt (Phí đặt
                  lịch 0đ)
                </p>
                <p className="schedule-hint">
                  <i className="fas fa-info-circle"></i> Đây là lịch khám dự
                  kiến (cập nhật theo tuần)
                </p>
              </div>

              {/* Doctor description */}
              <div className="doctor-description">
                <h3>
                  {this.getPositionName(doctor.positionId)} {doctor.firstName}{" "}
                  {doctor.lastName}
                </h3>
                <p>
                  Bác sĩ chuyên khoa {doctor.specialtyName} với nhiều năm kinh
                  nghiệm khám và điều trị tại {doctor.clinicName}, Hải Phòng.
                </p>
                <p>Địa chỉ: {doctor.address || "Hải Phòng"}</p>
                <p>Điện thoại: {doctor.phonenumber}</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="detail-right">
              <div className="clinic-info">
                <h4>ĐỊA CHỈ KHÁM</h4>
                <p className="clinic-name">{doctor.clinicName}</p>
                <p className="clinic-address">
                  {doctor.address || "Hải Phòng"}
                </p>
                <div className="price-info">
                  <span className="price-label">GIÁ KHÁM:</span>
                  <span className="price-value">175.000đ</span>
                  <span className="price-detail">Xem chi tiết</span>
                </div>
              </div>

              <div className="booking-confirm">
                <h4>Đặt lịch khám</h4>
                {bookingSuccess ? (
                  <div className="booking-success">
                    <i className="fas fa-check-circle"></i>
                    <p>Đặt lịch thành công!</p>
                    <span>Chúng tôi sẽ liên hệ xác nhận sớm nhất.</span>
                  </div>
                ) : (
                  <>
                    <p className="booking-date">
                      <i className="fas fa-calendar"></i> {currentDay.label} -{" "}
                      {currentDay.date}/{currentDay.month}
                    </p>
                    {selectedTime ? (
                      <p>
                        Khung giờ: <strong>{selectedTime}</strong>
                      </p>
                    ) : (
                      <p className="no-time">Vui lòng chọn khung giờ</p>
                    )}
                    {bookingError && (
                      <p className="booking-error">{bookingError}</p>
                    )}
                    <button
                      className={`btn-book ${!selectedTime ? "disabled" : ""}`}
                      onClick={this.handleBooking}
                      disabled={!selectedTime}
                    >
                      {!isLoggedIn ? (
                        <>
                          <i className="fas fa-sign-in-alt"></i> Đăng nhập để
                          đặt lịch
                        </>
                      ) : (
                        <>
                          <i className="fas fa-calendar-check"></i> Xác nhận đặt
                          lịch
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.admin.isLoggedIn,
  adminInfo: state.admin.adminInfo,
});
const mapDispatchToProps = (dispatch) => ({});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DetailDoctor),
);
