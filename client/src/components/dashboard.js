import React, { useContext } from "react";
import { ProjectsContext, ActiveProjectContext } from "../app";

import ProjectCreator from './dashboard/creator-project';
import TaskCreator from './dashboard/creator-task';

import Tasks from './dashboard/tasks';
import Searchbar from './dashboard/searchbar';
import UpperSection from './dashboard/taskbar';

export default function Dashboard()
{
  const { projects, setProjects } = useContext(ProjectsContext);
  const { activeProject, setActiveProject } = useContext(ActiveProjectContext);

  function DashboardContent()
  {
    if (projects.length > 0)
    {
      return (
        <>
          <Searchbar/>
          <UpperSection activeProject={ activeProject }/>
          <Tasks activeProject={ activeProject }/>
        </>
      )
    }

    else
      return <p>no projects found</p>
  }

  return (
    <div className="dashboard" id="dashboard">
      <TaskCreator/>
      <ProjectCreator/>
      <DashboardContent/>
    </div>
  )
}