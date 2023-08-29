import { useContext } from 'react';
import { UserContext, ReducerContext } from 'app';
import axios, { setResponseError } from 'utils/axiosConfig';

import { ButtonGlow } from 'components/utils/buttons/buttons';

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
    .then(() => 
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
      <a className='user__data'>
        <img 
          className='user__img' 
          src='img/capybara.jpg' 
          alt='user_pic'
        />
        
        <div 
          className='user__name'
          children={ user?.name }
        />
      </a>

      <ButtonGlow 
        onClick={ showConfirmation } 
        icon={ faRightFromBracket } 
        fontSize='1.8rem'
      />
    </div>
  )
}