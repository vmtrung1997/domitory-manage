import axios from 'axios';
import refreshToken from './../../../../utils/refresh_token'
export const findHistory = async (findObj) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/security/history',findObj).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}