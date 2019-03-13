import {combineReducers} from 'redux';
import userProfile from './profileReducer';
import specialized from './specializedReducer';

const rootReducer = combineReducers({
  userProfile,
  specialized,
})

export default rootReducer;