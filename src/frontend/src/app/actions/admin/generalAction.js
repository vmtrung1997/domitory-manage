import axios from "axios";
import refreshToken from "../../../utils/refresh_token";

export async function getParam(name) {
  await refreshToken();
  let secret = JSON.parse(localStorage.getItem('secret'));
  axios.get(`/manager/getElement/` + name,  {
    headers: { 'x-access-token': secret.access_token }
  }).then(result => {
    switch(name){
      case 'school':
        return{
          type: 'GET_PARAM_SCHOOL_SUCCESS',
          payload: result.data
        };
      case 'floor':
        return{
          type: 'GET_PARAM_FLOOR_SUCCESS',
          payload: result.data
        };
      case 'room':
        return{
          type: 'GET_PARAM_ROOM_SUCCESS',
          payload: result.data
        };
    }
  }).catch(err => {
    switch(name){
      case 'school':
        return{
          type: 'GET_PARAM_SCHOOL_FAIL',
          payload: err
        };
      case 'floor':
        return{
          type: 'GET_PARAM_FLOOR_FAIL',
          payload: err
        };
      case 'room':
        return{
          type: 'GET_PARAM_ROOM_FAIL',
          payload: err
        };
    }
  })

}