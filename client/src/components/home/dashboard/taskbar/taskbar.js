
import { useContext } from 'react';
import { ProjectsContext } from "app";

import { HeaderColor, HeaderTitle } from './header/header'
import OptionsDelete from './options/options-delete';

export default function Taskbar()
{
  const { activeProject } = useContext(ProjectsContext);

  return (
    <div className="taskbar">
      <h1 className="taskbar__header">
        <HeaderColor/>
        <HeaderTitle title={ activeProject?.name }/>
      </h1>

      <div className="taskbar__options">
        <OptionsDelete/>
      </div>
    </div>
  )
}