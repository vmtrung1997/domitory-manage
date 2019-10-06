import refreshToken from "../../../../utils/refresh_token";
import axios from "axios";

export const get_headers = async() => {
  await refreshToken();
  let secret = JSON.parse(localStorage.getItem('secret'));
  return {
    headers: {
      'x-access-token': secret.access_token
    }
  }
};

export const get_element = async(name) => {
  const headers = await get_headers();

  return new Promise((resolve) => {
    axios.get(`/manager/getElement/` + name, headers)
      .then(result => {
      switch (name) {
        case 'room':
          resolve(result.data);
          break;
        case 'school':
          resolve(result.data);
          break;
        case 'floor':
          resolve(result.data);
          break;
        default:
          break
      }
    }).catch(err => {})
  })
};

export const add_student = async(params) => {
  const headers = await get_headers();

  const { name, studentNumber, cmnd, regisExpiredDate, expiredDate } = params;

  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoStudent/add`,
      {
        mssv: studentNumber ? studentNumber : '',
        hoTen: name ? name : '',
        cmnd: cmnd,
        hanDangKy: regisExpiredDate,
        ngayHetHan: expiredDate
      }, headers
    ).then(result => {
      resolve (result);
    }).catch(err => {
      reject (err);
    })
  })
};

export const convert_student = async(arr, option, regisExpiredDate, dayOut) => {
  const headers = await get_headers();
  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoStudent/convertStudent`,
      {
        arrStudent: arr,
        option: option,
        regisExpiredDate: regisExpiredDate,
        dayOut: dayOut
      }, headers
    ).then(result => {
      resolve(result);
    }).catch(err => {
      reject(err);
    })
  })
};

export const get_list_student_by_page = async(params) => {
  const headers = await get_headers();
  const {
    studentNumber,
    name,
    roomSelected,
    schoolSelected,
    majorSelected,
    yearSelected,
    floorSelected,
    isOld,
    isActive,
    pageActive,
    limit
  } = params;
  const idPhong = roomSelected.value === '0' ? '' : roomSelected.value;
  const idTruong = schoolSelected.value === '0' ? '' : schoolSelected.value;
  const idNganhHoc = majorSelected.value === '0' ? '' : majorSelected.value;
  const options = {
    page: pageActive,
    limit: limit
  };

  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoStudent/getPaging`,
      { options: options,
        mssv: studentNumber,
        hoTen: name,
        idPhong: idPhong,
        idTruong: idTruong,
        idNganhHoc: idNganhHoc,
        isOld: isOld,
        isActive: isActive,
        lau: floorSelected.value,
        nam: yearSelected.value
      }, headers
    ).then(result => {
      resolve(result);
    }).catch((err) => {
      reject(err)
    })
  })
};

export const get_list_student = async(searchValues, activityPoint) => {
  const headers = await get_headers();

  const { studentNumber, name, roomSelected, schoolSelected, majorSelected, yearSelected, floorSelected, isOld, isActive } = searchValues;
  const idPhong = roomSelected.value === '0' ? '' : roomSelected.value;
  const idTruong = schoolSelected.value === '0' ? '' : schoolSelected.value;
  const idNganhHoc = majorSelected.value === '0' ? '' : majorSelected.value;

  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoStudent/getAll`,
      {
        mssv: studentNumber,
        hoTen: name,
        idPhong: idPhong,
        idTruong: idTruong,
        idNganhHoc: idNganhHoc,
        isOld: isOld,
        isActive: isActive,
        lau: floorSelected.value,
        nam: yearSelected.value,
        getPoint: activityPoint,
      }, headers
    ).then(result => {
      resolve(result);
    }).catch((err) => {
      reject(err)
    })
  })
};

export const get_floor_room = async() => {
  const headers = await get_headers();

  return new Promise((resolve, reject) => {
    axios.get(`/manager/getRoomWithFloor`, headers
    ).then(result => {
      resolve(result);
    }).catch((err) => {
      reject(err)
    })
  })
};

export const get_info_Student_detail = async(id) => {
  const headers = await get_headers();

  return new Promise((resolve, reject) => {
    axios.get('manager/infoStudent/getDetail/' + id, headers)
      .then(result => {
        resolve(result);
      }).catch(err => {
        reject(err)
    })
  })
};

export const import_info_student_data = async(props) => {
  const headers = await get_headers();

  return new Promise((resolve, reject) => {
    axios.post('/manager/infoStudent/importFile', {
      data: props.data,
      hanDangKy: props.regisExpiredDate,
      ngayHetHan: props.expiredDate,
    }, headers)
      .then(result => {
        resolve(result);
      }).catch(err => {
        reject(err)
    })
  })
};

export const get_activites_by_MSSV = async(mssv) => {
  const headers = await get_headers();

  return new Promise((resolve, reject) => {
    axios.get('/manager/infoStudent/getActivities/' + mssv, headers)
      .then(result => {
        resolve(result);
      }).catch(err => {
      reject(err)
    })
  })
};
