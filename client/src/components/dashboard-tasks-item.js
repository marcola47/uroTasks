import { useContext } from "react";
import { ProjectsContext } from "../app";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  } from '@fortawesome/free-solid-svg-icons';

export default function ProjectsItem({ tasksItem })
{
  const {projects, setProjects, showProjectCreator} = useContext(ProjectsContext);

  return (
    <li className="tasks-list-item">{tasksItem.text}</li>
  )
}