import axios from 'axios';
import refreshToken from './../../../../utils/refresh_token'
export const getLog = async (data) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/logDb/get_log',data).then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}