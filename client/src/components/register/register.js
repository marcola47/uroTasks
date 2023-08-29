import { useContext, useRef } from 'react';
import { UserContext, ReducerContext } from '../../app';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';

export default function Register()
{
  const { dispatch } = useContext(ReducerContext);
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

    const clientError = 
    {
      clientSide: true,
      header: "Failed to register",
      message: ""
    }

    if (name === '' || email === '' || password === '' || passwordConfirm === '')
    {
      clientError.message = "Make sure to fill all the necessary data";
      setResponseError(clientError, dispatch);
      return;
    }
      
    if (!emailRegex.test(email))
    {
      clientError.message = "Make sure your email is in the correct format";
      setResponseError(clientError, dispatch);
      return;
    }

    if (password !== passwordConfirm)
    {
      clientError.message = "Make sure both password fields match";
      setResponseError(clientError, dispatch);
      return;
    }

    if (password.length < 8)
    {
      clientError.message = "Your password must be atleast 8 characters long";
      setResponseError(clientError, dispatch);
      return;
    }
    
    const newUser =
    {
      id: uuid(),
      name: name,
      email: email,
      password: password,
      ActiveProject: null,
      projects: []
    }

    axios.post(`/g/user/create`, newUser)
    .then(res => 
    {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      setUser(newUser);
      navigate('/');
    })
    .catch(err => setResponseError(err, dispatch))
  }

  return (
    <div className="reg">
      <div className="reg__form">
        <img 
          src="img/logo--written--dark.svg" 
          className="reg__logo" 
          alt="" 
        />

        <div className="reg__inputs">
          <div className="reg__input reg__input--name">
            <FontAwesomeIcon icon={ faUser }/>
            <input 
              type="text" 
              ref={ nameRef } 
              name="name" 
              id="name" 
              placeholder="Name"
            />
          </div>

          <div className="reg__input reg__input--email">
            <FontAwesomeIcon icon={ faEnvelope }/>
            <input 
              type="email" 
              ref={ emailRef } 
              name="email" 
              id="email" 
              placeholder="Email"
            />
          </div>

          <div className="reg__input reg__input--password">
            <FontAwesomeIcon icon={ faKey }/>
            <input 
              type="password" 
              ref={ passwordRef } 
              name="password--confirm" 
              id="password--confirm" 
              placeholder="Password"
            />
          </div>

          <div className="reg__input reg__input--password">
            <FontAwesomeIcon icon={ faKey }/>
            <input
              type="password" 
              ref={ passwordConfirmRef } 
              name="password" 
              id="password" 
              placeholder="Confirm your password"
            />
          </div>

          <p 
            className='reg__navigate' 
            onClick={ () => {navigate('/login')} }
            children="Already have an account? Click me"
          />
        </div>

        <button 
          className="reg__auth" 
          onClick={ register }
          children="REGISTER"
        />
      </div>

      <div className="reg__background">
        <img src="img/logo--circle.svg" alt="" />
      </div>
    </div>
  )
}