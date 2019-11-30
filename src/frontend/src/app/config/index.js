import axios from 'axios'
axios.defaults.baseURL = 'http://35.247.132.2:4001/api' //  'http://localhost:4000/api' //  
axios.interceptors.response.use(function (response) {
  return response;
}, function(error) {
  if (error.response){
    if (error.response.status === 500) {
      // window.alert('500 error')
      // window.location = '/500'
      return;
    }
    else if (error.response.status === 401) {
      localStorage.removeItem('secret')
      window.location = '/'
      return;
    }
  }
  return Promise.reject(error);
});

export default axios