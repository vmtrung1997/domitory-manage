import axios from 'axios';
import refreshToken from './../../../utils/refresh_token'

export const getHistoryList = async (type) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/security/get_history_list',{type: type}).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const inputCard = async (info) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/security/input_card',info).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}

export const logout = () => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-refresh-token'] = secret.refresh_token
  axios.get('/logout').then(result => {
    if (result.data.logout){
      localStorage.removeItem('secret');
    }
    
  }).catch(err => {})
}