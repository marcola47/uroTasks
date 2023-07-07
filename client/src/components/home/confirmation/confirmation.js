import { useContext } from 'react'
import { ProjectsContext, UserContext, ReducerContext } from '../../../app'
import axios from 'axios';

export default function Confirmation({ confirmFunction })
{
  const { user, setUser } = useContext(UserContext);
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  function deleteProject()
  {
    const projectsOld = projects;
    
    dispatch({ type: 'confirmationShown' })

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-delete`, [activeProject.id])
      .then(res => 
      {
        console.log(res); 
        setProjects(projects.filter(project => project.id !== activeProject.id));

        axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user-update?type=projectList&method=delete`, [user.id, activeProject.id])
          .then(res => 
          {
            console.log(res);
            setUser({ ...user, activeProject: "0" });
          })
          .catch( err => {console.log(err)} )
      })
      .catch(err => 
      {
        console.log(err);
        setProjects(projectsOld);
      })
  }

  return (
    <>
      <div className={`confirmation__bg ${state.isConfirmationShown ? 'confirmation__bg--shown' : ''}`} onClick={() => { dispatch({ type: 'confirmationShown' }) }}/>

      <div className={`confirmation ${state.isConfirmationShown ? 'confirmation--shown' : ''}`}>
        <h3 className='confirmation__header'>Are you sure you want to delete this project?</h3>
        
        <div className='confirmation__btns'>
          <div className='btn--confirmation' id='confirmation--cancel' onClick={ () => {dispatch({ type: 'confirmationShown' })} }>CANCEL</div>
          <div className='btn--confirmation' id='confirmation--confirm' onClick={ deleteProject }>DELETE</div>
        </div>
      </div>
    </>
  )
}