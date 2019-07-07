import React from "react";
import { Modal, Row, Button, Container, Table } from "react-bootstrap";
import OpimizationNumber from "../../optimization/optimizationNumber/optimizationNumber";

import { connect } from "react-redux";

class DetailBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  handleClose = () => {
    this.setState({ show: false });
    this.props.hideDetail(false);
  };

  render() {
    var data = this.props.data;

    return (
      <>
        <Modal
          size="lg"
          show={this.state.show}
          onHide={this.handleClose}
          dialogClassName="title-modal"
        >
          <Modal.Header closeButton />
          <Container>
            <Modal.Body>
              <div style={{ color: "#2680EB" }}>
                <h2>Chi Tiết Hóa Đơn</h2>
              </div>
              <div style={{ paddingBottom: "5px" }}>
                <h5>
                  {data.thang}/{data.nam}
                </h5>
              </div>
              <div style={{ paddingBottom: "20px" }}>
                {data.trangThai === 0 ? (
                  <div className="is-dont-done">Chưa thanh toán</div>
                ) : (
                  <div className="is-done">Đã thanh toán</div>
                )}
              </div>

              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Số cũ</th>
                    <th>Số mới</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Điện</td>
                    <td>
                        {data.soDienCu}
                    </td>

                    <td>{data.soDien}</td>
                    <td>{OpimizationNumber.OpitmizeNumber(data.tienDien)}</td>
                  </tr>
                  {/* {data.thayDien && <tr>
                        <td>Điện (thay mới)</td>
                        <td>{data.thayDien.dienCu}</td>
                        <td>{data.thayDien.dienMoi}</td>

                    <td>
                        {data.soDienCu}
                    </td>
                      </tr>
                    } */}
                 
                  <tr>
                    <td>Nước</td>
                    <td>{data.soNuocCu}</td>
                    <td>{data.soNuoc}</td>
                    <td>{OpimizationNumber.OpitmizeNumber(data.tienNuoc)}</td>
                  </tr>
                  <tr>
                    <td>Tiền rác</td>
                    <td />
                    <td />
                    <td>{OpimizationNumber.OpitmizeNumber(data.tienRac)}</td>
                  </tr>
                </tbody>
              </Table>
              <Row>
                <span
                  style={{
                    fontSize: "25px",
                    color: "#2680EB",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                >
                  Tổng tiền: {OpimizationNumber.OpitmizeNumber(data.tongTien)}
                  &nbsp;VND
                </span>
              </Row>
              <Row>
                <span
                  style={{
                    color: "red",
                    paddingTop: "20px",
                    paddingBottom: "20px"
                  }}
                >
                  *Đơn giá điện nước tính theo giá điện nước hiện hành của chính
                  phủ
                </span>
              </Row>
            </Modal.Body>
          </Container>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

var mapStateToProps = state => {
  return {
    state: state
  };
};

export default connect(
  mapStateToProps,
  null
)(DetailBill);
