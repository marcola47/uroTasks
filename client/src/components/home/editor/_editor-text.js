import { useState, useContext, useEffect, useRef } from 'react';
import { ProjectsContext } from '../../../app';
import { EditorContext } from '../../../pages/home';
import axios from 'axios';

export default function ItemText({ toggleEditor }) 
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { editorShown, editorData } = useContext(EditorContext);
  
  const [inputValue, setInputValue] = useState(editorData.content);
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
      if (taskObj.id === editorData.id && taskObj.content !== newContent)
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
      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update?type=content`, [editorData.id, newContent])
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

  useEffect(() => 
  {
    if (editorShown)
    {
      const textArea = document.getElementById('editable__text-area');
      const end = textArea.value.length;
    
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
      
      textArea.setSelectionRange(end, end);
      textArea.focus();
    }

  }, [editorShown])

  function handleSave(e) 
  {
    if (taskTextRef.current.value !== '')
      handleContentChange(inputValue);

    const editorBg = document.querySelector('.editor__bg');

    if (e.target === editorBg)
      toggleEditor();
  }

  function handleDiscard()
  {
    return
  }

  function handleKeyDown(e)
  {
    
    if (e.key === "Enter")
    {
      const textArea = document.getElementById('editable__text-area');
      textArea.blur();

      toggleEditor();
      handleSave(e);
    }

  }

  function handleInputGrowth()
  {
    const textArea = document.getElementById('editable__text-area');

    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
  }

  return (
      <textarea  
          id='editable__text-area' 
          ref={ taskTextRef } 
          value={ inputValue } 
          onChange={ e => {setInputValue(e.target.value);} } 
          onBlur={ e => {handleSave(e)} } 
          onKeyDown={ handleKeyDown }
          onInput={ handleInputGrowth }
      />
  );
}