import { useContext } from 'react';
import { UserContext } from '../../../../app';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function User()
{
  const { user } = useContext(UserContext);

  function logout()
  {
    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user/logout`, 
    {
      userID: user.id,
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(() => 
    {
      window.location.reload()
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    })
    .catch(err => console.log(err))
  }

  return (
    <div className='user'>
      <a className='user__data' href='/'>
        <img className='user__img' src='img/capybara.jpg' alt='user_pic'></img>
        <div className='user__name'>{ user?.name }</div>
      </a>
      <div className='user__signout' onClick={ logout }><FontAwesomeIcon icon={ faRightFromBracket }/></div>
    </div>
  )
}