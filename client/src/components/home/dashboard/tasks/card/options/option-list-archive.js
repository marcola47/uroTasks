import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive } from '@fortawesome/free-solid-svg-icons';

export default function OptionArchiveList({ type })
{
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  function archiveList()
  {
    console.log('oh no')
    console.log(type);
  }

  function showConfirmation()
  {
    dispatch(
    { 
      type: 'setConfirmation',
      payload: 
      {
        header: "Are you sure you want to archive this task list?",
        message: "You can always restore it from the archive.",
        className: 'btn--confirmation--caution',
        confirmation: "Yes, I want to archive this list",
        rejection: "No, I'm keeping this list",
        function: archiveList
      } 
    })

    dispatch({ type: 'confirmationShown', payload: true })
  }
  return (
    <div className="option option--caution" onClick={ showConfirmation }>
      <FontAwesomeIcon icon={ faArchive }/>
      <span>Archive list</span>
    </div>
  )
}