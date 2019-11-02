import React, {
  Component
} from 'react'
import {
  Modal
} from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import TimeField from 'react-simple-timefield';
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from "react-toasts";
import axios from './../../../config'

import './activityModal.css'
import refreshToken from './../../../../utils/refresh_token'
import Button from './../../../components/button/button'
import Input from './../../../components/input/input'
import CheckBox from './../../../components/checkbox/checkbox'

const today = new Date()
var getStringTime = () => {
  var h = today.getHours()
  var m = today.getMinutes()
  if (today.getHours() < 10)
    h = '0' + today.getHours()
  if (today.getMinutes() < 10)
    m = '0' + today.getMinutes()
  return h + ':' + m
}
const time = getStringTime()
const initialState = {
  name: '',
  location: '',
  date: today,
  time: time,
  dateEnd: today,
  timeEnd: time,
  isRequire: false,
  des: '',
  point: 0
}

class ActivityModal extends Component {
  static defaultProps = {
    show: false,
    handleClose: () => {},
    handleSave: () => {},
  }
  constructor(props) {
    super(props)
    this.state = initialState
  }
  getValue = (name, val) => {
    this.setState({
      [name]: val
    })
  }
  handleSave = async () => {
    var {
      name,
      location,
      des,
      point
    } = this.state
    var date = this.state.date
    var dateEnd = this.state.dateEnd
    var cur = new Date()

    var tmp = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    var tmpEnd = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate())
    var tmpCur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate())

    // Hoạt động
    var timeFirst = this.state.time.split(':')
    var timeFinal = this.state.timeEnd.split(':')

    this.state.date.setHours(parseInt(timeFirst[0]), parseInt(timeFirst[1]), 0)
    this.state.dateEnd.setHours(parseInt(timeFinal[0]), parseInt(timeFinal[1]), 0)

    if (!name || !location || !des || !point) {
      ToastsStore.error("Bạn phải nhập đầy đủ thông tin!");
    } else if (parseInt(point) <= 0) {
      ToastsStore.error("Điểm hoạt động phải lớn hơn 0!");
    } else if (tmp > tmpEnd) {
      ToastsStore.error("Thời gian kết thúc không nhỏ hơn thời gian bắt đầu!");
    } else {
      await refreshToken()
      var secret = JSON.parse(localStorage.getItem('secret'))
      axios({
        method: 'post',
        url: '/manager/activity/post',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': secret.access_token
        },
        data: {
          name: this.state.name,
          location: this.state.location,
          date: this.state.date.toString(),
          dateEnd: this.state.dateEnd.toString(),
          isRequire: this.state.isRequire,
          point: this.state.point,
          des: this.state.des
        }
      }).then(res => {
        ToastsStore.success("Thêm hoạt động thành công!");
      }).catch(err => {
        ToastsStore.error("Thêm hoạt động không thành công!");
      })

      this.setState(initialState)
      this.props.handleSave()
    }
  }
  handleClose = () => {
    this.setState(initialState)
    this.props.handleClose()
  }

  render() {
    return ( <
      React.Fragment >
      <
      ToastsContainer store = {
        ToastsStore
      }
      position = {
        ToastsContainerPosition.TOP_CENTER
      }
      lightBackground / >
      <
      Modal show = {
        this.props.show
      }
      onHide = {
        this.handleClose
      }
      style = {
        {
          marginTop: '-20px'
        }
      } >
      <
      Modal.Header closeButton >
      <
      Modal.Title > Thêm hoạt động < /Modal.Title> < /
      Modal.Header > <
      Modal.Body >
      <
      div >
      <
      span > Hoạt động < /span> <
      Input getValue = {
        (obj) => this.getValue(obj.name, obj.value)
      }
      name = 'name' / >
      <
      /div> <
      div >
      <
      span > Địa điểm < /span> <
      Input getValue = {
        (obj) => this.getValue(obj.name, obj.value)
      }
      name = 'location' / >
      <
      /div> <
      div >
      <
      span > Thời gian bắt đầu < /span> <
      div style = {
        {
          display: 'flex',
          justifyContent: 'space-around'
        }
      } >
      <
      TimeField style = {
        {
          marginRight: '10px'
        }
      }
      value = {
        this.state.time
      }
      onChange = {
        (value) => {
          this.getValue('time', value)
        }
      }
      input = {
        <
        input / >
      }
      /> <
      DatePicker dateFormat = 'dd/MM/yyyy'
      selected = {
        this.state.date
      }
      onChange = {
        (val) => this.getValue('date', val)
      }
      className = 'input-datepicker' /
      >
      <
      /div> < /
      div > <
      div >
      <
      span > Thời gian kết thúc < /span> <
      div style = {
        {
          display: 'flex',
          justifyContent: 'space-around'
        }
      } >
      <
      TimeField style = {
        {
          marginRight: '10px'
        }
      }
      value = {
        this.state.timeEnd
      }
      onChange = {
        (value) => {
          this.getValue('timeEnd', value)
        }
      }
      input = {
        <
        input / >
      }
      /> <
      DatePicker dateFormat = 'dd/MM/yyyy'
      selected = {
        this.state.dateEnd
      }
      onChange = {
        (val) => this.getValue('dateEnd', val)
      }
      className = 'input-datepicker' /
      >
      <
      /div> < /
      div > <
      div >
      <
      span > Mô tả < /span> <
      textarea rows = '4'
      onChange = {
        (obj) => this.getValue('des', obj.target.value)
      }
      /> < /
      div > <
      div >
      <
      span > Điểm hoạt động < /span> <
      Input getValue = {
        (obj) => this.getValue(obj.name, obj.value)
      }
      name = 'point'
      type = 'number'
      min = "0" / >
      <
      /div> <
      div style = {
        {
          marginTop: '10px'
        }
      } >
      <
      span style = {
        {
          fontWeight: 'bold'
        }
      } > Hoạt động bắt buộc < /span> <
      CheckBox name = 'isRequire'
      style = {
        {
          display: 'grid'
        }
      }
      check = {
        this.state.isRequire
      }
      isCheck = {
        (obj) => this.getValue(obj.value, obj.chk)
      }
      /> < /
      div > <
      /Modal.Body> <
      Modal.Footer >
      <
      Button variant = 'default'
      color = 'default'
      onClick = {
        this.handleClose
      } >
      Đóng <
      /Button> <
      Button variant = 'default'
      onClick = {
        this.handleSave
      } >
      Xác nhận <
      /Button> < /
      Modal.Footer > <
      /Modal> < /
      React.Fragment >
    )
  }
}

export default ActivityModal
