import axios from 'axios';
import refreshToken from '../../../../utils/refresh_token'
export const getRoomTypes = async () => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get(`/manager/infoDormitory/getRoomType`).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const addRoomType = async (roomType) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoDormitory/addRoomType`,roomType).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const updateRoomType = async (roomType) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoDormitory/updateRoomType`,roomType).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const removeRoomType = async (roomType) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post(`/manager/infoDormitory/removeRoomType`,roomType).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}