import {combineReducers} from 'redux';
import userProfile from './profileReducer';


const rootReducer = combineReducers({
  userProfile
})

export default rootReducer;