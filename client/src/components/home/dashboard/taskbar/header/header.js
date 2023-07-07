import { useContext } from 'react';
import { ProjectsContext } from "../../../../../app";

import HeaderTitle from './_header-title';
import HeaderProjectColor from './_header-color';

export default function TaskbarHeader()
{
  const { activeProject } = useContext(ProjectsContext);

  return (
    <h1 className="header">
      <HeaderProjectColor/>
      <HeaderTitle value={ activeProject?.name }/>
    </h1>
  )
}