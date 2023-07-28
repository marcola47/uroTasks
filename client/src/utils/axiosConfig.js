import axios from 'axios';

const instance = axios.create({ baseURL: process.env.REACT_APP_SERVER_ROUTE });

instance.interceptors.response.use(
  (res) => 
  {
    const newAccessToken = res.data.newAccessToken;

    if (newAccessToken)
      localStorage.setItem('accessToken', newAccessToken);

    return res;
  },

  (err) => { return Promise.reject(err) }
);

export function setResponseError(err, dispatch)
{
  if (err.clientSide) 
  {
    dispatch(
    {
      type: 'setNotification',
      payload: 
      { 
        type: "error",
        header: err.header,
        message: err.message 
      } 
    })
  }

  else if (err.response)
  {
    dispatch(
    {
      type: 'setNotification',
      payload: 
      { 
        type: "error",
        header: err.response.data.header,
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
        header: "Failed to perform action",
        message: "Failed to communicate with server"
      } 
    })
  }

  dispatch({ type: 'notificationShown', payload: true });
}

export function setResponseConfirmation(header, message, dispatch)
{
  dispatch(
  {
    type: 'setNotification',
    payload: 
    { 
      type: "confirmation",
      header: header,
      message: message
    } 
  })

  dispatch({ type: 'notificationShown', payload: true })
}

export default instance;