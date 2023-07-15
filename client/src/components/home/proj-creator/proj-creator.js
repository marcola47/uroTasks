import { useState, useContext, useRef  } from 'react';
import { ProjectsContext, ReducerContext, UserContext } from "../../../app";
import { ToggleMenuContext } from '../../../pages/home';
import { v4 as uuid } from 'uuid';
import axios from 'axios';


import { ButtonGlow } from '../../utils/buttons/buttons';
import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ProjCreator()
{
  const projectNameRef = useRef();
  
  const { toggleMenu } = useContext(ToggleMenuContext);
  const { user, setUser } = useContext(UserContext);
  const { state, dispatch } = useContext(ReducerContext);
  const { projects, setProjects } = useContext(ProjectsContext);

  const [color, setColor] = useState('#4b99cc');
  const [pickerActive, setPickerActive] = useState(false);

  async function createProject()
  {
    let name = projectNameRef.current.value;
    if (name === '') return;

    const newProject = 
    { 
      id: uuid(), 
      name: name,
      color: color,
      activeTasks: 0,
      users: [user.id]
    };

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project/create`, 
    {
      newProject: newProject,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(res => 
    {
      // set confirmation
      setProjects([...projects, newProject]);

      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user/update?type=projectList&method=add`, 
      {
        userID: user.id, 
        projectID: newProject.id,
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken")
      })
      .then(res => setUser({ ...user, activeProject: newProject.id, projects: [...projects, newProject.id] }))
      .catch(err => {/* set error */})
    })
    .catch(err => {/* set error */})

    if (state.isMenuHidden === false)
      toggleMenu();

    dispatch({ type: 'projCreatorShown' }); 
    projectNameRef.current.value = '';
  }

  function ColorPicker()
  {
    return (
      <>
        <div onClick={ () => {setPickerActive(!pickerActive)} } className='chrome-picker__bg'/>
        <ChromePicker color={ color } onChangeComplete={ (color) => {setColor(color.hex)} }/> 
      </>
    )
  }

  function ColorInput()
  {
    const colorStyle = {backgroundColor: color, color: color, borderRadius: "3px",};
    return <div className='input-color' style={colorStyle}>.</div>
  }

  function toggleProjectCreator()
  {
    if (state.isMenuHidden === false)
      toggleMenu();

    dispatch({ type: 'projCreatorShown' })
  }

  return (
    <>
      <div className={`proj-creator__bg ${state.isProjCreatorShown ? 'proj-creator__bg--shown' : ''}`} onClick={ toggleProjectCreator }/>

      <div className={`proj-creator ${state.isProjCreatorShown ? 'proj-creator--shown' : ''}`}>
        <h2 className="proj-creator__title">CREATE PROJECT <FontAwesomeIcon icon={ faBarsProgress }/> </h2>
        <ButtonGlow onClick={ toggleProjectCreator } icon={ faXmark }/>
        
        <input className="proj-creator__input" id="input-1" ref={ projectNameRef } type="text" placeholder="Name of the project" autoFocus/>
        <button className="proj-creator__input" id="input-2" onClick={ () => {setPickerActive(!pickerActive)} }><ColorInput/></button>
        {pickerActive ? <ColorPicker/> : null}
        
        <button className="proj-creator__submit" onClick={ createProject }>CONFIRM</button>
      </div>
    </>
  )
}