import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/api/manager'


export const getData = () => {
  const secret = JSON.parse(localStorage.getItem('secret'))
axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get('/expense/get_expense_data').then(result => {
      console.log(result);
      resolve(result);
    })
    .catch(error => reject(error));

  })
}
export const search = (searchConditions) => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/expense/get_expense_table', searchConditions).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}