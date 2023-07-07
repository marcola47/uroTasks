import { useContext, useEffect } from "react";
import { ReducerContext, UserContext } from "../../../../app";
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function Project({ itemData })
{
  const { user, setUser } = useContext(UserContext);
  const { state, dispatch } = useContext(ReducerContext);

  function activateProject()
  {
    if (itemData.id !== user.activeProject)
    {
      if (window.innerWidth < 1337 && state.isMenuHidden === false)
      {
        dispatch({ type: 'menuHidden'      });
        dispatch({ type: 'dashboardMoved'  });
        dispatch({ type: 'searchbarSpaced' });  
      }  
  
      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user-update?type=activeProject`, [user.id, itemData.id])
        .then(res => 
        {
          console.log(res);
          setUser({ ...user, activeProject: itemData.id });
        })
        .catch( err => {console.log(err)} )
    }
  }

  return (
    <li className='project' onClick={ activateProject }>
      <div className='project__data'>
        <span style={{ color: itemData?.color }}><FontAwesomeIcon icon={ faSquare }/></span> 
        <div className='project__name'>{ itemData?.name }</div>
      </div> 
  
      <div className='project__total-tasks'>{ itemData?.activeTasks < 100 ? itemData?.activeTasks : 99 }</div>
    </li>
  )
}