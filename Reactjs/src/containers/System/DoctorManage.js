import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios";
import "./DoctorManage.scss";

class DoctorManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      specialties: [],
      clinics: [],
      showModal: false,
      isEditing: false,
      previewImage: "",
      searchText: "",
      filterSpecialty: "",
      currentDoctor: {
        id: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        phonenumber: "",
        positionId: "P0",
        specialtyId: "",
        clinicId: "",
        image: "",
      },
    };
  }

  async componentDidMount() {
    await this.loadDoctors();
    let resSpecialty = await axios.get("/api/get-all-specialties");
    let resClinic = await axios.get("/api/get-all-clinics");
    if (resSpecialty && resSpecialty.errCode === 0)
      this.setState({ specialties: resSpecialty.data });
    if (resClinic && resClinic.errCode === 0)
      this.setState({ clinics: resClinic.data });
  }

  loadDoctors = async () => {
    let res = await axios.get("/api/get-all-doctors");
    if (res && res.errCode === 0) this.setState({ doctors: res.data });
  };

  getPositionName = (positionId) => {
    let positions = {
      P0: "Bác sĩ",
      P1: "Thạc sĩ",
      P2: "Tiến sĩ",
      P3: "Phó giáo sư",
      P4: "Giáo sư",
    };
    return positions[positionId] || positionId;
  };

  handleOpenAdd = () => {
    this.setState({
      showModal: true,
      isEditing: false,
      previewImage: "",
      currentDoctor: {
        id: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        phonenumber: "",
        positionId: "P0",
        specialtyId: "",
        clinicId: "",
        image: "",
      },
    });
  };

  handleOpenEdit = (doctor) => {
    this.setState({
      showModal: true,
      isEditing: true,
      previewImage: doctor.image
        ? `data:image/jpeg;base64,${doctor.image}`
        : "",
      currentDoctor: {
        id: doctor.id,
        email: doctor.email || "",
        password: "",
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        address: doctor.address || "",
        phonenumber: doctor.phonenumber || "",
        positionId: doctor.positionId || "P0",
        specialtyId: doctor.specialtyId || "",
        clinicId: doctor.clinicId || "",
        image: doctor.image || "",
      },
    });
  };

  handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này?")) {
      let res = await axios.delete(`/api/delete-doctor?id=${id}`);
      if (res && res.errCode === 0) await this.loadDoctors();
    }
  };

  handleSave = async () => {
    let { currentDoctor, isEditing } = this.state;
    if (!currentDoctor.email || !currentDoctor.firstName) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    let res = isEditing
      ? await axios.put("/api/update-doctor", currentDoctor)
      : await axios.post("/api/create-doctor", currentDoctor);
    if (res && res.errCode === 0) {
      this.setState({ showModal: false, previewImage: "" });
      await this.loadDoctors();
    } else {
      alert(res.errMessage || "Có lỗi xảy ra!");
    }
  };

  handleChange = (e) => {
    let { currentDoctor } = this.state;
    currentDoctor[e.target.name] = e.target.value;
    this.setState({ currentDoctor });
  };

  handleImageChange = (e) => {
    let file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    const reader = new FileReader();
    reader.onloadend = () => {
      img.src = reader.result;
    };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width,
        h = img.height;
      const ratio = Math.min(400 / w, 400 / h);
      if (w > 400 || h > 400) {
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      const url = canvas.toDataURL("image/jpeg", 0.7);
      let { currentDoctor } = this.state;
      currentDoctor.image = url.split(",")[1];
      this.setState({ currentDoctor, previewImage: url });
    };
    reader.readAsDataURL(file);
  };

  getImageSrc(doctor) {
    if (!doctor.image) return null;
    if (doctor.image.startsWith("http")) return doctor.image;
    return `data:image/jpeg;base64,${doctor.image}`;
  }

  getFilteredDoctors() {
    const { doctors, searchText, filterSpecialty } = this.state;
    return doctors.filter((d) => {
      const name = `${d.firstName} ${d.lastName} ${d.email}`.toLowerCase();
      const matchSearch =
        !searchText || name.includes(searchText.toLowerCase());
      const matchSpecialty =
        !filterSpecialty || String(d.specialtyId) === String(filterSpecialty);
      return matchSearch && matchSpecialty;
    });
  }

  render() {
    let {
      showModal,
      isEditing,
      currentDoctor,
      specialties,
      clinics,
      previewImage,
      searchText,
      filterSpecialty,
    } = this.state;
    const filtered = this.getFilteredDoctors();

    return (
      <div className="doctor-manage">
        {/* Toolbar */}
        <div className="toolbar">
          <button className="btn-add" onClick={this.handleOpenAdd}>
            + Thêm bác sĩ
          </button>
          <div className="toolbar-right">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo tên, email..."
              value={searchText}
              onChange={(e) => this.setState({ searchText: e.target.value })}
            />
            <select
              className="filter-select"
              value={filterSpecialty}
              onChange={(e) =>
                this.setState({ filterSpecialty: e.target.value })
              }
            >
              <option value="">Tất cả chuyên khoa</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form */}
        {showModal && (
          <div className="modal-form">
            <h6 className="modal-title">
              {isEditing ? "Sửa bác sĩ" : "Thêm bác sĩ mới"}
            </h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    name="email"
                    value={currentDoctor.email}
                    onChange={this.handleChange}
                    placeholder="Email"
                    disabled={isEditing}
                  />
                </div>
              </div>
              {!isEditing && (
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control form-control-sm"
                      name="password"
                      value={currentDoctor.password}
                      onChange={this.handleChange}
                      placeholder="Mật khẩu"
                    />
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="firstName"
                    value={currentDoctor.firstName}
                    onChange={this.handleChange}
                    placeholder="Tên"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Họ</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="lastName"
                    value={currentDoctor.lastName}
                    onChange={this.handleChange}
                    placeholder="Họ"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="phonenumber"
                    value={currentDoctor.phonenumber}
                    onChange={this.handleChange}
                    placeholder="Số điện thoại"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Chức danh</label>
                  <select
                    className="form-control form-control-sm"
                    name="positionId"
                    value={currentDoctor.positionId}
                    onChange={this.handleChange}
                  >
                    <option value="P0">Bác sĩ</option>
                    <option value="P1">Thạc sĩ</option>
                    <option value="P2">Tiến sĩ</option>
                    <option value="P3">Phó giáo sư</option>
                    <option value="P4">Giáo sư</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Chuyên khoa</label>
                  <select
                    className="form-control form-control-sm"
                    name="specialtyId"
                    value={currentDoctor.specialtyId}
                    onChange={this.handleChange}
                  >
                    <option value="">-- Chọn chuyên khoa --</option>
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phòng khám</label>
                  <select
                    className="form-control form-control-sm"
                    name="clinicId"
                    value={currentDoctor.clinicId}
                    onChange={this.handleChange}
                  >
                    <option value="">-- Chọn phòng khám --</option>
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="address"
                    value={currentDoctor.address}
                    onChange={this.handleChange}
                    placeholder="Địa chỉ"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Ảnh bác sĩ</label>
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    onChange={this.handleImageChange}
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="preview"
                      className="preview-img"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={this.handleSave}>
                Lưu
              </button>
              <button
                className="btn-cancel"
                onClick={() =>
                  this.setState({ showModal: false, previewImage: "" })
                }
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Chuyên khoa</th>
              <th>Phòng khám</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((doctor) => {
                const imgSrc = this.getImageSrc(doctor);
                return (
                  <tr key={doctor.id}>
                    <td>
                      <div className="doctor-info">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={doctor.firstName}
                            className="avatar"
                          />
                        ) : (
                          <div className="avatar-fallback">
                            {doctor.firstName
                              ? doctor.firstName.charAt(0).toUpperCase()
                              : "D"}
                          </div>
                        )}
                        <div>
                          <div className="doctor-name">
                            {this.getPositionName(doctor.positionId)}{" "}
                            {doctor.firstName} {doctor.lastName}
                          </div>
                          <div className="doctor-email">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{doctor.specialtyName || "--"}</td>
                    <td>{doctor.clinicName || "--"}</td>
                    <td>
                      <span className="badge-active">● Hoạt động</span>
                    </td>
                    <td>
                      <span
                        className="btn-edit"
                        onClick={() => this.handleOpenEdit(doctor)}
                      >
                        Chỉnh sửa
                      </span>
                      <span
                        className="btn-delete"
                        onClick={() => this.handleDelete(doctor.id)}
                      >
                        Xóa
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="empty-row">
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
