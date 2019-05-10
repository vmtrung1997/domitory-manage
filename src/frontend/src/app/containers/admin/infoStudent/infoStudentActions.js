import refreshToken from "../../../../utils/refresh_token";
import axios from "axios";

export const get_headers = async() => {
  await refreshToken();
  let secret = JSON.parse(localStorage.getItem('secret'));
  let headers = {
    'x-access-token': secret.access_token
  };
  return headers
};

export const get_list_student_by_page = async(params) => {
  const headers = await get_headers();

  const { studentNumber, name, roomSelected, schoolSelected, isOld, pageActive, limit } = params;
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
      }, { headers: headers }
    ).then(result => {
      resolve(result);
    }).catch((err) => {
      reject(err)
    })
  })
};

export const get_element = async(name) => {
  const headers = await get_headers();

  return new Promise((resolve, reject) => {
    axios.get(`/manager/getElement/` + name, {
      headers: headers
    }).then(result => {
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
      }, { headers: headers }
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
      }, { headers: headers }
    ).then(result => {
      resolve(result);
    }).catch(err => {
      reject(err);
    })
  })
};

export const get_list_student = async(searchValues) => {
  const headers = await get_headers();
  console.log('==params',searchValues)

  const { studentNumber, name, roomSelected, schoolSelected, isOld } = searchValues;
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
      }, { headers: headers }
    ).then(result => {
      resolve(result);
    }).catch((err) => {
      console.log('==getall', err)
      reject(err)
    })
  })
};

export const get_floor_room = async() => {
  const headers = await get_headers();

  return new Promise((resolve, reject) => {
    axios.get(`/manager/getRoomWithFloor`,{ headers: headers }
    ).then(result => {
      resolve(result);
    }).catch((err) => {
      console.log('==getall', err)
      reject(err)
    })
  })
};

