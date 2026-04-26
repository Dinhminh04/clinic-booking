import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios";
import "./ClinicManage.scss";

const linkStyle = (color) => ({
  color,
  cursor: "pointer",
  fontSize: "13px",
  background: "none",
  border: "none",
  padding: 0,
  marginRight: color === "#0071ba" ? "14px" : 0,
  textDecoration: "none",
  fontWeight: "400",
});

class ClinicManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinics: [],
      showModal: false,
      isEditing: false,
      searchText: "",
      currentClinic: {
        id: "",
        name: "",
        address: "",
        description: "",
        image: "",
      },
      previewImage: "",
    };
  }

  async componentDidMount() {
    await this.loadClinics();
  }

  loadClinics = async () => {
    let res = await axios.get("/api/get-all-clinics");
    if (res && res.errCode === 0) this.setState({ clinics: res.data });
  };

  handleOpenAdd = () => {
    this.setState({
      showModal: true,
      isEditing: false,
      previewImage: "",
      currentClinic: {
        id: "",
        name: "",
        address: "",
        description: "",
        image: "",
      },
    });
  };

  handleOpenEdit = (clinic) => {
    this.setState({
      showModal: true,
      isEditing: true,
      previewImage: clinic.image
        ? `data:image/jpeg;base64,${clinic.image}`
        : "",
      currentClinic: {
        id: clinic.id,
        name: clinic.name,
        address: clinic.address,
        description: clinic.description,
        image: clinic.image || "",
      },
    });
  };

  handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng khám này?")) {
      let res = await axios.delete(`/api/delete-clinic?id=${id}`);
      if (res && res.errCode === 0) await this.loadClinics();
    }
  };

  handleSave = async () => {
    let { currentClinic, isEditing } = this.state;
    if (!currentClinic.name || !currentClinic.address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    let res = isEditing
      ? await axios.put("/api/update-clinic", currentClinic)
      : await axios.post("/api/create-clinic", currentClinic);
    if (res && res.errCode === 0) {
      this.setState({ showModal: false, previewImage: "" });
      await this.loadClinics();
    }
  };

  handleChange = (e) => {
    let { currentClinic } = this.state;
    currentClinic[e.target.name] = e.target.value;
    this.setState({ currentClinic });
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
      let { currentClinic } = this.state;
      currentClinic.image = url.split(",")[1];
      this.setState({ currentClinic, previewImage: url });
    };
    reader.readAsDataURL(file);
  };

  getImageSrc(clinic) {
    if (!clinic.image) return null;
    if (clinic.image.startsWith("http")) return clinic.image;
    return `data:image/jpeg;base64,${clinic.image}`;
  }

  getFiltered() {
    const { clinics, searchText } = this.state;
    if (!searchText) return clinics;
    return clinics.filter((c) =>
      c.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }

  render() {
    let { showModal, isEditing, currentClinic, previewImage, searchText } =
      this.state;
    const filtered = this.getFiltered();

    return (
      <div className="clinic-manage">
        <div className="toolbar">
          <button className="btn-add" onClick={this.handleOpenAdd}>
            + Thêm phòng khám
          </button>
          <div className="toolbar-right">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo tên..."
              value={searchText}
              onChange={(e) => this.setState({ searchText: e.target.value })}
            />
          </div>
        </div>

        {showModal && (
          <div className="modal-form">
            <h6 className="modal-title">
              {isEditing ? "Sửa phòng khám" : "Thêm phòng khám mới"}
            </h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Tên phòng khám <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="name"
                    value={currentClinic.name}
                    onChange={this.handleChange}
                    placeholder="Nhập tên phòng khám"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Địa chỉ <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="address"
                    value={currentClinic.address}
                    onChange={this.handleChange}
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    className="form-control form-control-sm"
                    name="description"
                    value={currentClinic.description}
                    onChange={this.handleChange}
                    placeholder="Nhập mô tả"
                    rows="2"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Ảnh phòng khám</label>
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

        <div className="clinic-grid">
          {filtered.length > 0 ? (
            filtered.map((clinic) => {
              const imgSrc = this.getImageSrc(clinic);
              return (
                <div className="clinic-card" key={clinic.id}>
                  <div className="card-top">
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={clinic.name}
                        className="clinic-img"
                      />
                    )}
                    <div className="card-info">
                      <div className="card-header-row">
                        <h6 className="clinic-name">{clinic.name}</h6>
                        <span className="badge-active">● Hoạt động</span>
                      </div>
                      <p className="clinic-address">{clinic.address}</p>
                      <p className="clinic-desc">{clinic.description}</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    {/* Dùng inline style để chắc chắn override Bootstrap */}
                    <span
                      style={linkStyle("#0071ba")}
                      onClick={() => this.handleOpenEdit(clinic)}
                    >
                      Chỉnh sửa
                    </span>
                    <span
                      style={linkStyle("#d01a1d")}
                      onClick={() => this.handleDelete(clinic.id)}
                    >
                      Xóa
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty">Chưa có dữ liệu</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ClinicManage);
