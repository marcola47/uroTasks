import { useContext, useRef, useState } from 'react';
import { UserContext } from '../../app';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import { Error } from '../utils/popups/popups';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';

export default function RegForm()
{
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  function register()
  {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const passwordConfirm = passwordConfirmRef.current.value;

    if (name === '' || email === '' || password === '' || passwordConfirm === '')
    {
      setError('Make sure to fill in all the necessary data');
      return;
    }
      
    if (!emailRegex.test(email))
    {
      setError('Make sure you email is in the correct format')
      return;
    }

    if (password !== passwordConfirm)
    {
      setError('Make sure both password fields match')
      return;
    }

    if (password.length < 8)
    {
      setError('Your password must be atleast 8 characters long');
      return;
    }
    
    const newUser =
    {
      id: uuid(),
      name: name,
      email: email,
      password: password,
      ActiveProject: '0',
      projects: []
    }

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user/create`, newUser)
    .then(res => 
    {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      setUser(newUser);
      navigate('/');
    })
    .catch(err => 
    {
      if (err.response)
        setError(err.response.data);

      else
        setError("Unable to communicate with server")
    })
  }

  return (
    <div className="reg">
      <div className="reg__form">
        <img src="img/logo--dark_theme.svg" className="reg__logo" alt="" />

        <div className="reg__inputs">
          <div className="reg__input reg__input--name">
            <FontAwesomeIcon icon={ faUser }/>
            <input type="text" ref={ nameRef } name="name" id="name" placeholder="Name"/>
          </div>

          <div className="reg__input reg__input--email">
            <FontAwesomeIcon icon={ faEnvelope }/>
            <input type="email" ref={ emailRef } name="email" id="email" placeholder="Email"/>
          </div>

          <div className="reg__input reg__input--password">
            <FontAwesomeIcon icon={ faKey }/>
            <input type="password" ref={ passwordRef } name="password--confirm" id="password--confirm" placeholder="Password" />
          </div>

          <div className="reg__input reg__input--password">
            <FontAwesomeIcon icon={ faKey }/>
            <input type="password" ref={ passwordConfirmRef } name="password" id="password" placeholder="Confirm your password" />
          </div>

          <p className='reg__navigate' onClick={ () => {navigate('/login')} }>Have an account already? Click me</p> 
        </div>

        <button className="reg__auth" onClick={ register }>REGISTER</button>
      </div>

      <div className="reg__background">
        <img src="img/loading.svg" alt="" />
      </div>

      <Error header="Failed to register user" error={ error } setError={ setError }/>
    </div>
  )
}