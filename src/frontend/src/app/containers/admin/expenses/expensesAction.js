import axios from 'axios';
import refreshToken from './../../../../utils/refresh_token'
export const getData = async () => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get('/manager/expense/get_expense_data').then(result => {
      resolve(result);
    })
    .catch(error =>{reject(error)});

  })
}
export const search = async (searchConditions) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/get_expense_table', searchConditions).then(result => { 
      resolve(result);
    })
    .catch(error =>{
        reject(error)});
      })
}
export const add_expense = async (table) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/add_expense', table).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const remove_expense = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/remove_expense', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const update_expense = async (exp) => {
  await refreshToken();
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

export const report_expense = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'));
  axios.defaults.headers.common['x-access-token'] = secret.access_token;
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/report', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const get_parameter = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get('/manager/expense/get_parameter', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const require_expense = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/require', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const config_expense = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/config', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const find_expense = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/find', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const check_expense = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/check', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const submit_expense = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/confirm_expense', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const get_room_type = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.get('/manager/expense/get_room_type', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const get_detail_room_type = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/detail_room', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const update_detail_room_type = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/update_room_type', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const info_room = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/info_room', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}

export const reset_room = async (exp) => {
  await refreshToken();
  const secret = JSON.parse(localStorage.getItem('secret'))
  axios.defaults.headers.common['x-access-token'] = secret.access_token
  return new Promise((resolve, reject) => {
    axios.post('/manager/expense/reset_room', exp).then(result => { 
      resolve(result);
    })
    .catch(error => reject(error));
  })
}


