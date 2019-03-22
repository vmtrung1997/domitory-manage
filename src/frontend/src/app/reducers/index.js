import {combineReducers} from 'redux';
import userProfile from './profileReducer';
import specialized from './specializedReducer';
import school from './schoolReducer';
import bill from './billReducer';
import activity from './listActivity';

const rootReducer = combineReducers({
  userProfile,
  specialized,
  school,
  bill,
  activity
})

export default rootReducer;