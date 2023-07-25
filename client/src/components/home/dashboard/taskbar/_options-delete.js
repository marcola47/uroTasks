import { useContext } from 'react';
import { ProjectsContext, UserContext, ReducerContext } from "app";
import axios, { setResponseConfirmation, setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function OptionsDelete()
{
  const { user, setUser } = useContext(UserContext);
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { dispatch } = useContext(ReducerContext);

  function deleteProject()
  {  
    dispatch({ type: 'confirmationShown', payload: false })

    axios.post(`/project/delete`, 
    {
      userID: user.id, 
      projectID: activeProject.id,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
      
    })
    .then(_ => 
    {
      setProjects(projects.filter(project => project.id !== activeProject.id));
      setActiveProject(null);
      setUser(prevUser => ({ ...prevUser, activeProject: "0" }));
      setResponseConfirmation("Succesfully deleted project", "Open another project from the menu or create a new one", dispatch)
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
        header: "Are you sure you want to delete this project?",
        message: "This action is not reversible and all project data will be lost forever.",
        className: 'btn--confirmation--negative',
        confirmation: "Yes, I want to delete this project",
        rejection: "No, I'm keeping this project",
        function: deleteProject
      } 
    })

    dispatch({ type: 'confirmationShown', payload: true })
  }

  return (
    // fix: the trash icon turns red whenever any confirmation is shown
    <div className="taskbar__option taskbar__option--delete" onClick={ showConfirmation }>
      <FontAwesomeIcon icon={ faTrashCan }/>  
    </div>
  )
}