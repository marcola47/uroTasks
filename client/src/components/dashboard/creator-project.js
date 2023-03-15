import { useContext, useRef } from 'react';
import { ProjectsContext, ShowProjectCreatorContext } from "../../app";

import { v4 } from 'uuid';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

export default function GetProjectData()
{
  const { projects, setProjects } = useContext(ProjectsContext);
  const showProjectCreator = useContext(ShowProjectCreatorContext);
  
  const projectNameRef = useRef();
  const projectColorRef = useRef();

  function createProject()
  {
    let name = projectNameRef.current.value;
    let color = projectColorRef.current.value;
    if (name === '' || color === '') return;

    const newProject = { id: v4(), active: false, name: name, color: color, todo: [], doing: [], done: [] };

    if (projects.length === 0)
      newProject.active = true;
      
    const newProjects = [...projects, newProject];
    setProjects(newProjects);
    showProjectCreator();

    projectNameRef.current.value = '';
    projectColorRef.current.value = '';
  }

  return (
    <div className="projects-creator-background" id="projects-creator-background">
      <div className="projects-creator" id="projects-creator">
        <h2 className="creator-title">CREATE PROJECT <FontAwesomeIcon icon={ faBarsProgress }/> </h2>
        <div className='btn-close' onClick={ showProjectCreator }> <FontAwesomeIcon icon={ faXmark }/> </div>

        <input className="creator-input" id="input-1" ref={ projectNameRef } type="text" placeholder="Name of the project"/>
        <input className="creator-input" id="input-2" ref={ projectColorRef } type="text" placeholder="Color (#f0f0f0)"/>
        <button className="creator-btn" onClick={ createProject }>CONFIRM</button>
      </div>
    </div>
  )
}