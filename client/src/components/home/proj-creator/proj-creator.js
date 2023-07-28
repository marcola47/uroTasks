import { useState, useContext, useRef  } from 'react';
import { ProjectsContext, ReducerContext, UserContext } from "app";
import { v4 as uuid } from 'uuid';
import axios, { setResponseConfirmation, setResponseError } from 'utils/axiosConfig';

import { TransitionOpacity } from 'components/utils/transitions/transitions';
import { ButtonGlow } from 'components/utils/buttons/buttons';
import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ProjCreator()
{
  const projectNameRef = useRef();
  
  const { user, setUser } = useContext(UserContext);
  const { projects, setProjects } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

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
      users: [user.id],
      types: 
      [
        {
          id: uuid(),
          name: "todo",
          position: 1
        },
        {
          id: uuid(),
          name: "doing",
          position: 2
        },
        {
          id: uuid(),
          name: "done",
          position: 3
        }
      ]
    };

    axios.post(`/a/project/create`, 
    {
      userID: user.id, 
      newProject: newProject,
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken")
    })
    .then(_ => 
    {
      setProjects(prevProjects => ([...prevProjects, newProject]));
      setUser(prevUser => ({ ...prevUser, activeProject: newProject.id, projects: [...projects, newProject.id] }))
      setResponseConfirmation("Successfully created project", "", dispatch)
    })
    .catch(err => setResponseError(err, dispatch))

    if (window.innerWidth < 1337 && state.menuShown === true)
      dispatch({ type: 'menuShown', payload: false });

    dispatch({ type: 'projCreatorShown', payload: false }); 
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
    const colorStyle = { backgroundColor: color, color: color, borderRadius: "3px" };
    
    return (
      <button className="proj-creator__input" onClick={ () => {setPickerActive(!pickerActive)} }>
        <div className='proj-creator__color' style={ colorStyle }>.</div>
      </button>
    ) 
  }

  return (
    <TransitionOpacity onClick={ () => {dispatch({ type: 'projCreatorShown', payload: false })} } id='proj-creator'>
      <div className="proj-creator" onClick={ e => {e.stopPropagation()} }>
        <h2 className="proj-creator__title">CREATE PROJECT <FontAwesomeIcon icon={ faBarsProgress }/> </h2>
        <ButtonGlow onClick={ () => {dispatch({ type: 'projCreatorShown', payload: false })} } icon={ faXmark }/>
        
        <input className="proj-creator__input" ref={ projectNameRef } type="text" placeholder="Name of the project" autoFocus/>
        <ColorInput/>
        { pickerActive && <ColorPicker/> }
        
        <button className="proj-creator__submit" onClick={ createProject }>CREATE</button>
      </div>
    </TransitionOpacity>
)
}