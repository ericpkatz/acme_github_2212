import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './store';
import { useNavigate } from 'react-router-dom';

const Login = ()=> {
  const [username, setUsername ] = useState('');
  const [password, setPassword ] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const _login = async(ev)=> {
    ev.preventDefault();
    const credentials = {
      username,
      password
    };

    try {
      await dispatch(login(credentials));
      navigate('/products');
    }
    catch(ex){

    }
  };
  return (
    <form onSubmit={ _login }>
      <input placeholder='username' value={ username } onChange={ ev => setUsername(ev.target.value)}/>
      <input placeholder='password' value={ password } onChange={ ev => setPassword(ev.target.value) }/>
      <button>Login</button>
    </form>
  );
};

export default Login;
