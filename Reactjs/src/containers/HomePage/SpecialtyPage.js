import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "../../axios";
import HomeHeader from "./HomeHeader";
import "./SpecialtyPage.scss";

class SpecialtyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
    };
  }

  async componentDidMount() {
    let res = await axios.get("/api/get-all-specialties");
    if (res && res.errCode === 0) {
      this.setState({ specialties: res.data });
    }
  }

  handleClickSpecialty = (specialty) => {
    this.props.history.push(`/doctor?specialtyId=${specialty.id}`);
  };

  render() {
    let { specialties } = this.state;
    const icons = [
      "https://cdn.bookingcare.vn/fo/2023/12/26/101627-co-xuong-khop.png",
      "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
      "https://cdn.bookingcare.vn/fo/2023/12/26/101713-tieu-hoa.png",
      "https://cdn.bookingcare.vn/fo/2023/12/26/101713-tim-mach.png",
      "https://cdn.bookingcare.vn/fo/2023/12/26/101713-tai-mui-hong.png",
      "https://cdn.bookingcare.vn/fo/2023/12/26/101627-cot-song.png",
      "https://cdn.bookingcare.vn/fo/2023/12/26/101739-y-hoc-co-truyen.png",
      "https://cdn.bookingcare.vn/fo/2023/12/26/101627-cham-cuu.png",
      "https://cdn.bookingcare.vn/fo/2023/12/26/101713-san-phu-khoa.png",
    ];

    return (
      <div className="specialty-page">
        <HomeHeader />
        <div className="specialty-content">
          <div className="specialty-header">
            <i
              className="fas fa-arrow-left back-btn"
              onClick={() => this.props.history.push("/")}
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

          <div className="specialty-list-container">
            <h2>Danh sách chuyên khoa</h2>
            <div className="specialty-list">
              {specialties.map((specialty, index) => (
                <div
                  className="specialty-row"
                  key={specialty.id}
                  onClick={() => this.handleClickSpecialty(specialty)}
                >
                  <div className="specialty-icon">
                    <img
                      src={`/images/doctor_clinic_speciality/specialty_${specialty.id}.png`}
                      alt={specialty.name}
                      onError={(e) =>
                        (e.target.src = icons[index % icons.length])
                      }
                    />
                  </div>
                  <span className="specialty-name">{specialty.name}</span>
                </div>
              ))}
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
  connect(mapStateToProps, mapDispatchToProps)(SpecialtyPage),
);
