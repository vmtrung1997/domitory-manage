import axios from 'axios'
import { browserHistory } from 'react-router-dom'
axios.defaults.baseURL = 'http://localhost:4000/api'
axios.interceptors.response.use(function (response) {
  return response;
}, function(error) {
  if (error.status === 500) {
    return window.location.href = '/500'
  }
  if (error.status === 401) {
    return window.location.href = '/401'
  }
  return Promise.reject(error);
});

export default axios