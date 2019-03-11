import axios from 'axios';

//axios.defaults.baseURL = 'http://localhost:4000/api/manager'
const secret = localStorage.getItem('secret')

export const search = (searchConditions) => {
  var secretObj = JSON.parse(secret);
  console.log(secretObj.access_token)
  axios.defaults.headers.common['x-access-token'] = secretObj.access_token
  console.log(searchConditions)
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:4000/api/manager/expense/get_expense_table', searchConditions).then(result => { 
      console.log(result);
      resolve(result);
    })
    .catch(error => reject(error));

  })
}