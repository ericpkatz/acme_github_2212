import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk'
import axios from 'axios';

const products = (state = [], action)=> {
  if(action.type === 'SET_PRODUCTS'){
    return action.products;
  }
  return state;
};

const auth = (state = {}, action)=> {
  if(action.type === 'SET_AUTH'){
    return action.auth;
  }
  return state;
};

export const fetchProducts = ()=> {
  return async(dispatch)=> {
    return dispatch({ type: 'SET_PRODUCTS', products: (await axios.get('/api/products')).data});
  };
};

export const loginWithToken = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.get(`/api/auth/${token}`);
      dispatch({ type: 'SET_AUTH', auth: response.data });
    }
  };
};

export const logout = ()=> {
  return (dispatch)=> {
    window.localStorage.removeItem('token');
    dispatch({ type: 'SET_AUTH', auth: {} });
  };
};

export const login = (credentials)=> {
  return async(dispatch)=> {
    const response = await axios.post('/api/auth', credentials);
    const token = response.data.token;
    window.localStorage.setItem('token', token);
    dispatch(loginWithToken());
    //dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

export const updateAuth = (auth)=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    const response = await axios.put(`/api/auth/${ token}`, auth);
    dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

export const register = (credentials)=> {
  return async(dispatch)=> {
    const response = await axios.post('/api/auth/register', credentials);
    const token = response.data.token;
    window.localStorage.setItem('token', token);
    dispatch(loginWithToken());
    //dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

const reducer = combineReducers({
  products,
  auth
});

const store = createStore(reducer, applyMiddleware(thunk, logger));


export default store;
