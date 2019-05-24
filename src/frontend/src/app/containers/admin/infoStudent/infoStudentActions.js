import refreshToken from "../../../../utils/refresh_token";
import axios from "axios";

export const get_headers = async() => {
  await refreshToken();
  let secret = JSON.parse(localStorage.getItem('secret'));
  let headers = {
    headers: {
      'x-access-token': secret.access_token
    }
  };
  return headers
};

export const get_element = async(name) => {
  const headers = await get_headers();

  return new Promise((resolve, reject) => {
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

  const { name, studentNumber, birthDay, regisExpiredDate, expiredDate } = params;

  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoStudent/add`,
      {
        mssv: studentNumber ? studentNumber : '',
        hoTen: name ? name : '',
        ngaySinh: birthDay,
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

export const mark_old_student = async(params) => {
  const headers = await get_headers();

  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoStudent/delete`,
      {
        arrDelete: params
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

  const { studentNumber, name, roomSelected, schoolSelected, yearSelected, floorSelected, isOld, pageActive, limit } = params;
  let idPhong = roomSelected.value;
  let idTruong = schoolSelected.value;
  const options = {
    page: pageActive,
    limit: limit
  };

  if(idPhong === '0'){
    idPhong = ''
  }
  if(idTruong === '0'){
    idTruong = ''
  }

  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoStudent/getPaging`,
      { options: options,
        mssv: studentNumber,
        hoTen: name,
        idPhong: idPhong,
        idTruong: idTruong,
        isOld: isOld,
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

export const get_list_student = async(searchValues) => {
  const headers = await get_headers();

  const { studentNumber, name, roomSelected, schoolSelected, yearSelected, floorSelected, isOld } = searchValues;
  let idPhong = roomSelected.value;
  let idTruong = schoolSelected.value;

  if(idPhong === '0'){
    idPhong = ''
  }
  if(idTruong === '0'){
    idTruong = ''
  }

  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoStudent/getAll`,
      {
        mssv: studentNumber,
        hoTen: name,
        idPhong: idPhong,
        idTruong: idTruong,
        isOld: isOld,
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
}
