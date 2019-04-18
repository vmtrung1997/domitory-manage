import axios from 'axios';
import refreshToken from './../../../../utils/refresh_token'

export const getSchools = async () => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get('/manager/university/getSchools').then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const insertSchool = async (findObj) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/university/insertSchool',findObj).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const updateSchool = async (findObj) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/university/updateSchool',findObj).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const removeSchool = async (findObj) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/university/removeSchool',findObj).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const getMajor = async (findObj) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/university/getMajor',findObj).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const insertMajor = async (findObj) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/university/insertMajor',findObj).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const updateMajor = async (findObj) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/university/updateMajor',findObj).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const removeMajor = async (findObj) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/university/removeMajor',findObj).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}