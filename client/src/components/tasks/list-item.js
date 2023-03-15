import { useContext } from "react";
import { ProjectsContext } from "../../app";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

export default function ProjectsItem({ tasksItem })
{
  const {projects, setProjects} = useContext(ProjectsContext);

  return (
    <li className="tasks-list-item">
      <div className="list-item-text">{tasksItem.text}</div>
      <div className="list-item-options"><FontAwesomeIcon icon={faPencil}/></div>
    </li>
  )
}