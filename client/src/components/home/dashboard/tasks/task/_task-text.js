import { useState, useContext, useRef } from 'react';
import { ProjectsContext } from '../../../../../app';
import { EditingContext } from './task';
import axios from 'axios';

export default function ItemText({ value, taskID }) 
{
  const [inputValue, setInputValue] = useState(value);

  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { isEditing, setIsEditing } = useContext(EditingContext);

  const taskTextRef = useRef();

  function handleContentChange(newContent)
  {
    let isNewContent = false;
    
    if (newContent === "")
      return;
  
    // has to be this way because whent it copies the current tasks, they're already altered
    const tasksOld = JSON.parse(JSON.stringify(activeProject.tasks));

    const taskList = activeProject.tasks.map(taskObj => 
    {
      if (taskObj.id === taskID && taskObj.content !== newContent)
      {
        taskObj.content = newContent;
        isNewContent = true;
      }

      return taskObj;
    });

    const projectsCopy = projects.map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    });

    setActiveProject({ ...activeProject, tasks: taskList });

    if (isNewContent)
    {
      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update?type=content`, [taskID, newContent])
      .then(res => 
      {
        console.log(res);
        setProjects(projectsCopy);
      })
      .catch(err => 
      {
        console.log(err);
        setActiveProject({ ...activeProject, tasks: tasksOld });
      })
    }
  }

  async function handleEdit() 
  {
    await setIsEditing(true);

    const textArea = document.getElementById('text-area');
    const end = textArea.value.length;
  
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
    
    textArea.setSelectionRange(end, end);
    textArea.focus();
  }

  function handleSave() 
  {
    setIsEditing(false);

    if (taskTextRef.current.value !== '')
      handleContentChange(inputValue);
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
  }

  function handleInputGrowth()
  {
    const textArea = document.getElementById('text-area');

    textArea.addEventListener('input', () => 
    {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    });
  }

  return (
    <div className='task__text'>{ value }</div>
  );
}