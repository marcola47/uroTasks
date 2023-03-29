import React, { useContext } from "react";
import { ProjectsContext } from "../app";

import Tasks from './dashboard/tasks';
import Searchbar from './dashboard/searchbar';
import UpperSection from './dashboard/taskbar';
import ProjectCreator from './dashboard/creator-project';

export default function Dashboard()
{

  const { projects } = useContext(ProjectsContext);

  function DashboardContent()
  {
    if (projects.length > 0)
    {
      return (
        <>
          <Searchbar/>
          <UpperSection/>
          <Tasks/>
        </>
      )
    }

    else
      return <p>no projects found</p>
  }

  return (
    <div className="dashboard" id="dashboard">
      <ProjectCreator/>
      <DashboardContent/>
    </div>
  )
}