import axios from 'axios';

const instance = axios.create({ baseURL: process.env.REACT_APP_SERVER_ROUTE });

export function setResponseError(err, dispatch)
{
  if (err.response)
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
        header: "Failed to delete project",
        message: "Failed to communicate with server"
      } 
    })
  }

  dispatch({ type: 'showNotification' });
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

  dispatch({ type: 'showNotification' })
}

export default instance;