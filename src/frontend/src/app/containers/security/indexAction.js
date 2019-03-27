import axios from 'axios';
export const getHistoryList = async () => {
  //await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get('/security/get_history_list').then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}