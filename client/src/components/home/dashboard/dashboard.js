import React, { useContext } from "react";
import { ProjectsContext, ReducerContext } from "app";

import { Screensaver, NoActiveProject } from './screensaver/screensaver';
import Searchbar from './searchbar/searchbar';
import Taskbar from './taskbar/taskbar';
import Tasks from "./tasks/tasks";

function Dashboard()
{
  const { activeProject } = useContext(ProjectsContext);
  const { state } = useContext(ReducerContext);

  if (!activeProject)
    return <NoActiveProject/>

  if (activeProject?.tasks === undefined)
    return <Screensaver/>

  return (
    <div className={`dashboard ${state.menuShown && 'dashboard--moved' }`} id="dashboard">
      <Searchbar/>
      <Taskbar/> 
      <Tasks/>
    </div>
  )
}

const MemoizedDashboard = React.memo(Dashboard);
export default MemoizedDashboard;