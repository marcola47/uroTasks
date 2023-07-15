import { useContext, useRef } from 'react';
import { UserContext, ReducerContext } from '../../app';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';

export default function LoginForm()
{
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);
  const { dispatch } = useContext(ReducerContext);

  const emailRef = useRef();
  const passwordRef = useRef();

  function login()
  {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '' || !emailRegex.test(email))
    {
      dispatch(
      { 
        type: 'setNotification', 
        payload: 
        { 
          type: "error",
          header: "Failed to login",
          message: "Email format not accepted" 
        } 
      })
      
      dispatch({ type: 'showNotification' })
      return;
    }
    
    if (password === '' || password.length < 8)
    {
      dispatch(
      { 
        type: 'setNotification', 
        payload: 
        { 
          type: "error",
          header: "Failed to login",
          message: "Your password must be atleast 8 characters long" 
        } 
      })

      dispatch({ type: 'showNotification' })
      return;
    }

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user/login`, 
    { 
      email: email, 
      password: password 
    })
    .then(res => 
    {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      
      setUser(res.data.result);
      navigate('/');
    })
    .catch(err => 
    {
      if (err.response)
      {
        dispatch(
        { 
          type: 'setNotification', 
          payload: 
          { 
            type: "error",
            header: "Failed to login",
            message: err.response.data.message 
          } 
        })
      }

      else
      {
        dispatch(
        { 
          type: 'setNotification', 
          payload: 
          { 
            type: "error",
            header: "Failed to login",
            message: "Failed to communicate with server"
          } 
        })
      }

      dispatch({ type: 'showNotification' })
    })
  }

  return (
    <div className="login">
      <div className="login__form">
        <img src="img/logo--dark_theme.svg" className="login__logo" alt="" />

        <div className="login__inputs">
          <div className="login__input">
            <FontAwesomeIcon icon={ faEnvelope }/>
            <input type="email" ref={ emailRef } name="email" id="email" placeholder="Email"/>
          </div>

          <div className="login__input">
            <FontAwesomeIcon icon={ faKey }/>
            <input type="password" ref={ passwordRef } name="password" id="password" placeholder="password" />
          </div>

          <p className='login__navigate' onClick={ () => {navigate('/register')} }>Not registed yet? Click me</p>
        </div>

        <button className="login__auth" onClick={ login }>LOGIN</button>
      </div>

      <div className="login__background">
        <img src="img/loading.svg" alt="" />
      </div>
    </div>
  )
}