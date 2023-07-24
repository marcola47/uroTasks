import { useContext } from 'react';
import { ProjectsContext, ReducerContext } from 'app';
import { ToggleEditorContext } from '../editor';
import axios, { setResponseError } from 'utils/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMultiply } from '@fortawesome/free-solid-svg-icons';

export default function OptionDelete({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { toggleEditor } = useContext(ToggleEditorContext);
  const { dispatch } = useContext(ReducerContext);

  function deleteTask()
  {
    const taskList = activeProject.tasks;
    const taskIndex = taskList.findIndex(taskItem => taskItem.id === task.id);
    const position = taskList[taskIndex].position;
    taskList.splice(taskIndex, 1);
    
    const projectsCopy = [...projects].map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    })

    toggleEditor();

    axios.post('/task/delete', 
    { 
      projectID: activeProject.id, 
      taskID: task.id, 
      taskType: task.type, 
      position: position,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(res => 
    {
      setActiveProject(prevActiveProject => ({ ...prevActiveProject, tasks: taskList }));
      setProjects(projectsCopy);
    })
    .catch(err => setResponseError(err, dispatch))
  }

  return (
    <div className='option option--remove' onClick={ deleteTask }>
      <div className='option__icon'><FontAwesomeIcon icon={ faMultiply }/></div>
    </div>
  )
}