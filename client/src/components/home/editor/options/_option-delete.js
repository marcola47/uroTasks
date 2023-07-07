import { useContext } from 'react';
import { ProjectsContext } from '../../../../app';
import { ScrollContext, ToggleMenuContext } from '../../../../pages/home';
import { ToggleEditorContext } from '../editor';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMultiply } from '@fortawesome/free-solid-svg-icons';

export default function OptionDelete({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { setScrollTo } = useContext(ScrollContext);
  const toggleEditor = useContext(ToggleEditorContext);

  function deleteTask()
  {
    const scrollOffset = document.getElementById(task.type).offsetLeft;
    setScrollTo(scrollOffset);

    const taskList = activeProject.tasks;
    const taskIndex = taskList.findIndex(taskItem => taskItem.id === task.id);
    const position = taskList[taskIndex].position;
    taskList.splice(taskIndex, 1);
    
    const projectsCopy = projects.map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    })

    toggleEditor();

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-delete`, [activeProject.id, task.id, task.type, position])
      .then(res => 
      {
        console.log(res);
        setActiveProject({ ...activeProject, tasks: taskList });
        setProjects(projectsCopy);
      })
      .catch( err => {console.log(err) })
  }

  return (
    <div className='option option--remove' onClick={deleteTask}>
      <div className='option__icon'><FontAwesomeIcon icon={ faMultiply }/></div>
    </div>
  )
}