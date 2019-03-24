const initialState = {
  school: {},
  floor: {},
  room: {},
  author: {},
}

export default function general(state = initialState, action) {
  switch (action.type) {
    case 'GET_PARAM_SCHOOL':
      return (
        {
          ...action.payload
        });
    default:
      return state;
  }
}