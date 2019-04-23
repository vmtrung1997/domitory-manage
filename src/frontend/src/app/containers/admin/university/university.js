import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import Title from '../../../components/title/title';
import Button from '../../../components/button/button';
import Loader from '../../../components/loader/loader';
import './university.css'
import Input from '../../../components/input/input';
import Confirm from '../../../components/confirm/confirm'
import Modal from './universityModal'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { getSchools, getMajor, insertSchool, insertMajor, updateSchool, updateMajor, removeSchool, removeMajor } from './universityAction'
class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schools: [],
      majorsList: [],
      loading: false,
      selectSchool: '',
      isEditSChool: false,
      isEditMajor: false,
      valueUpdate: '',
      idUpdate: '',
      show: false,
      idTruongUpdate: '',
      schoolTxt: '',
      majorTxt: '',
      showDel: false,
      contentDel: '',
      titleDel: '',
      isSchoolDel: false,
      isMajorDel: false
    }
  }
  componentDidMount() {
    this.setState({ loading: true })
    this.getInit().then(() => this.setState({ loading: false }))
  }
  onHandleSchoolClick = (id) => {
    if (id === '')
      return;
    this.setState({ loading: true, selectSchool: id })
    getMajor({ id: id }).then(result => {
      if (result.data.rs == 'success') {
        this.setState({ majorsList: result.data.data, idTruongUpdate: id })
      }
    })
  }
  getInit = () => {
    return new Promise(resolve => {
      getSchools().then(result => {
        this.setState({ schools: result.data.data})
        resolve()
      })
    })
  }
  onHandleSave = () => {
    var object = {
      id: this.state.idUpdate,
    }
    if (this.state.isEditSChool) {
      object.tenTruong = this.state.valueUpdate
      updateSchool(object).then(result => {
        if (result.data.rs === 'success') {
          this.setState({ idUpdate: '', valueUpdate: '', isEditSChool: false, show: false });
          this.getInit().then(() => {
            this.onHandleSchoolClick(this.state.selectSchool)
          });
          ToastsStore.success("Cập nhật thành công");
        }
        else
          ToastsStore.error("Cập nhật thất bại");
          this.setState({ loading: false })
      })
    } else if (this.state.isEditMajor) {
      object.tenNganh = this.state.valueUpdate;
      updateMajor(object).then(result => {
        if (result.data.rs === 'success') {
          ToastsStore.success("Cập nhật thành công");
          this.setState({ idUpdate: '', valueUpdate: '', isEditMajor: false });
          this.onHandleSchoolClick(this.state.selectSchool);
        }
        else
          ToastsStore.error("Cập nhật thất bại");
          this.setState({ loading: false })
      })
    }
  }
  onUpdateSchoolItem = (obj) => {
    this.setState({
      isEditSChool: true,
      show: true,
      title: 'Chỉnh sửa trường',
      valueUpdate: obj.tenTruong,
      idUpdate: obj._id
    })
  }

  onUpdateMajorItem = (obj) => {
    this.setState({
      isEditMajor: true,
      show: true,
      title: 'Chỉnh sửa ngành',
      valueUpdate: obj.idNganhHoc.tenNganh,
      idUpdate: obj.idNganhHoc._id
    })
  }

  onAddSchool = () => {
    this.setState({ loading: true })
    var { schoolTxt } = this.state;
    if (schoolTxt === '')
      return;
    insertSchool({ tenTruong: schoolTxt }).then(result => {
      if (result.data.rs === 'fail') {
        ToastsStore.error(result.data.msg);
      } else if (result.data.rs === 'success') {
        this.getInit().then(() => {
          this.onHandleSchoolClick(this.state.selectSchool)
        });
        ToastsStore.success('Thêm trường thành công')
      }
      this.setState({ schoolTxt: '', loading: false })
    })
  }
  onAddMajor = () => {
    var { majorTxt, selectSchool } = this.state;
    console.log('majortxt', majorTxt)
    if (majorTxt === '')
      return;
    this.setState({ loading: true })
    insertMajor({ tenNganh: majorTxt, idTruong: selectSchool }).then(result => {
      if (result.data.rs === 'fail') {
        ToastsStore.error(result.data.msg);
      } else if (result.data.rs === 'success') {
        this.getInit().then(() => {
          this.onHandleSchoolClick(this.state.selectSchool)
        });
        ToastsStore.success('Thêm ngành thành công')
      }
      this.setState({ majorTxt: '', loading: false })
    })
  }
  onDel = (type, id, name) => {
    if (type === 'school')
    {
      this.setState({
        showDel: true,
        titleDel: 'Xóa trường',
        contentDel: `Bạn muốn xóa trường [${name}]`,
        isSchoolDel: true,
        idUpdate: id
      })
    } else if (type === 'major')
      this.setState({
        showDel: true,
        titleDel: 'Xóa ngành',
        contentDel: `Bạn muốn xóa ngành [${name}]`,
        isMajorDel: true,
        idUpdate: id
      })
  }
  onAccepDel = () => {
    this.setState({loading: true})
    var {idUpdate} = this.state;
    if (this.state.isSchoolDel){
      removeSchool({id: idUpdate}).then(result => {
        if (result.data.rs === 'fail'){
          ToastsStore.error(result.data.msg);
        } else {
          ToastsStore.success('Xóa trường thành công')
          this.getInit().then(() => {
            this.onHandleSchoolClick(this.state.selectSchool)
          });
        }
        this.setState({
          showDel: false,
          isSchoolDel: false,
          idUpdate: '',
          loading: false
        })
      })
    } else if (this.state.isMajorDel){
      removeMajor({id: idUpdate}).then(result => {
        if (result.data.rs === 'fail'){
          ToastsStore.error(result.data.msg);
        } else {
          ToastsStore.success('Xóa ngành thành công')
          this.getInit().then(() => {
            this.onHandleSchoolClick(this.state.selectSchool)
          });
        }
        this.setState({
          showDel: false,
          isMajorDel: false,
          idUpdate: '',
          loading: false
        })
      })
    }
  }
  render() {
    return (
      <React.Fragment>
        <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} lightBackground store={ToastsStore} />
        <Loader loading={this.state.loading} />
        <Title>Trường ngành</Title>
        <div className="content-body">
          {this.state.show &&
            <Modal
              title={this.state.title}
              show={this.state.show}
              handleSave={this.onHandleSave}
              handleClose={() => this.setState({ show: false })}>
              <Input value={this.state.valueUpdate} getValue={(target) => { this.setState({ valueUpdate: target.value }) }} />
            </Modal>}
          <Confirm show={this.state.showDel} 
              title={this.state.titleDel}
              handleSave={this.onAccepDel}
              content={this.state.contentDel}
              handleClose={() => this.setState({showDel: false})}/>
          <Row>
            <Col md={{ span: 5 }} xs={12}>
              <div>
                <Row>
                  <Col md={10}>
                    <Input
                      placeholder='Thêm trường'
                      value={this.state.schoolTxt}
                      getValue={(t) => this.setState({ schoolTxt: t.value })} />
                  </Col>
                  <Col md={2}><Button onClick={this.onAddSchool}>+</Button></Col>

                </Row>
              </div>
              <div>Danh sách trường</div>
              {
                this.state.schools && this.state.schools.length > 0 && this.state.schools.map(sch => {
                  return (
                    <Col md={12} key={sch._id} >
                      <Row className={sch._id === this.state.selectSchool ? 'school-item school-item-cursor is-active-school m-b-10' : 'school-item school-item-cursor m-b-10'}>
                        <Col md={9} onClick={() => {this.onHandleSchoolClick(sch._id); this.setState({loading: false})}}>{sch.tenTruong}</Col>
                        <Col md={3}>
                          <i className="fas fa-edit school-item-edit" onClick={() => this.onUpdateSchoolItem(sch)}></i>&nbsp;
                          <i className="fas fa-trash-alt school-item-trash" onClick={() => this.onDel('school', sch._id, sch.tenTruong)}></i>
                        </Col>
                      </Row>
                    </Col>
                  )
                })
              }

            </Col>
            <Col md={{ offset: 1, span: 5 }} xs={12}>
              <div>
                <Row>
                  <Col md={10}>
                    <Input
                      disabled={this.state.selectSchool === ''}
                      placeholder='Thêm ngành'
                      value={this.state.majorTxt}
                      getValue={t => this.setState({ majorTxt: t.value })}
                    />
                  </Col>
                  <Col md={2}><Button disabled={this.state.selectSchool === ''} onClick={this.onAddMajor}>+</Button></Col>

                </Row>
              </div>
              <div>Danh sách ngành</div>
              <div>
                {this.state.majorsList.length > 0 && this.state.majorsList.map(value => {
                  return (
                    <Col key={value._id} md={12}>
                      <Row className='school-item m-b-10'>
                        <Col md={9}>{value.idNganhHoc.tenNganh}</Col>
                        <Col md={3}>
                          <i className="fas fa-edit school-item-edit school-item-cursor" onClick={() => this.onUpdateMajorItem(value)}></i>&nbsp;
                          <i className="fas fa-trash-alt school-item-trash school-item-cursor" onClick={() => this.onDel('major',value.idNganhHoc._id,value.idNganhHoc.tenNganh)}></i>
                        </Col>
                      </Row>
                    </Col>
                  )
                })}
              </div>
            </Col>

          </Row>
        </div>
      </React.Fragment>

    )
  }
}

export default Security