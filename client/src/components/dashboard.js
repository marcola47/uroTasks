import React, { useContext } from "react";
import { ProjectsContext, ReducerContext } from "../app";

import Tasks from './dashboard/tasks';
import Searchbar from './dashboard/searchbar';
import UpperSection from './dashboard/taskbar';
import ProjectCreator from './projects/creator';

export default function Dashboard()
{
  const { projects } = useContext(ProjectsContext);
  const { state } = useContext(ReducerContext);

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
    <div className={`dashboard ${state.isDashboardMoved ? 'move-dashboard' : ''}`} id="dashboard">
      <ProjectCreator/>
      <DashboardContent/>
    </div>
  )
}