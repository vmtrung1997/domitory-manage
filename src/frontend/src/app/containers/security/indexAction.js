import axios from 'axios';
import refreshToken from './../../../utils/refresh_token'
// const refreshToken = async () => {
//   var secret = JSON.parse(localStorage.getItem('secret'))
//   if( secret ){
//       const exp = jwt_decode(secret.access_token).exp
//       if( exp < new Date().getTime()/1000){
//         var res = await axios.get(`/user/me_access`,  {
//               headers: { 
//                   'x-refresh-token': secret.refresh_token,
//               }
//           })
//           .catch( err => { return true})
//         if(res && res.data.access_token !== undefined){  
//               localStorage.setItem('secret', JSON.stringify(res.data))
//           }
//       }
//   }
// }

export const getHistoryList = async () => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get('/security/get_history_list').then(result => {
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