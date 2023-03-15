import React, { useContext } from "react";
import { ProjectsContext, ActiveProjectContext } from "../app";

import ProjectsCreator from './projects-creator';
import TasksList from './tasks-list';
import TasksCreator from './tasks-creator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowDownWideShort, faMagnifyingGlass, faEllipsisVertical, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export const ShowTaskCreatorContext = React.createContext();

export default function Dashboard()
{
  const {projects, setProjects} = useContext(ProjectsContext);
  const {activeProject, setActiveProject} = useContext(ActiveProjectContext);

  function showTaskCreator()
  {
    const taskCreatorElement = document.getElementById('tasks-creator');
    taskCreatorElement.classList.toggle('tasks-creator-shown')

    const taskCreatorBackgroundElement = document.getElementById('tasks-creator-background');
    taskCreatorBackgroundElement.classList.toggle('tasks-creator-background-shown')     
  }

  function deleteProject()
  {
    let placeholderProjects;

    if (projects.length > 1)
    {
      placeholderProjects = projects.filter(project => project.id !== activeProject.id);
      placeholderProjects[0].active = true;
      
      setProjects(placeholderProjects);
    }

    else
      setProjects([]);
  }

  function DashboardTasks()
  {
    if (projects.length > 0)
    {
      return (
        <>
          <div className="dashboard-upper">
            <h1 className="dashboard-upper-title" id="dashboard-project-title">{activeProject.name}</h1>
            <div className="upper-controls-filter"><FontAwesomeIcon icon={faArrowDownWideShort}/></div>
            <div className="upper-controls-delete_project" onClick={deleteProject}><FontAwesomeIcon icon={faTrashCan}/></div>
            <div className="upper-controls-add_task" onClick={showTaskCreator}><FontAwesomeIcon icon={faPlus}/></div>
          </div>

          <div className="dashboard-tasks" id="dashboard-tasks">
            <div className="dashboard-tasks-item">
              <h2 className="tasks-item-header">TO-DO</h2>
              <div className="tasks-item-options"><FontAwesomeIcon icon={faEllipsisVertical}/></div>
              <TasksList tasks={activeProject.todo}/>
            </div>
            
            <div className="dashboard-tasks-item">
              <h2 className="tasks-item-header">DOING</h2>
              <div className="tasks-item-options"><FontAwesomeIcon icon={faEllipsisVertical}/></div>
              <TasksList tasks={activeProject.doing}/>
            </div>
            
            <div className="dashboard-tasks-item">
              <h2 className="tasks-item-header">DONE</h2>
              <div className="tasks-item-options"><FontAwesomeIcon icon={faEllipsisVertical}/></div>
              <TasksList tasks={activeProject.done}/>
            </div>
          </div>
        </>
      )
    }

    else
      return <p>no projects found</p>
  }

  return (
    <div className="dashboard" id="dashboard">
      <ShowTaskCreatorContext.Provider value={showTaskCreator}>
        <TasksCreator/>
      </ShowTaskCreatorContext.Provider>
      
      <ProjectsCreator/>
    
      <div className="dashboard-searchbar searchbar-when-menu-shown" id="dashboard-searchbar">
        <FontAwesomeIcon icon={faMagnifyingGlass}/>
        <input type="text" placeholder="Seach tasks, tags or projects"/>
      </div>
    
      <DashboardTasks/>

    </div>
  )
}