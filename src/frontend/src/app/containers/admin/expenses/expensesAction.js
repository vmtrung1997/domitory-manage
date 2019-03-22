import axios from 'axios';
export const getData = () => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get('/manager/expense/get_expense_data').then(result => {
      resolve(result);
    })
    .catch(error =>{
      console.log('err: ',error.response.data.status);
      if (error.response.data.status === 401){
        axios.defaults.headers.common['x-refresh-token'] = secret.refresh_token
        axios.get('/user/me_access').then(res => {
          if(res && res.data !== undefined)
            {
              localStorage.setItem('secret', JSON.stringify(res.data))
              getData()
            }
        }).catch(errRefresh => reject(errRefresh))
      }
      else
        reject(error)});

  })
}
export const search = (searchConditions) => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/get_expense_table', searchConditions).then(result => { 
      resolve(result);
    })
    .catch(error =>{
      console.log(error);
       reject(error)});
  })
}
export const add_expense = (table) => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/add_expense', table).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const remove_expense = (exp) => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/remove_expense', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const update_expense = (exp) => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/update_expense', exp).then(result => { 
      resolve(result);
    })
    .catch(error => {
      reject(error)
    });
  })
}

export const report_expense = (exp) => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/report', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const get_parameter = (exp) => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get('/manager/expense/get_parameter', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const require_expense = (exp) => {
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/require', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}