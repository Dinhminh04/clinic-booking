import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios";
import "./HomeBody.scss";

class HomeBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
      clinics: [],
      doctors: [],
    };
  }

  async componentDidMount() {
    let resSpecialty = await axios.get("/api/get-all-specialties");
    let resClinic = await axios.get("/api/get-all-clinics");
    let resDoctor = await axios.get("/api/get-all-doctors");
    if (resSpecialty && resSpecialty.errCode === 0) {
      this.setState({ specialties: resSpecialty.data.slice(0, 8) });
    }
    if (resClinic && resClinic.errCode === 0) {
      this.setState({ clinics: resClinic.data });
    }
    if (resDoctor && resDoctor.errCode === 0) {
      this.setState({ doctors: resDoctor.data.slice(0, 8) });
    }
  }

  render() {
    let { specialties, clinics, doctors } = this.state;
    return (
      <div className="home-body-container">
        {/* Banner */}
        <div className="home-banner">
          <div className="banner-image">
            <img src="/images/banner.jpg" alt="banner" />
          </div>
          <div className="banner-search">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm bác sĩ, phòng khám tại Hải Phòng..."
              />
              <button>Tìm kiếm</button>
            </div>
            <div className="search-filters">
              <select>
                <option>Khu vực</option>
              </select>
              <select>
                <option>Danh mục</option>
              </select>
              <select>
                <option>Mức giá</option>
              </select>
              <select>
                <option>Phòng khám</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danh mục */}
        <div className="home-section">
          <div className="section-header">
            <h2>Danh mục</h2>
            <span className="view-more">XEM THÊM</span>
          </div>
          <div className="category-list">
            <div className="category-item">
              <div className="category-icon">
                <img
                  src="/images/icons/kham-tong-quat.png"
                  alt="Khám tổng quát"
                  onError={(e) =>
                    (e.target.src =
                      "https://cdn.bookingcare.vn/fo/2023/06/07/161350-iconkham-tong-quan.png")
                  }
                />
              </div>
              <span>Khám tổng quát</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <img
                  src="/images/icons/dat-lich.png"
                  alt="Đặt lịch theo khung giờ"
                  onError={(e) =>
                    (e.target.src =
                      "https://cdn.bookingcare.vn/fo/2023/06/07/161905-iconkham-chuyen-khoa.png")
                  }
                />
              </div>
              <span>Đặt lịch theo khung giờ</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <img
                  src="/images/icons/kham-chuyen-khoa.png"
                  alt="Khám chuyên khoa"
                  onError={(e) =>
                    (e.target.src =
                      "https://cdn.bookingcare.vn/fo/2023/06/07/161817-iconkham-tu-xa.png")
                  }
                />
              </div>
              <span>Khám chuyên khoa</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <img
                  src="/images/icons/nam.png"
                  alt="Nam"
                  onError={(e) =>
                    (e.target.src =
                      "https://cdn.bookingcare.vn/fo/2023/06/07/161403-iconsuc-khoe-tinh-than.png")
                  }
                />
              </div>
              <span>Nam</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <img
                  src="/images/icons/nu.png"
                  alt="Nữ"
                  onError={(e) =>
                    (e.target.src =
                      "https://cdn.bookingcare.vn/fo/2023/06/07/161410-iconkham-nha-khoa.png")
                  }
                />
              </div>
              <span>Nữ</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <img
                  src="/images/icons/tre-em.png"
                  alt="Trẻ em"
                  onError={(e) =>
                    (e.target.src =
                      "https://cdn.bookingcare.vn/fo/2023/06/07/161421-icongoi-phau-thuat.png")
                  }
                />
              </div>
              <span>Trẻ em</span>
            </div>
          </div>
        </div>

        {/* Chuyên khoa */}
        <div className="home-section">
          <div className="section-header">
            <h2>Chuyên khoa</h2>
            <span className="view-more">Xem thêm</span>
          </div>
          <div className="specialty-list">
            {specialties.map((specialty, index) => (
              <div className="specialty-item" key={specialty.id}>
                <div className="specialty-image">
                  <img
                    src={`/images/doctor_clinic_speciality/specialty_${specialty.id}.png`}
                    alt={specialty.name}
                    onError={(e) => {
                      const icons = [
                        "https://cdn.bookingcare.vn/fo/2023/12/26/101627-co-xuong-khop.png",
                        "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
                        "https://cdn.bookingcare.vn/fo/2023/12/26/101713-tieu-hoa.png",
                        "https://cdn.bookingcare.vn/fo/2023/12/26/101713-tim-mach.png",
                        "https://cdn.bookingcare.vn/fo/2023/12/26/101713-tai-mui-hong.png",
                        "https://cdn.bookingcare.vn/fo/2023/12/26/101627-cot-song.png",
                        "https://cdn.bookingcare.vn/fo/2023/12/26/101739-y-hoc-co-truyen.png",
                        "https://cdn.bookingcare.vn/fo/2023/12/26/101627-cham-cuu.png",
                      ];
                      e.target.src = icons[index % icons.length];
                    }}
                  />
                </div>
                <span>{specialty.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phòng khám */}
        <div className="home-section gray-bg">
          <div className="section-header">
            <h2>Cơ sở y tế</h2>
            <span className="view-more">Xem thêm</span>
          </div>
          <div className="clinic-list">
            {clinics.map((clinic, index) => (
              <div className="clinic-item" key={clinic.id}>
                <div className="clinic-image">
                  <img
                    src={`/images/clinics/clinic_${clinic.id}.jpg`}
                    alt={clinic.name}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                <span>{clinic.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bác sĩ nổi bật */}
        <div className="home-section">
          <div className="section-header">
            <h2>Bác sĩ nổi bật</h2>
            <span className="view-more">Xem thêm</span>
          </div>
          <div className="doctor-list">
            {doctors.map((doctor) => (
              <div className="doctor-item" key={doctor.id}>
                <div className="doctor-image">
                  <img
                    src={`/images/doctors/doctor_${doctor.id}.jpg`}
                    alt={doctor.firstName}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="doctor-avatar-fallback"
                    style={{ display: "none" }}
                  >
                    {doctor.firstName ? doctor.firstName.charAt(0) : "D"}
                  </div>
                </div>
                <div className="doctor-info">
                  <span className="doctor-name">
                    {doctor.positionId === "P4"
                      ? "GS.TS."
                      : doctor.positionId === "P3"
                        ? "PGS.TS."
                        : doctor.positionId === "P2"
                          ? "TS."
                          : doctor.positionId === "P1"
                            ? "ThS."
                            : "BS."}{" "}
                    {doctor.firstName} {doctor.lastName}
                  </span>
                  <span className="doctor-specialty">
                    {doctor.specialtyName || "Đa khoa"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(HomeBody);
