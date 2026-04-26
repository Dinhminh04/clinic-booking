import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "../../axios";
import HomeHeader from "./HomeHeader";
import "./ClinicPage.scss";

class ClinicPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinics: [],
      activeLetter: null,
      searchText: "",
    };
  }

  async componentDidMount() {
    let res = await axios.get("/api/get-all-clinics");
    if (res && res.errCode === 0) {
      this.setState({ clinics: res.data });
    }
  }

  getImageSrc(clinic) {
    if (clinic.image) {
      if (clinic.image.startsWith("http")) return clinic.image;
      return `data:image/jpeg;base64,${clinic.image}`;
    }
    return null;
  }

  getFilteredClinics() {
    const { clinics, activeLetter, searchText } = this.state;
    let filtered = [...clinics];

    if (searchText.trim()) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (activeLetter) {
      if (activeLetter === "#") {
        filtered = filtered.filter((c) => !/^[a-zA-Z]/.test(c.name));
      } else {
        filtered = filtered.filter((c) =>
          c.name.toUpperCase().startsWith(activeLetter),
        );
      }
    }

    return filtered;
  }

  groupByLetter(clinics) {
    const groups = {};
    clinics.forEach((c) => {
      const firstChar = c.name.charAt(0).toUpperCase();
      const key = /^[A-Z]$/.test(firstChar) ? firstChar : "#";
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    return groups;
  }

  render() {
    const { activeLetter, searchText } = this.state;
    const filtered = this.getFilteredClinics();
    const grouped = this.groupByLetter(filtered);
    const sortedKeys = Object.keys(grouped).sort((a, b) =>
      a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b),
    );
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

    return (
      <div className="clinic-page">
        <HomeHeader />

        {/* Thanh xanh mỏng - y hệt Specialty */}
        <div className="clinic-header">
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

        <div className="clinic-content">
          <div className="clinic-list-container">
            {/* Header + filters */}
            <div className="clinic-list-header">
              <h2>Phòng khám</h2>
              <div className="clinic-filters">
                <select>
                  <option>Tỉnh thành</option>
                  <option>Hải Phòng</option>
                </select>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchText}
                    onChange={(e) =>
                      this.setState({
                        searchText: e.target.value,
                        activeLetter: null,
                      })
                    }
                  />
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </div>

            {/* Alphabet filter */}
            <div className="alphabet-filter">
              {letters.map((letter) => (
                <span
                  key={letter}
                  className={`letter ${activeLetter === letter ? "active" : ""}`}
                  onClick={() =>
                    this.setState({
                      activeLetter: activeLetter === letter ? null : letter,
                      searchText: "",
                    })
                  }
                >
                  {letter}
                </span>
              ))}
            </div>

            {/* Clinic groups */}
            {sortedKeys.length === 0 ? (
              <div className="no-result">Không tìm thấy phòng khám nào</div>
            ) : (
              sortedKeys.map((key) => (
                <div className="clinic-group" key={key}>
                  <div className="group-letter">{key}</div>
                  <div className="clinic-grid">
                    {grouped[key].map((clinic) => {
                      const imgSrc = this.getImageSrc(clinic);
                      return (
                        <div
                          className="clinic-card"
                          key={clinic.id}
                          onClick={() =>
                            this.props.history.push(`/clinic/${clinic.id}`)
                          }
                        >
                          <div className="clinic-card-image">
                            {imgSrc ? (
                              <img src={imgSrc} alt={clinic.name} />
                            ) : (
                              <div className="no-image">
                                <i className="fas fa-hospital"></i>
                              </div>
                            )}
                          </div>
                          <span>{clinic.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
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
  connect(mapStateToProps, mapDispatchToProps)(ClinicPage),
);
