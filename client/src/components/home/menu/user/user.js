import { useContext } from 'react';
import { UserContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function MenuUser()
{
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(ReducerContext);

  function logout()
  {
    axios.post(`/g/user/logout`, 
    {
      userID: user.id,
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(_ => 
    {
      window.location.reload()
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    })
    .catch(err => setResponseError(err, dispatch))
  }

  function showConfirmation()
  {
    dispatch(
    { 
      type: 'setConfirmation',
      payload: 
      {
        header: "Are you sure you want to log out?",
        message: "",
        className: 'btn--confirmation--neutral',
        confirmation: "Yes, I want to log out",
        rejection: "No, I'll keep logged in",
        function: logout
      } 
    })

    dispatch({ type: 'confirmationShown', payload: true })
  }

  return (
    <div className='user'>
      <a className='user__data' href='/'>
        <img className='user__img' src='img/capybara.jpg' alt='user_pic'></img>
        <div className='user__name'>{ user?.name }</div>
      </a>
      <div className='user__signout' onClick={ showConfirmation }><FontAwesomeIcon icon={ faRightFromBracket }/></div>
    </div>
  )
}