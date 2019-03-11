import axios from 'axios';

axios.defaults.baseURL = 'localhost:4000/api/manager'
const secret = localStorage.getItem('secret')

export const search = (searchConditions) => {
  var secretObj = JSON.parse(secret);
  axios.defaults.headers.common['x-access-token'] = secretObj.access_token
  return new Promise((resolve, reject) => {
    axios.post('/get_expense_table', searchConditions).then(result => {
      resolve(result);
    })
    .catch(error => reject(error));

  })
}