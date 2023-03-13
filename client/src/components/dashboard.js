import { useContext } from "react";
import { ProjectsContext } from "../app";

import TasksList from './dashboard-tasks-list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard()
{
  const {projects, setProjects, showProjectCreator} = useContext(ProjectsContext);

  const activeProject = projects.filter(project => project.active === true)[0];

  return (
    <div className="dashboard" id="dashboard">
      <div className="dashboard-searchbar">
        <FontAwesomeIcon icon={faMagnifyingGlass}/>
        <input  type="text" placeholder="Seach tasks, tags, texts or projects"/>
      </div>
    
      <div className="dashboard-upper">
        <h1 className="dashboard-upper-title" id="dashboard-project-title">{activeProject.name}</h1>
        <div className="upper-controls-filter"><FontAwesomeIcon icon={faFilter}/> Filter</div>
        <div className="upper-controls-add_task"><FontAwesomeIcon icon={faPlus}/> Add task</div>
      </div>

      <div className="dashboard-tasks" id="dashboard-tasks">
        <div className="dashboard-tasks-item">
          <h2 className="tasks-item-header">TO-DO</h2>
          <TasksList tasks={activeProject.todo}/>
        </div>
        
        <div className="dashboard-tasks-item">
        <h2 className="tasks-item-header">DOING</h2>
          <TasksList tasks={activeProject.doing}/>
        </div>
        
        <div className="dashboard-tasks-item">
        <h2 className="tasks-item-header">DONE</h2>
          <TasksList tasks={activeProject.done}/>
        </div>
      </div>
    </div>
  )
}