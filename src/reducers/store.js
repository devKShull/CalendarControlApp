import { combineReducers, createStore } from 'redux';
import eventReducer from './eventReducer';
import weekReducer from './weekReducer';

const rootReducer = combineReducers({
    event: eventReducer,
    week: weekReducer,
});

export const store = createStore(rootReducer);
