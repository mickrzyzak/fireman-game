import { combineReducers } from 'redux';
import map from './map';
import client from './client';
import firemans from './firemans';

const allReducers = combineReducers({
  map,
  client,
  firemans,
});

export default allReducers;
