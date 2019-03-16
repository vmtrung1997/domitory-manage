import {combineReducers} from 'redux';
import userProfile from './profileReducer';
import specialized from './specializedReducer';
import school from './schoolReducer';
import bill from './billReducer';

const rootReducer = combineReducers({
  userProfile,
  specialized,
  school,
  bill
})

export default rootReducer;