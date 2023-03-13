import { useContext, useRef } from 'react';
import { ProjectsContext } from "../app";
import { v4 } from 'uuid';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

export default function GetProjectData()
{
  const {projects, setProjects, showProjectCreator} = useContext(ProjectsContext);
  
  const projectNameRef = useRef();
  const projectColorRef = useRef();

  function createProject()
  {
    let name = projectNameRef.current.value;
    let color = projectColorRef.current.value;
    if (name === '' || color === '') return;

    const newProject = {id: v4(), name: name, color: color, todo: [], doing: [], done: []};
    const newProjects = [...projects, newProject];

    setProjects(newProjects);
    console.log(`project ${newProject.name} with color ${newProject.color} created`);

    showProjectCreator();

    projectNameRef.current.value = '';
    projectColorRef.current.value = '';
  }

  return (
    <div className="projects-creator-background" id="projects-creator-background">
      <div className='btn-close' onClick={showProjectCreator}> <FontAwesomeIcon icon={faXmark}/> </div>

      <div className="projects-creator">
        <h2 className="creator-title">CREATE PROJECT <FontAwesomeIcon icon={faBarsProgress}/> </h2>
        <input className="creator-input" id="input-name" ref={projectNameRef} type="text" placeholder="Name of the project"/>
        <input className="creator-input" id="input-color" ref={projectColorRef} type="text" placeholder="Color (#f0f0f0)"/>
        <button className="creator-btn" onClick={createProject}>CONFIRM</button>
      </div>
    </div>
  )
}