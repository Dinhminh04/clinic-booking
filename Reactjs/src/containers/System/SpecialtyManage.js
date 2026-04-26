import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios";
import "./SpecialtyManage.scss";

class SpecialtyManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
      showModal: false,
      isEditing: false,
      searchText: "",
      currentSpecialty: { id: "", name: "", description: "" },
    };
  }

  async componentDidMount() {
    await this.loadSpecialties();
  }

  loadSpecialties = async () => {
    let res = await axios.get("/api/get-all-specialties");
    if (res && res.errCode === 0) this.setState({ specialties: res.data });
  };

  handleOpenAdd = () => {
    this.setState({
      showModal: true,
      isEditing: false,
      currentSpecialty: { id: "", name: "", description: "" },
    });
  };

  handleOpenEdit = (specialty) => {
    this.setState({
      showModal: true,
      isEditing: true,
      currentSpecialty: {
        id: specialty.id,
        name: specialty.name,
        description: specialty.description,
      },
    });
  };

  handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chuyên khoa này?")) {
      let res = await axios.delete(`/api/delete-specialty?id=${id}`);
      if (res && res.errCode === 0) await this.loadSpecialties();
    }
  };

  handleSave = async () => {
    let { currentSpecialty, isEditing } = this.state;
    if (!currentSpecialty.name) {
      alert("Vui lòng nhập tên chuyên khoa!");
      return;
    }
    let res = isEditing
      ? await axios.put("/api/update-specialty", currentSpecialty)
      : await axios.post("/api/create-specialty", currentSpecialty);
    if (res && res.errCode === 0) {
      this.setState({ showModal: false });
      await this.loadSpecialties();
    }
  };

  handleChange = (e) => {
    let { currentSpecialty } = this.state;
    currentSpecialty[e.target.name] = e.target.value;
    this.setState({ currentSpecialty });
  };

  getFiltered() {
    const { specialties, searchText } = this.state;
    if (!searchText) return specialties;
    return specialties.filter((s) =>
      s.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }

  render() {
    let { showModal, isEditing, currentSpecialty, searchText } = this.state;
    const filtered = this.getFiltered();

    return (
      <div className="specialty-manage">
        <div className="toolbar">
          <button className="btn-add" onClick={this.handleOpenAdd}>
            + Thêm chuyên khoa
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
              {isEditing ? "Sửa chuyên khoa" : "Thêm chuyên khoa mới"}
            </h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Tên chuyên khoa <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="name"
                    value={currentSpecialty.name}
                    onChange={this.handleChange}
                    placeholder="Nhập tên chuyên khoa"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Mô tả</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="description"
                    value={currentSpecialty.description}
                    onChange={this.handleChange}
                    placeholder="Nhập mô tả"
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={this.handleSave}>
                Lưu
              </button>
              <button
                className="btn-cancel"
                onClick={() => this.setState({ showModal: false })}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <table className="specialty-table">
          <thead>
            <tr>
              <th>Tên chuyên khoa</th>
              <th>Mô tả</th>
              <th>Số bác sĩ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((specialty) => (
                <tr key={specialty.id}>
                  <td className="specialty-name">{specialty.name}</td>
                  <td className="specialty-desc">
                    {specialty.description || "--"}
                  </td>
                  <td>
                    <span className="badge-count">
                      {specialty.doctorCount || 0}
                    </span>
                  </td>
                  <td>
                    <span
                      className="btn-edit"
                      onClick={() => this.handleOpenEdit(specialty)}
                    >
                      Chỉnh sửa
                    </span>
                    <span
                      className="btn-delete"
                      onClick={() => this.handleDelete(specialty.id)}
                    >
                      Xóa
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-row">
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
export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyManage);
